import sqlite3 from "sqlite3";
import { open } from "sqlite";
import fs from "fs";
import type { StudentInfo } from "../shared/models";
import path from "path"


const initialCards: StudentInfo[] = [
    {
        id: "rules",
        title: "Правила вступу",
        subtitle: "Ознайомтесь з актуальними правилами прийому",
        content: `<h1>Загальні положення</h1>
                  <ol><li>Правила прийому до ВНАУ...</li></ol>
                  <h3>Бла бла бла</h3>`,
        image: "/img/student-info/rules.png"
    },

    {
        id: "specialities",
        title: "Спеціальності",
        subtitle: "Ознайомтесь з спеціальностями",
        content: `<h1>Загальні положення</h1>
                  <ol><li>Правила прийому до ВНАУ...</li></ol>
                  <h3>Бла бла бла бла бла бла</h3>`,
        image: "/img/student-info/diamond.png"
    }
];


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

        await addStudentsInfo(initialCards, db);     
    }

    return db;
}

async function addStudentsInfo(cards: StudentInfo[], database: any) {
        for (const card of cards) {
            await database.run (`
                INSERT OR REPLACE  INTO students_info (id, title, subtitle, content, image)
                VALUES (?, ?, ?, ?, ?)`,

                [card.id, card.title, card.subtitle, card.content, card.image]   
        );
    }
    
};
    
const db = await initDb();

export async function getStudentInfo(): Promise<StudentInfo[]> {
    const rows = await db.all(`SELECT * FROM students_info`);
    return rows as StudentInfo[]; 
}




    