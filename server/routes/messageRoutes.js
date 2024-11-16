import express from "express";
import { client } from "../server.js";

const router = express.Router();

// Create a new message
router.post("/", async (req, res) => {
  const { content, sender_id, receiver_id } = req.body;
  try {
    const result = await client.query(
      "INSERT INTO message (content, created, sender_id, receiver_id, read_status) VALUES ($1, NOW(), $2, $3, false) RETURNING *",
      [content, sender_id, receiver_id]
    );
    res.status(201).json(result.rows);
  } catch (error) {
    console.error("Error saving message:", error);
    res.status(500).send("Error saving message.");
  }
});

// Get messages based on user id
router.get("/:user_id", async (req, res) => {
  const { user_id } = req.params;

  try {
    const result = await client.query(
      "SELECT id, sender_id, content FROM message WHERE sender_id = $1 OR receiver_id = $1 ORDER BY created ASC",
      [user_id]
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ error: "No messages found for this user." });
    }

    res.json(result.rows);
  } catch (error) {
    console.error("Error retrieving messages:", error);
    res.status(500).send("Error retrieving messages");
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

    res.json(result.rows);
  } catch (error) {
    console.error("Error retrieving messages:", error);
    res.status(500).send("Error retrieving messages");
  }
});

// Update the read status of a message when a user views it
router.put("/read/:message_id", async (req, res) => {
  const { message_id } = req.params;
  try {
    await client.query("UPDATE message SET read_status = true WHERE id = $1", [
      message_id,
    ]);
    res.status(200).json({ message: "Message marked as read" });
  } catch (error) {
    console.error("Error marking message as read:", error);
    res.status(500).send("Error marking message as read.");
  }
});

// Delete messages
router.delete("/:message_id", async (req, res) => {
  const { message_id } = req.params;
  try {
    await client.query("DELETE FROM message WHERE id = $1", [message_id]);
    res.status(200).json({ message: "Message deleted" });
  } catch (error) {
    console.error("Error deleting message:", error);
    res.status(500).send("Error deleting message.");
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
    res.status(200).json({ message: "Message edited" });
  } catch (error) {
    console.error("Error editing message:", error);
    res.status(500).send("Error editing message.");
  }
});

// Get messages between 2 client sender and retriever
router.get("/:sender_id/:retriever_id", async (req, res) => {
  const { sender_id, retriever_id } = req.params;

  try {
    const result = await client.query("SELECT * FROM messages WHERE (sender_id = $1 AND retriever_id = $2) OR  (sender_id = $2 AND retriever_id = $1) ORDER BY timestamp ASC;", [sender_id, retriever_id]);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error loading message:", error);
    res.status(500).send("Error loading message.");
  }
})

export default router;
