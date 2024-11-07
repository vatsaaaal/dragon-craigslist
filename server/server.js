import express from "express";
import pkg from "pg";
import fs from "fs";
import { Server } from "socket.io";
import http from "http";

const { Client } = pkg;
const app = express();
const server = http.createServer(app);
const PORT = 3000;

app.use(express.json());

const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173", // Resolve CROS issue but not working
      methods: ["GET", "POST"],
      credentials: true
    }
  });

let client;

async function loadConfig() {
    const envConfig = JSON.parse(fs.readFileSync("env.json", "utf-8"));
    return {
        user: envConfig.PG_USER,
        host: envConfig.PG_HOST,
        database: envConfig.PG_DATABASE,
        password: envConfig.PG_PASSWORD,
        port: envConfig.PG_PORT,
    };
}

async function initializeDatabaseConnection() {
    const config = await loadConfig();
    client = new Client(config);
    await client.connect();
    console.log("Connected to PostgreSQL successfully!")
}

initializeDatabaseConnection().catch(error => {
    console.error("Failed to connect to PostgreSQL:", error);
    process.exit(1);
})

// --------------------- CRUD ROUTES FOR USERS ---------------------

// Create a new user
app.post("/users", async (req, res) => {
    const { username, password, first_name, last_name, email, school_name } = req.body;
    try {
        const result = await client.query(
            `INSERT INTO "user" (username, password, first_name, last_name, email, school_name)
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [username, password, first_name, last_name, email, school_name]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).send("Error creating user.");
    }
});

// Get all users
app.get("/users", async (req, res) => {
    try {
        const result = await client.query('SELECT * FROM "user";');
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).send("Error fetching users.");
    }
});

// Get a single user by ID
app.get("/users/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const result = await client.query('SELECT * FROM "user" WHERE user_id = $1;', [id]);
        if (result.rows.length === 0) {
            return res.status(404).send("User not found.");
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).send("Error fetching user.");
    }
});

// Update a user by ID
app.post("/users/:id", async (req, res) => {
    const { id } = req.params;
    const { username, password, first_name, last_name, email, school_name } = req.body;
    try {
        const result = await client.query(
            `UPDATE "user" 
             SET username = $1, password = $2, first_name = $3, last_name = $4, email = $5, school_name = $6 
             WHERE user_id = $7 RETURNING *;`,
            [username, password, first_name, last_name, email, school_name, id]
          );
          if (result.rows.length === 0) {
            return res.status(404).send("User not found.");
          }
          res.json(result.rows[0]);
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).send("Error updating user.")
    }
});

// Delete a user by ID
app.delete("/users/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const result = await client.query('DELETE FROM "user" WHERE user_id = $1 RETURNING *;', [id]);
        if (result.rows.length === 0) {
            return res.status(404).send("User not found.");
        }
        res.send("User deleted successfully.");
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).send("Error deleting user.");
    }
});

// --------------------- CRUD ROUTES FOR PRODUCTS ---------------------

// Create a new product
app.post("/products", async (req, res) => {
    const { title, isbn, author, genre, date_published, price, condition, quantity, description, user_id } = req.body;
    try {
        const result = await client.query(
            `INSERT INTO product (title, isbn, author, genre, date_published, price, condition, quantity, description, user_id) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
            [title, isbn, author, genre, date_published, price, condition, quantity, description, user_id]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error("Error creating product:", error);
        res.status(500).send("Error creating product.");
    }
})

// Get all products
app.get("/products", async (req, res) => {
    try {
        const result = await client.query(`SELECT * FROM product;`);
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).send("Error fetching products.");
    }
})

// Get a single product by ID
app.get("/products/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const result = await client.query(`SELECT * FROM product WHERE id = $1;`, [id]);
        if (result.rows.length === 0) {
            return res.status(404).send("Product not found.");
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error("Error fetching product:", error);
        res.status(500).send("Error fetching product.");
    }
})

// Update a product by ID
app.put("/products/:id", async (req, res) => {
    const { id } = req.params;
    const { title, isbn, author, genre, date_published, price, condition, quantity, description, user_id } = req.body;
    try {
      const result = await client.query(
        `UPDATE product 
         SET title = $1, isbn = $2, author = $3, genre = $4, date_published = $5, price = $6, condition = $7, quantity = $8, description = $9, user_id = $10
         WHERE id = $11 RETURNING *`,
        [title, isbn, author, genre, date_published, price, condition, quantity, description, user_id, id]
      );
      if (result.rows.length === 0) {
        return res.status(404).send("Product not found.");
      }
      res.json(result.rows[0]);
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).send("Error updating product.");
    }
})

// Delete a product by ID
app.delete("/products/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const result = await client.query(`DELETE FROM product WHERE id = $1 RETURNING *;`, [id]);
        if (result.rows.length === 0) {
            return res.status(404).send("Product not found.");
        }
        res.send("Product deleted successfully.");
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).send("Error deleting product.");
    }
})

io.on('connection', (socket) => {
    console.log('A user connected');
  
    // Listen for messages from the client
    socket.on('message', (msg) => {
      // Broadcast the message to all connected clients
      io.emit('message', msg);
    });
  
    socket.on('disconnect', () => {
      console.log('A user disconnected');
    });
  });

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
})