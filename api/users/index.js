import { client } from "../../server.js"; // Update path as necessary
import { Verifier } from "academic-email-verifier";

export default async function handler(req, res) {
  if (req.method === "GET") {
    // Fetch all users
    try {
      const result = await client.query('SELECT * FROM "user";');
      res.status(200).json(result.rows);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).send("Error fetching users.");
    }
  } else if (req.method === "POST") {
    // Create a new user
    const { username, password, first_name, last_name, email, school_name } = req.body;

    try {
      const isAcademic = await Verifier.isAcademic(email);
      if (!isAcademic) {
        return res
          .status(400)
          .json({ error: "Invalid email: must be an academic (.edu) email." });
      }

      const institutionName = await Verifier.getInstitutionName(email);
      const finalSchoolName = school_name || institutionName || "Unknown";

      const result = await client.query(
        `INSERT INTO "user" (username, password, first_name, last_name, email, school_name)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [username, password, first_name, last_name, email, finalSchoolName]
      );

      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).send("Error creating user.");
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}