import express, { type Request, type Response } from "express";
import {getStudentsInfo, createStudentsInfo, updateStudentsInfo, deleteStudentsInfo} from "./db.ts";
import type {StudentInfo} from "../shared/models.ts";


const cards = express.Router();

cards.use(express.json());

cards.get("/api/student-info", async (req, res) => {
    try {
        const data = await getStudentsInfo();
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Дані не отримано" });
    }       
});

cards.post("/api/student-info", async (req, res) => {
    try {
        const card = req.body;
        const newCard = await createStudentsInfo(card);
        res.status(201).json(newCard);
    } catch(err) {
        console.error(err);
        res.status(500).json({error: "Помилка додавання картки"})
    }
});

cards.put("/api/student-info/:id", async (req: Request, res: Response) => {
    try {
        const card = req.body;   
        card.id = req.params.id;     

        const updateCard = await updateStudentsInfo(card);
        res.json(updateCard);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Дані не оновлено" });
    }
});

cards.delete("/api/student-info/:id", async (req: Request, res: Response) => {
    try {
        const card = { id: req.params.id } as StudentInfo;

        const delcard = await deleteStudentsInfo(card);
        res.status(204).json(delcard);
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