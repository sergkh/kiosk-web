import { Router } from "express";
import { parseFacultyInfo } from "./faculties-parser.ts";


const router = Router();

router.get("/info", async (req, res) => {
  const { link } = req.query;
  if (!link || typeof link !== "string") {
    return res.status(400).json({ error: "Не вказано посилання на факультет" });
  }
  try {
    const info = await parseFacultyInfo(link);
    res.json(info);
  } catch (error) {
    res.status(500).json({ error: "Не вдалося отримати інформацію про факультет" });
  }
});

export default router;

export async function getFaculties() {
  const response = await fetch('/api/faculties');
  if (!response.ok) {
    throw new Error('Не вдалося завантажити факультети');
  }
  return response.json();
}