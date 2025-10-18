import sqlite3 from "sqlite3";
import { Database, open } from "sqlite";
import fs from "fs";
import path from "path"
import type { InfoCard } from "../shared/models";
import {initialCards} from "./initial-card.ts"

let dbInstance: Database<sqlite3.Database, sqlite3.Statement> | null = null; 

async function initDb() {
  const dbDir = "./data";
  const dbPath = path.join(dbDir, "app.db");

  
  if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
  }

  const newDB = !fs.existsSync(dbPath);
  
  const db = await open ({
      filename: dbPath,
      driver: sqlite3.Database,
  });

  dbInstance = db;

  if (newDB) {
      await db.exec(`
        CREATE TABLE IF NOT EXISTS info_cards (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            subtitle TEXT,
            content TEXT,
            image TEXT,
            category TEXT NOT NULL,
            subcategory TEXT,
            resource TEXT,
            position INTEGER,
            published BOOLEAN DEFAULT TRUE,
            date DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

      await infoCards.createList(initialCards);
  }

  return db;
}

function getDbInstance(): Database<sqlite3.Database, sqlite3.Statement>{
    if (!dbInstance) {
        throw new Error("База даних не ініціалізована");
    }
    return dbInstance;
}

export type QueryParams = {
  limit?: number, 
  category?: string, 
  orderByDate?: boolean
  includeUnpublished?: boolean
}

const infoCards = {
  async all({ category, orderByDate, limit, includeUnpublished }: QueryParams): Promise<InfoCard[]>{
    const db = getDbInstance();
    const select = "SELECT * FROM info_cards";
    const where = category ? ' WHERE category = ?' : '';
    const unpublishedClause = includeUnpublished ? '' : category ? ' AND published = TRUE' : ' WHERE published = TRUE';

    const orderClause = orderByDate ? ' ORDER BY date DESC' : ' ORDER BY position ASC';
    const limitClause = limit ? ' LIMIT ?' : '';

    const params = [category, limit].filter(Boolean);

    return await db.all(select + where + unpublishedClause + orderClause + limitClause, params) as InfoCard[];
  },

  async get(id: String, category?: string): Promise<InfoCard | null> {
    const db = getDbInstance();
    if (category) {
      return await db.get(`SELECT * FROM info_cards WHERE id = ? AND category = ?`, [id, category]) as InfoCard | null;
    }
    return await db.get(`SELECT * FROM info_cards WHERE id = ?`, [id]) as InfoCard | null;
  },

  async createList(cards: InfoCard[]) {
      for (const card of cards) {
          await this.create(card);
      }  
  },

  async create(card: InfoCard): Promise<InfoCard> {
      const db = getDbInstance();
      await db.run (`INSERT INTO info_cards (id, title, subtitle, content, image, category, subcategory, resource, position, published) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [card.id, card.title, card.subtitle, card.content, card.image, card.category, card.subcategory, card.resource, card.position, card.published]);
      return card;
  },

  async update(card: InfoCard) {
      const db = getDbInstance();
      await db.run(
          `UPDATE info_cards SET title = ?, subtitle = ?, content = ?, image = ?, category = ?, subcategory = ?, resource = ?, position = ?, published = ? WHERE id = ?`,
          [ card.title, card.subtitle, card.content, card.image, card.category, card.subcategory, card.resource, card.position, card.published, card.id ]
      );
      return card;
  },

  async delete(id: string): Promise<void> {
      const db = getDbInstance();
      
      const existingCard = await db.get(`SELECT id FROM info_cards WHERE id = ?`, [id]);
      if (!existingCard) {
          throw new Error(`Картку з ID '${id}' не знайдено`);
      }
      
      await db.run(`DELETE FROM info_cards WHERE id = ?`, [id]);
  }
}

export { initDb, infoCards };