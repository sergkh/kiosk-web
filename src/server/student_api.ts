import express from "express"
import {getStudentInfo} from "./db.ts"

const cards = express.Router();

cards.use(express.json());

cards.get("/api/student-info", async (req, res) => {
    try {
        const data = await getStudentInfo();
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Дані не отримано" });
    }       
});

export default cards;