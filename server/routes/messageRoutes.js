import express from "express";
import { client } from "../server.js";
import getUserIdFromToken from "../middleware/getUserIdFromToken.js"; // Import the middleware

const router = express.Router();

// Create a new message
router.post("/", getUserIdFromToken, async (req, res) => {
  const { content, receiver_id, room_id } = req.body;
  const sender_id = res.locals.user_id;
  try {
    const result = await client.query(
      "INSERT INTO message (content, created, sender_id, receiver_id, read_status, product_id) VALUES ($1, NOW(), $2, $3, false, $4) RETURNING *",
      [content, sender_id, receiver_id, room_id]
    );
    return res.status(201).json(result.rows);
  } catch (error) {
    console.error("Error saving message:", error);
    return res.status(500).send("Error saving message.");
  }
});

router.get("/past_product", getUserIdFromToken, async (req, res) => {
  console.log("Request received:", req);
  const user_id = res.locals.user_id; // Extract user ID from the token
  //const { product_id } = req.query; // Extract product ID from query parameters

  try {
    const result = await client.query(
      `SELECT DISTINCT
        p.id AS product_id,
        seller.user_id AS seller_id,
        seller.username AS seller_username,
        buyer.user_id AS buyer_id,
        buyer.username AS buyer_username
      FROM
        product p
      JOIN
        "user" seller ON p.user_id = seller.user_id
      LEFT JOIN
        message m ON m.product_id = p.id
      LEFT JOIN
        "user" buyer ON m.sender_id = buyer.user_id OR m.receiver_id = buyer.user_id
      WHERE
        (seller.user_id = $1 OR buyer.user_id = $1);
      `,
      [user_id] // Pass both product_id and user_id as parameters
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "No products found for this user." });
    }

    return res.json(result.rows);
  } catch (error) {
    console.error("Error retrieving products:", error);
    return res.status(500).send("Error retrieving products.");
  }
});


// Get messages based on user id
router.get("/past_messages/:product_id", getUserIdFromToken, async (req, res) => {
  const user_id = res.locals.user_id;
  const { product_id } = req.params;
  const { other_user_id } = req.query;

  try {
    const result = await client.query(
      `SELECT 
          m.id,
          m.content,
          m.created,
          m.sender_id,
          sender.username AS sender_username,
          m.receiver_id,
          receiver.username AS receiver_username,
          m.product_id
      FROM message m
      JOIN "user" sender ON m.sender_id = sender.user_id
      JOIN "user" receiver ON m.receiver_id = receiver.user_id
      WHERE 
          m.product_id = $1
          AND (
              (m.sender_id = $2 AND m.receiver_id = $3) OR 
              (m.sender_id = $3 AND m.receiver_id = $2)
          )
      ORDER BY 
          m.created ASC;`,
      [product_id, user_id, other_user_id]
    );

    if (result.rows.length === 0) {
      return res.status(201).json(result.rows);
    }

    return res.json(result.rows);
  } catch (error) {
    console.error("Error retrieving messages:", error);
    return res.status(500).send("Error retrieving messages");
  }
});

// Get all messages
router.get("/", async (req, res) => {
  try {
    const result = await client.query("SELECT * FROM message");

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ error: "No messages found for this user." });
    }

    return res.json(result.rows);
  } catch (error) {
    console.error("Error retrieving messages:", error);
    return res.status(500).send("Error retrieving messages");
  }
});

// Update the read status of a message when a user views it
router.put("/read/:message_id", async (req, res) => {
  const { message_id } = req.params;
  try {
    await client.query("UPDATE message SET read_status = true WHERE id = $1", [
      message_id,
    ]);
    return res.status(200).json({ message: "Message marked as read" });
  } catch (error) {
    console.error("Error marking message as read:", error);
    return res.status(500).send("Error marking message as read.");
  }
});

// Delete messages
router.delete("/:message_id", async (req, res) => {
  const { message_id } = req.params;
  try {
    await client.query("DELETE FROM message WHERE id = $1", [message_id]);
    return res.status(200).json({ message: "Message deleted" });
  } catch (error) {
    console.error("Error deleting message:", error);
    return res.status(500).send("Error deleting message.");
  }
});

// Edit the message
router.put("/edit/:message_id", async (req, res) => {
  const { message_id } = req.params;
  const { newContent } = req.body;
  try {
    await client.query(
      "UPDATE message SET content = $1 WHERE id = $2 RETURNING *",
      [newContent, message_id]
    );
    return res.status(200).json({ message: "Message edited" });
  } catch (error) {
    console.error("Error editing message:", error);
    return res.status(500).send("Error editing message.");
  }
});

router.post('/send_message', getUserIdFromToken, async (req, res) => {
  const { content, receiver_id } = req.body;
  const user_id = req.user.userId;

  if (!content || !receiver_id) {
    return res.status(400).json({ message: 'Content and receiver_id are required.' });
  }

  try {
    // Save the message to the database
    const query = `
      INSERT INTO message (sender_id, receiver_id, content)
      VALUES ($1, $2, $3) RETURNING *;
    `;
    const values = [user_id, receiver_id, content];
    const result = await client.query(query, values);
    const savedMessage = result.rows[0];
    console.log(savedMessage);

    return res.status(200).json({ message: 'Message sent successfully!' });
  } catch (error) {
    console.error('Error saving message:', error);
    return res.status(500).json({ message: 'Failed to send message.' });
  }
});

export default router;
