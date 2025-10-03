import express, { type Request, type Response } from "express";
import {students} from "./db.ts";
import { authorized } from "./auth.ts";
import { imageUrl, singleImageUpload } from "./upload.ts";

const cards = express.Router();

cards.get("/api/student-info", async (req, res) => {
    res.json(await students.all());
});

cards.get("/api/student-info/:id", async (req, res) => {
    const info = await students.get(req.params.id);
    if (!info) {
        return res.status(404).json({ error: "Картку не знайдено" });
    }    
    res.json(info);
});

cards.post("/api/student-info", authorized, singleImageUpload, async (req, res) => {
    const card = req.body;
    console.log('Creating new student card:', card);
    card.id = crypto.randomUUID();
    card.image = imageUrl((req.file as Express.Multer.File)?.filename);
    const newCard = await students.create(card);
    res.status(201).json(newCard);
});

cards.put("/api/student-info/:id", authorized, singleImageUpload, async (req: Request, res: Response) => {
    const card = req.body;   
    card.id = req.params.id;
    
    console.log('Updating student card:', card);

    const oldCard = await students.get(card.id);
    if (!oldCard) {
        return res.status(404).json({ error: "Картку не знайдено" });
    }
    
    card.image = imageUrl((req.file as Express.Multer.File)?.filename) || oldCard.image;
    
    const updateCard = await students.update(card);
    res.json(updateCard);
});

cards.delete("/api/student-info/:id", authorized, async (req: Request, res: Response) => {
    const delcard = await students.delete(req.params.id);
    res.status(204).json(delcard);
});

export default cards;