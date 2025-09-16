import fetch from "node-fetch";
import * as cheerio from "cheerio";
import { URL } from "url";
import type { Article } from "../shared/models";

const BASE_URL = "https://vsau.org/novini";

async function loadArticleContents(link: string): Promise<string> {
  const detailsResponse = await fetch(link, {
    headers: { "User-Agent": "Mozilla/5.0" },
  });

  if (!detailsResponse.ok) {
    throw new Error(`Не вдалося завантажити деталі для ${link}: ${detailsResponse.status}`);
  }

  const detailsHtml = await detailsResponse.text();
  const $$ = cheerio.load(detailsHtml);

  const article = $$("div.content p:not(.d-none)");

  const content = article.text().trim();

  return content;
}

export async function parseAllNews(): Promise<Article[]> {
  console.log("Loading articles");

  try {
    const response = await fetch(BASE_URL, { headers: { "User-Agent": "Mozilla/5.0" }});

    if (!response.ok) {
      throw new Error(`Не вдалося завантажити список новин: ${response.status}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);
    const newsContainers = $("div.node.clearfix");
    const elements = newsContainers.toArray();


    const articles: Article[] = await Promise.all(
      elements
      .filter(el => $(el).find("a[href]").first().length > 0)
      .map(async (el) => {
        const titleLinkElement = $(el).find("a[href]").first();
        const imageElement = $(el).find("img.logo").first();

        const link = new URL(titleLinkElement.attr("href") || "", BASE_URL).href;
        const image = imageElement.length
          ? new URL(imageElement.attr("src") || "", BASE_URL).href
          : undefined;

        const content = await loadArticleContents(link);

        return ({
          title: titleLinkElement.text().trim(),
          link,
          content,
          image,
        }) as Article;
    })); 

    
    return articles; // .filter(Boolean) as Pick<Article & ArticleDetails, "title" | "image" | "content">[]

  } catch (error) {
    console.error(`Під час парсингу новин сталася помилка:`, error);
    return [];
  }
}