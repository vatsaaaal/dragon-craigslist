import jwt from "jsonwebtoken";
import { client } from "../../server.js";
import { config } from "../../config.js";

export default async function handler(req, res) {
  const { email, password } = req.body;
  const JWT_SECRET = config.JWT_SECRET;

  try {
    const result = await client.query(
      'SELECT * FROM "user" WHERE email = $1 AND password = $2;',
      [email, password]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const user = result.rows[0];
    const token = jwt.sign({ userId: user.user_id }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ token, message: "Login successful" });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).send("Error logging in.");
  }
}
