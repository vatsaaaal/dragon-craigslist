import express from "express";
import { client } from "../server.js";

const router = express.Router();

router.get("/all-users", async (req, res) => {
    try {
        let users = await client.query('SELECT * FROM "user";');
        res.json(users.rows);
    } catch(error) {
        console.error("Error fetching users information:", error);
        res.status(500).send("Error fetching users information.");
    }
});


router.get("/all-products", async (req, res) => {
    try {
        let products = await client.query('SELECT * FROM product;');
        res.json(products.rows);
    } catch(error) {
        console.error("Error fetching products:", error);
        res.status(500).send("Error fetching products.");
    }
})


router.put("/block-user/:id", async (req, res) => {
    const userId = parseInt(req.params.id, 10);
    const { is_blocked } = req.body;

    if (typeof is_blocked !== "boolean") {
        return res.status(400).json({ message: "Invalid value for 'is_blocked' field." });
    }

    try {
        const result = await client.query(
            `
            UPDATE "user"
            SET is_blocked = $1
            WHERE user_id = $2
            RETURNING *;
            `,
            [is_blocked, userId]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: "User not found." });
        }

        res.status(200).json(result.rows[0]); // Return the updated user
    } catch (error) {
        console.error("Error updating user block status:", error);
        res.status(500).json({ message: "Error updating user status." });
    }
});





export default router;