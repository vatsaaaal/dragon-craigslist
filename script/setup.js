import fs from "fs";
import pkg from "pg";
const { Client } = pkg;

async function loadConfig() {
  try {
    const envConfig = JSON.parse(fs.readFileSync("env.json", "utf8"));

    // Check if DATABASE_URL is present in the config
    if (!envConfig.DATABASE_URL) {
      const requiredFields = [
        "PG_USER",
        "PG_HOST",
        "PG_DATABASE",
        "PG_PASSWORD",
        "PG_PORT",
      ];

      // Validate config if DATABASE_URL is not present
      for (const field of requiredFields) {
        if (!envConfig[field]) {
          throw new Error(`Missing required configuration field: ${field}`);
        }
      }
    }

    return envConfig;
  } catch (err) {
    if (err.code === "ENOENT") {
      throw new Error(
        "env.json file not found. Please create it with your database configuration or include DATABASE_URL."
      );
    }
    throw new Error(`Error loading configuration: ${err.message}`);
  }
}

async function createClient(config) {
  // Use DATABASE_URL if available, else use individual fields
  if (config.DATABASE_URL) {
    return new Client({
      connectionString: config.DATABASE_URL,
      ssl: false, // Use true if the database requires SSL
    });
  } else {
    return new Client({
      user: config.PG_USER,
      host: config.PG_HOST,
      database: config.PG_DATABASE,
      password: config.PG_PASSWORD,
      port: config.PG_PORT,
    });
  }
}

async function setupDatabase() {
  let client;

  try {
    // Load and validate configuration
    const config = await loadConfig();

    // Create and connect client
    client = await createClient(config);
    await client.connect();
    console.log("Connected to PostgreSQL successfully!");

    // Check existing tables
    const checkTablesQuery = `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('user', 'product', 'message');
    `;

    const res = await client.query(checkTablesQuery);
    const existingTables = res.rows.map((row) => row.table_name);

    // Create user table if it doesn't exist
    if (!existingTables.includes("user")) {
      await client.query(`
        CREATE TABLE "user" (
          user_id SERIAL PRIMARY KEY,
          username VARCHAR(20) UNIQUE NOT NULL,
          password VARCHAR(100) NOT NULL,
          first_name VARCHAR(20) NOT NULL,
          last_name VARCHAR(20) NOT NULL,
          email VARCHAR(50) UNIQUE NOT NULL,
          school_name VARCHAR(50),
          phone VARCHAR(15),
          phone_visibility BOOLEAN DEFAULT FALSE,
          access_level VARCHAR(10) DEFAULT 'user',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
      console.log('Created "user" table successfully');
    } else {
      console.log('"user" table already exists');
    }

    // Create product table if it doesn't exist
    if (!existingTables.includes("product")) {
      await client.query(`
        CREATE TABLE product (
          id SERIAL PRIMARY KEY,
          title VARCHAR(100) NOT NULL,
          isbn VARCHAR(13) UNIQUE,
          author VARCHAR(100),
          genre VARCHAR(50),
          date_published DATE,
          price DECIMAL(10,2) NOT NULL,
          condition VARCHAR(50),
          quantity INT DEFAULT 1,
          description TEXT,
          user_id INTEGER REFERENCES "user"(user_id),
          book_image_url TEXT,
          date_posted TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          sale_completed BOOLEAN DEFAULT FALSE
        );
      `);
      console.log('Created "product" table successfully');
    } else {
      console.log('"product" table already exists');
    }

    // Create message table if it doesn't exist
    if (!existingTables.includes("message")) {
      await client.query(`
        CREATE TABLE message (
          id SERIAL PRIMARY KEY,
          content VARCHAR(255),
          created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          sender_id INTEGER REFERENCES "user"(user_id),
          receiver_id INTEGER REFERENCES "user"(user_id),
          read_status BOOLEAN DEFAULT FALSE,
          product_id INTEGER REFERENCES product(id)
        );
      `);
      console.log('Created "message" table successfully');
    } else {
      console.log('"message" table already exists');
    }

    console.log("Database setup completed successfully");
  } catch (err) {
    console.error("Database setup failed:", err.message);
    process.exit(1);
  } finally {
    if (client) {
      await client.end();
      console.log("Database connection closed");
    }
  }
}

setupDatabase();
