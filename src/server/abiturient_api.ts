import express from "express"
import {getAbiturientInfo} from "./db.ts"

const cards = express.Router();

cards.use(express.json());

cards.get("/api/abiturient-info", async (req, res) => {
    try {
        const data = await getAbiturientInfo();
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Дані не отримано" });
    }       
});

export default cards;