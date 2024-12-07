import { client } from "../../server.js";

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === "GET") {
    try {
      const result = await client.query(
        'SELECT * FROM "user" WHERE user_id = $1;',
        [id]
      );
      if (result.rows.length === 0) {
        return res.status(404).send("User not found.");
      }
      res.status(200).json(result.rows[0]);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).send("Error fetching user.");
    }
  } else if (req.method === "PUT") {
    const { username, password, first_name, last_name, email, school_name } = req.body;
    try {
      const result = await client.query(
        `UPDATE "user"
         SET username = $1, password = $2, first_name = $3, last_name = $4, email = $5, school_name = $6
         WHERE user_id = $7 RETURNING *`,
        [username, password, first_name, last_name, email, school_name, id]
      );
      if (result.rows.length === 0) {
        return res.status(404).send("User not found.");
      }
      res.status(200).json(result.rows[0]);
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).send("Error updating user.");
    }
  } else if (req.method === "DELETE") {
    try {
      const result = await client.query(
        'DELETE FROM "user" WHERE user_id = $1 RETURNING *;',
        [id]
      );
      if (result.rows.length === 0) {
        return res.status(404).send("User not found.");
      }
      res.status(200).send("User deleted successfully.");
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).send("Error deleting user.");
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
