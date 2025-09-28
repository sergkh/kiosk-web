import express, { type Request, type Response } from "express";
import {createAbiturientsInfo, getAbiturientInfo, updateAbiturientInfo, deleteAbiturientInfo} from "./db.ts"
import type { AbiturientInfo } from "../shared/models.ts";


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

cards.post("/api/abiturient-info", async (req, res) => {
    try {
        const card = req.body;
        const newCard = await createAbiturientsInfo(card);
        res.status(201).json(newCard);
    } catch(err) {
        console.error(err);
        res.status(500).json({error: "Помилка додавання картки"})
    }
});

cards.put("/api/abiturient-info/:id", async (req: Request, res: Response) => {
    try {
        const card = req.body;   
        card.id = req.params.id;     

        const updateCard = await updateAbiturientInfo(card);
        res.json(updateCard);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Дані не оновлено" });
    }
});

cards.delete("/api/abiturient-info/:id", async (req: Request, res: Response) => {
    try {
        const card = { id: req.params.id } as AbiturientInfo;

        await deleteAbiturientInfo(card);
        res.json({ message: "Картку успішно видалено" });
    } catch (err: any) {
        console.error(err);
        
        if (err.message && err.message.includes('не знайдено')) {
            res.status(404).json({ error: err.message });
        } else {
            res.status(500).json({ error: "Помилка видалення картки" });
        }
    }
});

export default cards;