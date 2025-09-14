import fetch from "node-fetch";
import * as cheerio from "cheerio";
import { URL } from "url";
import type { Article } from "../shared/models";

const BASE_URL = "https://vsau.org/novini";

export async function parseNews(): Promise<Article[]> {
  const response = await fetch(BASE_URL, {
    headers: { "User-Agent": "Mozilla/5.0" }
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch news: ${response.status}`);
  }

  const html = await response.text();
  const $ = cheerio.load(html);
  const newsContainers = $("div.node.clearfix");

  const articles: Article[] = [];

  newsContainers.each((_, el) => {
    const titleLinkElement = $(el).find("a[href]").first();
    const contentElement = $(el).find("p.my-2");
    const imageElement = $(el).find("img").first();

    let cleanedContent = "";

    if (contentElement.length) {
      const contentText = contentElement.text().trim();
      
      const match = contentText.match(/(\d{2}\.\d{2}\.\d{4})\s*(\d+)?/);
      
      if (match) {
        cleanedContent = contentText.replace(match[0], "").trim();
      } else {
        cleanedContent = contentText;
      }
    }

    if (titleLinkElement.length) {
      const link = new URL(titleLinkElement.attr("href") || "", BASE_URL).href;
      const image = imageElement.length
        ? new URL(imageElement.attr("src") || "", BASE_URL).href
        : undefined;

      articles.push({
        title: titleLinkElement.text().trim(),
        link,
        content: cleanedContent,
        image,
      });
    }
  });

  return articles;
}
