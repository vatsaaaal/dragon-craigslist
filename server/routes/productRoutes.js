import express from "express";
import { client } from "../server.js";
import getUserIdFromToken from "../middleware/getUserIdFromToken.js";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../../public/assets")); // Set destination folder for uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Generate a unique filename
  },
});
const upload = multer({ storage });

// Create product
router.post(
  "/add-products",
  upload.single("book_image"), // Expecting 'book_image' field for the file
  getUserIdFromToken,
  async (req, res) => {
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
    } = req.body;

    const user_id = res.locals.user_id; // Extract user ID from middleware
    const book_image_url = req.file ? `${req.file.filename}` : null; // Get file URL

    try {
      const result = await client.query(
        `INSERT INTO product (title, isbn, author, genre, date_published, price, condition, quantity, description, user_id, book_image_url) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
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
          book_image_url,
        ]
      );
      res.status(201).json(result.rows[0]); // Send back the created product
    } catch (error) {
      console.error("Error creating product:", error);
      res.status(500).send("Error creating product.");
    }
  }
);

// Get all products
router.get("/all-books", async (req, res) => {
  try {
    const result = await client.query(`
      SELECT *
      FROM product;
    `);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).send("Error fetching products.");
  }
});

// Get a single product by ID
router.get("/:id", getUserIdFromToken, async (req, res) => {
  const { id } = req.params; // Get product ID from URL
  const loggedInUserId = res.locals.user_id; // Extract user ID from middleware

  try {
    // Fetch the product details
    const result = await client.query(`SELECT * FROM product WHERE id = $1;`, [
      id,
    ]);
    if (result.rows.length === 0) {
      return res.status(404).send("Product not found.");
    }

    const product = result.rows[0];

    // Determine ownership
    const isOwner = product.user_id === loggedInUserId;

    res.json({ product, isOwner }); // Send product details and ownership info
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).send("Error fetching product.");
  }
});

// Update a product by ID
router.put(
  "/:id",
  upload.single("book_image"), // Expecting 'book_image' field for the file
  async (req, res) => {
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
    } = req.body;
    const book_image_url = req.file ? `${req.file.filename}` : null; // Get file URL if provided

    try {
      const fieldsToUpdate = [
        title,
        isbn,
        author,
        genre,
        date_published,
        price,
        condition,
        quantity,
        description,
        id,
      ];
      let updateQuery = `UPDATE product 
         SET title = $1, isbn = $2, author = $3, genre = $4, date_published = $5, price = $6, condition = $7, quantity = $8, description = $9`;

      if (book_image_url) {
        updateQuery += `, book_image_url = '${book_image_url}'`;
      }

      updateQuery += ` WHERE id = $10 RETURNING *`;

      const result = await client.query(updateQuery, fieldsToUpdate);

      if (result.rows.length === 0) {
        return res.status(404).send("Product not found.");
      }
      res.json(result.rows[0]);
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).send("Error updating product.");
    }
  }
);

// Delete a product by ID
router.delete("/:id", async (req, res) => {
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
