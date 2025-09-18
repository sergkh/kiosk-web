import sqlite3 from "sqlite3";
import { open } from "sqlite";
import fs from "fs";
import type { StudentInfo } from "../src/shared/models";




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
                  <h3>Бла бла бла</h3>`,
        image: "/img/student-info/diamond.png"
    }
];


async function initDb() {
    const newDB = !fs.existsSync("app.db");

    const db = await open ({
        filename: "app.db",
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
    }

    return db;
}

async function insertDb(cards: StudentInfo[]) {
    const db = await initDb();

        for (const card of cards) {
            await db.run (`
                INSERT OR REPLACE  INTO students_info (id, title, subtitle, content, image)
                VALUES (?, ?, ?, ?, ?)`,

                [card.id, card.title, card.subtitle, card.content, card.image]   
        );
    }
    
    await db.close()
};
    

export async function getStudentInfo(): Promise<StudentInfo[]> {
    await insertDb(initialCards);

    const db = await initDb();

    const rows = await db.all(`SELECT * FROM students_info`); 
    await db.close(); 

    return rows as StudentInfo[]; 
}


export {initDb,
        insertDb
};


    