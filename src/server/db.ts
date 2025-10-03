import sqlite3 from "sqlite3";
import { Database, open } from "sqlite";
import fs from "fs";
import path from "path"
import type { AbiturientInfo, StudentInfo } from "../shared/models";
import {initialStudentCard, initialAbiturientCard} from "./initial-card.ts"

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
            CREATE TABLE IF NOT EXISTS students_info (
                id TEXT PRIMARY KEY,
                title TEXT NOT NULL,
                subtitle TEXT NOT NULL,
                content TEXT NOT NULL,
                image TEXT NOT NULL
            ) 
        `);

        await db.exec(`
            CREATE TABLE IF NOT EXISTS abiturients_info (
                id TEXT PRIMARY KEY,
                title TEXT NOT NULL,
                subtitle TEXT NOT NULL,
                content TEXT NOT NULL,
                image TEXT NOT NULL
            ) 
        `);

        await students.createList(initialStudentCard);
        await abiturients.createList(initialAbiturientCard);        
    }

    return db;
}

function getDbInstance(): Database<sqlite3.Database, sqlite3.Statement>{
    if (!dbInstance) {
        throw new Error("База даних не ініціалізована");
    }
    return dbInstance;
}

const abiturients = {
    async all(): Promise<AbiturientInfo[]>{
        const db = getDbInstance();
        const abit_rows = await db.all(`SELECT * FROM abiturients_info`);
        return abit_rows as AbiturientInfo[];
    },
    
    async get(id: String): Promise<AbiturientInfo | null> {
        const db = getDbInstance();
        return await db.get(`SELECT * FROM abiturients_info WHERE id = ?`, [id]) as StudentInfo | null;
    },

    async createList(cards: AbiturientInfo[]) {
        for (const card of cards) {
            await this.create(card);
        }  
    },

    async create(card: AbiturientInfo): Promise<AbiturientInfo> {
        const db = getDbInstance();
        await db.run (`INSERT INTO abiturients_info (id, title, subtitle, content, image) VALUES (?, ?, ?, ?, ?)`,
            [card.id, card.title, card.subtitle, card.content, card.image]);
        return card;
    },

    async update(card: AbiturientInfo) {
        const db = getDbInstance();
        await db.run(
            `UPDATE abiturients_info SET title = ?, subtitle = ?, content = ?, image = ? WHERE id =? `,
            [ card.title, card.subtitle, card.content, card.image, card.id ]
        );
        return card;
    },

    async delete(id: string): Promise<void> {
        const db = getDbInstance();
        
        const existingCard = await db.get(`SELECT id FROM abiturients_info WHERE id = ?`, [id]);
        if (!existingCard) {
            throw new Error(`Картку з ID '${id}' не знайдено`);
        }
        
        await db.run(`DELETE FROM abiturients_info WHERE id = ?`, [id]);
    }
}

const students = {
    async all(): Promise<StudentInfo[]> {
        const db = getDbInstance();
        const stud_rows = await db.all(`SELECT * FROM students_info`);
        return stud_rows as StudentInfo[];
    },

    async createList(cards: StudentInfo[]) {
        for (const card of cards) {
            await this.create(card);  
        }        
    },

    async create(card: StudentInfo): Promise<StudentInfo> {
        const db = getDbInstance();
        await db.run(`INSERT INTO students_info (id, title, subtitle, content, image) VALUES (?, ?, ?, ?, ?)`,
                    [card.id, card.title, card.subtitle, card.content, card.image]
        );
        return card;
    },

    async get(id: String): Promise<StudentInfo | null> {
        const db = getDbInstance();
        const card = await db.get(`SELECT * FROM students_info WHERE id = ?`, [id]);
        return card as StudentInfo | null;
    },

    async update(card: StudentInfo) {
        const db = getDbInstance();
        await db.run(`
        UPDATE students_info
        SET title = ?, subtitle = ?, content = ?, image = ?
        WHERE id = ?`, 

        [card.title, card.subtitle, card.content, card.image, card.id]
        );
        
        return card;
    },

    async delete(id: string): Promise<void> {
        const db = getDbInstance();

        const existingCard = await db.get(`SELECT id FROM students_info WHERE id = ?`, [id]);
        
        if (!existingCard) {
            throw new Error(`Картку з ID '${id}' не знайдено`);
        }

        await db.run(`DELETE FROM students_info WHERE id = ?`, [id]);
    }
}

export {
    initDb,
    abiturients,
    students
}