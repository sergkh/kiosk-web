import fetch from "node-fetch";
import * as cheerio from "cheerio";
import type { FacultyInfo } from "./../shared/models";
import { facultiesList } from "../shared/facultiesList";

export async function parseFacultyInfo(url: string) {

  const response = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
  if (!response.ok) {
    throw new Error(`Не вдалося завантажити сторінку факультету: ${response.status}`);
  }

  const html = await response.text();
  const $ = cheerio.load(html);

  const title = $("h1").first().text().trim();

  const selectors = [
    "div.col-lg-8.mb-3",
    "div.col.pt-3.content"
  ];

  let combinedHtml = "";

  for (const sel of selectors) {
    $(sel).each((_, el) => {
      $(el).find("img").each((_, img) => {
        const src = $(img).attr("src") || $(img).attr("data-src");
        if (src) {
          if (src.startsWith("http://") || src.startsWith("https://")) {
            $(img).attr("src", src);
          } else if (src.startsWith("//")) {
            $(img).attr("src", `https:${src}`);
          } else if (src.startsWith("/")) {
            const baseUrl = new URL(url);
            $(img).attr("src", `${baseUrl.origin}${src}`);
          } else {
            const baseUrl = new URL(url);
            $(img).attr("src", `${baseUrl.origin}/${src}`);
          }
        }
});

      const blockHtml = $(el).html();
      if (blockHtml) combinedHtml += blockHtml + "\n\n";
    });
  }

  if (!combinedHtml.trim()) {
    console.warn(`[ПОПЕРЕДЖЕННЯ]: Не знайдено контент у ${url}`);
    combinedHtml = $("body").html() || "";
  }

  return {
    title,
    description: combinedHtml,
    image: null, 
  };
}

export async function loadAllFaculties(): Promise<FacultyInfo[]> {
  const faculties = await Promise.all(
    facultiesList.map(async (faculty) => {
      try {
        const info = await parseFacultyInfo(faculty.link);
        return {
          id: faculty.id,
          name: info.title || faculty.name,
          link: faculty.link,
          image: info.image || faculty.image, 
          description: info.description,
        } as FacultyInfo;
      } catch (error) {
        console.warn(`Помилка при парсингу ${faculty.name}:`, error);
        return null;
      }
    })
  );

  return faculties.filter(Boolean) as FacultyInfo[];
}
