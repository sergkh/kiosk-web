import express, { type Request, type Response } from "express";
import {abiturients} from "./db.ts"
import { authorized } from "./auth.ts";
import { imageUrl, singleImageUpload } from "./upload.ts";

const cards = express.Router();

cards.get("/api/abiturient-info", async (req, res) => {
    res.json(await abiturients.all());
});

cards.get("/api/abiturient-info/:id", async (req, res) => {
    const info = await abiturients.get(req.params.id)

    if (!info) {
        return res.status(404).json({ error: "Картку не знайдено" });
    }
    
    res.json(info);
});

cards.post("/api/abiturient-info", authorized, singleImageUpload, async (req, res) => {
    const card = req.body;
    console.log('Creating new abiturient card:', card);
    card.id = crypto.randomUUID();
    card.image = imageUrl((req.file as Express.Multer.File)?.filename);
    const newCard = await abiturients.create(card);
    res.status(201).json(newCard);
});

cards.put("/api/abiturient-info/:id", authorized, singleImageUpload, async (req: Request, res: Response) => {    
    const card = req.body;  
    card.id = req.params.id;
    
    console.log('Updating abiturient card:', card);

    const oldCard = await abiturients.get(card.id);
    if (!oldCard) {
        return res.status(404).json({ error: "Картку не знайдено" });
    }
    
    card.image = imageUrl((req.file as Express.Multer.File)?.filename) || oldCard.image;

    const updateCard = await abiturients.update(card);
    res.json(updateCard);
});

cards.delete("/api/abiturient-info/:id", authorized, async (req: Request, res: Response) => {
    await abiturients.delete(req.params.id);
    res.status(204);
});

export default cards;