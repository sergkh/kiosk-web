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

export async function ensureInitialCenters(): Promise<void> {

  const cardsToSync = initialCards.filter(
    (c) => c.category === "centers");

  const allCards = await infoCards.all({ includeUnpublished: true });

  for (const card of cardsToSync) {
    const existing = allCards.find(c => c.id === card.id);

    if (!existing) {
      await infoCards.create({
        ...card,
        content: card.content || "no info",
      });
    } else {
      const needsUpdate = existing.resource !== card.resource || 
                          existing.image !== card.image || 
                          existing.subcategory !== card.subcategory;
      
      if (needsUpdate) {
          await infoCards.update({
            ...existing,
            resource: card.resource,
            image: card.image,
            subcategory: card.subcategory,
            position: card.position,
            published: true
          });
      }
    }
  }
}

async function parseCenterInfo(url: string, targetTitle: string): Promise<CenterInfo> {
  const response = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
  if (!response.ok) {
    throw new Error(`Не вдалося завантажити сторінку центрів: ${response.status}`);
  }

  const html = await response.text();
  const $ = cheerio.load(html);

  let foundTitle = "";
  let foundContent = "";
  
  const targetNormalized = normalizeText(targetTitle);
  
  const foundHeadersOnPage: string[] = [];

  $(".card-outline").each((_, element) => {
    const rawBtnText = $(element).find("button").text();
    const btnTextNormalized = normalizeText(rawBtnText);
    
    foundHeadersOnPage.push(rawBtnText.trim());

    if (btnTextNormalized.includes(targetNormalized) || targetNormalized.includes(btnTextNormalized)) {
        
        foundTitle = rawBtnText.trim();
        foundTitle = foundTitle.charAt(0).toUpperCase() + foundTitle.slice(1).toLowerCase();

        const contentContainer = $(element).find(".card-body");

        contentContainer.find("img").each((_, img) => {
            const src = $(img).attr("src") || $(img).attr("data-src");
            if (src) {
              if (src.startsWith("http")) {
                $(img).attr("src", src);
              } else if (src.startsWith("//")) {
                $(img).attr("src", `https:${src}`);
              } else {
                 const u = new URL(url); 
                 const cleanPath = src.startsWith("/") ? src : `/${src}`;
                 $(img).attr("src", `${u.origin}${cleanPath}`);
              }
              $(img).addClass("img-fluid").css("max-width", "100%").css("height", "auto");
            }
        });

        const blockHtml = contentContainer.html();
        if (blockHtml && blockHtml.trim().length > 0) {
             foundContent = blockHtml.trim();
        }
        
        return false; 
    }
  });

  return { title: foundTitle || targetTitle, content: foundContent } as CenterInfo;
}

export async function syncCenterInfo(center: InfoCard): Promise<InfoCard> {
  const { title, content } = await parseCenterInfo(center.resource!, center.title);
  if (!content && center.content) return center;
  return { ...center, title, content };
}

export async function loadAllCenters(): Promise<void> {

  const centerCards = await infoCards.all({ category: "centers", includeUnpublished: true });
  
  if (centerCards.length === 0) {
      return;
  }

  const allLoaded = centerCards
    .filter(center => center.resource)
    .map(async (center) => {
      try {
        const info = await parseCenterInfo(center.resource!, center.title);
        const isDefaultContent = center.content === "no info";
        const hasNewContent = info.content && info.content.length > 0;

        if ((center.content != info.content && hasNewContent) || (isDefaultContent && hasNewContent)) {
          const updatedCenter = {
            ...center,
            title: info.title || center.title,
            content: info.content
          };
          return await infoCards.update(updatedCenter);
        }
      } catch (error) {
        return null;
      }
    });

  await Promise.all(allLoaded);
}