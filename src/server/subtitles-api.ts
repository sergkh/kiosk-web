import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();

const CONFIG_PATH = path.join(process.cwd(), 'data', 'config.json');

router.get('/api/subtitles/config', (req, res) => {
    try {
        if (!fs.existsSync(CONFIG_PATH)) {
            return res.json({ videos: [] });
        }

        const fileContent = fs.readFileSync(CONFIG_PATH, 'utf-8');

        if (!fileContent.trim()) {
            return res.json({ videos: [] });
        }

        const json = JSON.parse(fileContent);
        res.json(json);

    } catch (error) {
        console.error('Error reading config:', error);
        res.status(500).json({ error: 'Failed to read config', videos: [] });
    }
});

export default router;