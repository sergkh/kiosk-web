import fetch from "node-fetch";
import * as cheerio from "cheerio";
import { URL } from "url";
import fs from "fs/promises";
import path from "path";
import crypto from 'crypto';
import { infoCards } from "../db"; 
import type { InfoCard } from "../../shared/models";
import config from "../config";
import { imageUrl } from "../upload";

const BASE_URL = config.rectoratBaseUrl;
const TARGET_CATEGORY = "rectorat_members"; 

const NBSP = '\u00A0'; 

type RectoratCard = {
  id: string;
  title: string;
  position: string;
  phone: string;
  image: string | null;
};

const UPLOADS_DIR = "./data/public/uploads";

async function downloadAndSaveImage(imageUrl: string): Promise<string | null> {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      console.warn(`Failed to download image from ${imageUrl}: ${response.statusText}`);
      return null;
    }

    const buffer = await response.arrayBuffer();
    const hash = crypto.createHash("sha1").update(Buffer.from(buffer)).digest("hex");
    const ext = path.extname(new URL(imageUrl).pathname);
    const filename = `${hash}${ext}`;
    const filePath = path.join(UPLOADS_DIR, filename);

    await fs.mkdir(UPLOADS_DIR, { recursive: true });
    await fs.writeFile(filePath, Buffer.from(buffer));

    return `/uploads/${filename}`;
  } catch (error) {
    console.error(`Error downloading or saving image ${imageUrl}:`, error);
    return null;
  }
}

async function parseRectorPage(): Promise<RectoratCard[]> {
  const response = await fetch(BASE_URL, { headers: { "User-Agent": "Mozilla/5.0" } });
  if (!response.ok) throw new Error(`Status: ${response.status}`);

  const html = await response.text();
  const $ = cheerio.load(html);
  const cards: RectoratCard[] = [];
  
  $("div.row.mb-2.py-2").each((_, el) => {
    const name = $(el).find("p.h5.font-weight-bold").text().trim();
    const allTexts = $(el).find("div.col p").toArray().map(p => $(p).text().trim()).filter(Boolean);

    let position = allTexts.find(text => text !== name && !text.toLowerCase().includes("тел")) || "";
    
    position = position.replace(/^[\(\)]+|[\(\)]+$/g, "").trim();

    const phoneRaw = allTexts.find(text => text.toLowerCase().startsWith("тел")) || "";
    
    let phone = phoneRaw.replace(/^(тел\.|тел|tel\.|tel|факс)\s*:?\s*/gi, "").trim();
    
    phone = phone.split(' ').join(NBSP).split('-').join(`-${NBSP}`); 

    const imageSrc = $(el).find("img.img-fluid").attr("src");
    let image: string | null = null;
    if (imageSrc) {
        image = new URL(imageSrc, BASE_URL).href;
        if (image.includes('/pro-universitet/assets')) {
            image = image.replace('/pro-universitet/assets', '/assets');
        }
    }

    const id = crypto.createHash("sha1").update(name || "unknown").digest("hex");

    if (name) {
      cards.push({ id: `rectorat_${id}`, title: name, position, phone, image });
    }
  });

  return cards;
}

export async function syncRectoratData() {
  console.log("Оновлюємо склад ректорату...");

  try {
    const parsedCards = await parseRectorPage();

    for (const [index, card] of parsedCards.entries()) {
      
      const cleanTitle = card.title;
      let subtitleContent = card.position;
      
      if (card.phone) {
        subtitleContent += ` | 📞${NBSP}${card.phone}`;
      }

      let localImage: string | null = null;
      if (card.image) {
        localImage = await downloadAndSaveImage(card.image);
      }

      const memberCard: InfoCard = {
        id: card.id,
        title: cleanTitle, 
        subtitle: subtitleContent,
        content: "", 
        image: localImage,
        category: TARGET_CATEGORY,
        subcategory: null,
        resource: `${BASE_URL}`,
        position: index, 
        published: true
      };

      const existing = await infoCards.get(card.id);
      if (existing) {
          await infoCards.update({ ...memberCard, published: existing.published });
      } else {
          await infoCards.create(memberCard);
      }
    }

    console.log(` Записано ${parsedCards.length} карток.`);
    return parsedCards.length;

  } catch (error) {
    console.error(" Помилка:", error);
    return 0;
  }
}