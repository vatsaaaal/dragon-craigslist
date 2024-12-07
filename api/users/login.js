import jwt from "jsonwebtoken";
import { connectToDatabase } from "../../../server/db.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, password } = req.body;
  const JWT_SECRET = process.env.JWT_SECRET;

  try {
    const client = await connectToDatabase();

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
    res.status(500).json({ error: "Internal server error" });
  }
}
