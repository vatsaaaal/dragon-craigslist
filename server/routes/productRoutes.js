import express from "express";
import { client } from "../server.js";

const router = express.Router();

// Create a new product
router.post("/add-products", async (req, res) => {
  const {
    title,
    isbn,
    author,
    genre,
    date_published,
    price,
    condition,
    quantity,
    description,
    user_id,
  } = req.body;
  try {
    const result = await client.query(
      `INSERT INTO product (title, isbn, author, genre, date_published, price, condition, quantity, description, user_id) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [
        title,
        isbn,
        author,
        genre,
        date_published,
        price,
        condition,
        quantity,
        description,
        user_id,
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).send("Error creating product.");
  }
});

// Get all products
router.get("/all-books", async (req, res) => {
  try {
    const result = await client.query(`
      SELECT title, author, price, book_image_url, id
      FROM product;
    `);
    console.log(result.rows);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).send("Error fetching products.");
  }
});

// Get a single product by ID
router.get("/products/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await client.query(`SELECT * FROM product WHERE id = $1;`, [
      id,
    ]);
    if (result.rows.length === 0) {
      return res.status(404).send("Product not found.");
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).send("Error fetching product.");
  }
});

// Update a product by ID
router.put("/products/:id", async (req, res) => {
  const { id } = req.params;
  const {
    title,
    isbn,
    author,
    genre,
    date_published,
    price,
    condition,
    quantity,
    description,
    user_id,
  } = req.body;
  try {
    const result = await client.query(
      `UPDATE product 
         SET title = $1, isbn = $2, author = $3, genre = $4, date_published = $5, price = $6, condition = $7, quantity = $8, description = $9, user_id = $10
         WHERE id = $11 RETURNING *`,
      [
        title,
        isbn,
        author,
        genre,
        date_published,
        price,
        condition,
        quantity,
        description,
        user_id,
        id,
      ]
    );
    if (result.rows.length === 0) {
      return res.status(404).send("Product not found.");
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).send("Error updating product.");
  }
});

// Delete a product by ID
router.delete("/products/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await client.query(
      `DELETE FROM product WHERE id = $1 RETURNING *;`,
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).send("Product not found.");
    }
    res.send("Product deleted successfully.");
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).send("Error deleting product.");
  }
});

export default router;
