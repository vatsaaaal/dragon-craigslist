import express from "express";
import jwt from "jsonwebtoken";
import { client } from "../server.js";
import { config } from "../config.js";

const router = express.Router();
const JWT_SECRET = config.JWT_SECRET;

// Create a new user (Registration)
router.post("/", async (req, res) => {
  const { username, password, first_name, last_name, email, school_name } =
    req.body;
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

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await client.query(
      'SELECT * FROM "user" WHERE email = $1 AND password = $2;',
      [email, password]
    );

    if (result.rows.length === 0) {
      return res.status(401).send("Invalid email or password.");
    }

    const user = result.rows[0];
    const token = jwt.sign({ userId: user.user_id }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 3600000,
    });
    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).send("Error logging in.");
  }
});

// Get all users
router.get("/", async (req, res) => {
  try {
    const result = await client.query('SELECT * FROM "user";');
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).send("Error fetching users.");
  }
});

// Get a single user by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await client.query(
      'SELECT * FROM "user" WHERE user_id = $1;',
      [id]
    );
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
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { username, password, first_name, last_name, email, school_name } =
    req.body;
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
    res.status(500).send("Error updating user.");
  }
});

// Delete a user by ID
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await client.query(
      'DELETE FROM "user" WHERE user_id = $1 RETURNING *;',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).send("User not found.");
    }
    res.send("User deleted successfully.");
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).send("Error deleting user.");
  }
});

export default router;
