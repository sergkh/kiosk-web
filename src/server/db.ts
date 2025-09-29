import sqlite3 from "sqlite3";
import { Database, open } from "sqlite";
import fs from "fs";
import path from "path"
import type { AbiturientInfo, StudentInfo } from "../shared/models";
import {initialStudentCard, initialAbiturientCard} from "./initial-card.ts"

let dbInstance: Database<sqlite3.Database, sqlite3.Statement> | null = null; 

export async function initDb() {
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

        await addStudentsInfo(initialStudentCard);
        await addAbiturientsInfo(initialAbiturientCard);        
    }

    return db;
}

function getDbInstance(): Database<sqlite3.Database, sqlite3.Statement>{
    if (!dbInstance) {
        throw new Error("База даних не ініціалізована");
    }
    return dbInstance;
}

export async function getAbiturientInfo(): Promise<AbiturientInfo[]>{
    const db = getDbInstance();
    const abit_rows = await db.all(`SELECT * FROM abiturients_info`);
    return abit_rows as AbiturientInfo[];
};

async function addAbiturientsInfo(cards: AbiturientInfo[]) {
    const db = await getDbInstance();
        for (const card of cards) {
            await createAbiturientsInfo(card);
        }  
};

export async function createAbiturientsInfo(card: AbiturientInfo): Promise<AbiturientInfo> {
    const db = await getDbInstance();
    const existingCard = await db.get(`SELECT id FROM abiturients_info WHERE id = ?`, [card.id]);
    if (existingCard) {
        throw new Error(`ID '${card.id}' вже використовується. Будь ласка, введіть інший.`);
    }

    await db.run (`
        INSERT INTO abiturients_info (id, title, subtitle, content, image)
        VALUES (?, ?, ?, ?, ?)`,

        [card.id, card.title, card.subtitle, card.content, card.image]   
);
    return card;
};

export async function updateAbiturientInfo(card: AbiturientInfo) {
    const db = await getDbInstance();
    await db.run(`
        UPDATE abiturients_info
        SET title = ?, subtitle = ?, content = ?, image = ?
        WHERE id =? `,
        [ card.title, card.subtitle, card.content, card.image, card.id ]
    );
    return card;
};

export async function deleteAbiturientInfo(card: AbiturientInfo): Promise<void> {
    const db = await getDbInstance();
    
    const existingCard = await db.get(`SELECT id FROM abiturients_info WHERE id = ?`, [card.id]);
    if (!existingCard) {
        throw new Error(`Картку з ID '${card.id}' не знайдено`);
    }
    
    await db.run(`DELETE FROM abiturients_info WHERE id = ?`, [card.id]);
}

async function addStudentsInfo(cards: StudentInfo[]) {
    const db = await getDbInstance();
        for (const card of cards) {
            await db.run (`
                INSERT OR REPLACE  INTO students_info (id, title, subtitle, content, image)
                VALUES (?, ?, ?, ?, ?)`,

                [card.id, card.title, card.subtitle, card.content, card.image]   
        );
    }
    
};

    

export async function getStudentInfo(): Promise<StudentInfo[]> {
    const db = await getDbInstance();
    const stud_rows = await db.all(`SELECT * FROM students_info`);
    return stud_rows as StudentInfo[];
};



