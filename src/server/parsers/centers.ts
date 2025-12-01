import fetch from "node-fetch";
import * as cheerio from "cheerio";
import { infoCards } from "../db";
import type { InfoCard } from "../../shared/models";
import { initialCards } from "../initial-card";

type CenterInfo = {
  title: string;
  content: string;
};

function normalizeText(text: string): string {
  return text.replace(/\s+/g, " ").trim().toLowerCase();
}

async function parseAllCentersFromUrl(url: string): Promise<CenterInfo[]> {
  if (!url || !url.startsWith("http")) return [];

  try {
    const urlObj = new URL(url);
    const baseUrl = `${urlObj.origin}${urlObj.pathname}`;

    const response = await fetch(baseUrl, { headers: { "User-Agent": "Mozilla/5.0" } });
    
    if (!response.ok) {
        return [];
    }

    const html = await response.text();
    const $ = cheerio.load(html);
    const cards: CenterInfo[] = [];

    $(".card-outline").each((_, element) => {
      const btnText = $(element).find("button").text().trim();
      if (!btnText) return;

      const title = btnText;

      const contentContainer = $(element).find(".card-body");
      
      contentContainer.find("img").each((_, img) => {
          const src = $(img).attr("src") || $(img).attr("data-src");
          if (src && !src.startsWith("http")) {
              try {
                const u = new URL(url);
                const cleanPath = src.startsWith("/") ? src : `/${src}`;
                $(img).attr("src", `${u.origin}${cleanPath}`);
              } catch (e) {}
          }
          $(img).addClass("img-fluid").css("max-width", "100%").css("height", "auto");
      });

      const contentHtml = contentContainer.html()?.trim() || "";

      cards.push({
        title: title,
        content: contentHtml
      });
    });

    return cards;

  } catch (error) {
    return [];
  }
}

export async function loadAllCenters() {
  try {
    const cardsToSync = initialCards.filter(c => c.category === "centers");
    
    const uniqueUrls = new Set(
        cardsToSync
          .map(c => c.resource)
          .filter(url => url && url.startsWith("http")) as string[]
    );

    if (uniqueUrls.size === 0) return;

    const scrapedDataMap = new Map<string, CenterInfo[]>();
    
    for (const url of uniqueUrls) {
        try {
          const u = new URL(url);
          const cleanKey = `${u.origin}${u.pathname}`;
          
          if (!scrapedDataMap.has(cleanKey)) {
              const data = await parseAllCentersFromUrl(url);
              scrapedDataMap.set(cleanKey, data);
          }
        } catch (e) { console.error(`Invalid URL config: ${url}`); }
    }

    let updatedCount = 0;

    for (const configCard of cardsToSync) {
        if (!configCard.resource || !configCard.resource.startsWith("http")) continue;

        let foundInfo: CenterInfo | undefined;
        
        try {
               const u = new URL(configCard.resource);
               const cleanKey = `${u.origin}${u.pathname}`;
               const pageData = scrapedDataMap.get(cleanKey);

               if (pageData) {
                   const targetNorm = normalizeText(configCard.title);
                   foundInfo = pageData.find(item => {
                       const itemNorm = normalizeText(item.title);
                       return itemNorm.includes(targetNorm) || targetNorm.includes(itemNorm);
                   });
               }
        } catch (e) {}

        const finalContent = foundInfo ? foundInfo.content : "no info";
        const existing = await infoCards.get(configCard.id);

        if (existing && 
            existing.content === finalContent &&
            existing.image === configCard.image &&
            existing.title === configCard.title
        ) continue;

        const centerCard: InfoCard = {
            ...configCard,
            title: configCard.title, 
            content: finalContent,
            published: true
        };

        updatedCount++;

        if (existing) {
            if (finalContent === "no info" && existing.content !== "no info" && existing.content) {
            }
            await infoCards.update({ ...existing, ...centerCard, published: existing.published });
        } else {
            await infoCards.create(centerCard);
        }
    }

    if (updatedCount > 0) {
      console.log(`Updated ${updatedCount} cards.`);
    }

  } catch (error) {
    console.error(" Помилка:", error);
    return;
  }
}