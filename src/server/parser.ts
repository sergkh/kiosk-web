import fetch from "node-fetch";
import * as cheerio from "cheerio";
import { URL } from "url";
import type { Article, ArticleDetails } from "../shared/models";

const BASE_URL = "https://vsau.org/novini";


export async function parseAllNews(): Promise<Pick<Article & ArticleDetails, "title" | "image" | "content">[]> {
  try {
    const response = await fetch(BASE_URL, {
      headers: { "User-Agent": "Mozilla/5.0" },
    });
    if (!response.ok) {
      throw new Error(`Не вдалося завантажити список новин: ${response.status}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);
    const newsContainers = $("div.node.clearfix");

    const articles: Article[] = [];

    newsContainers.each((_, el) => {
      const titleLinkElement = $(el).find("a[href]").first();
      const imageElement = $(el).find("img").first();

      if (titleLinkElement.length) {
        const link = new URL(titleLinkElement.attr("href") || "", BASE_URL).href;
        const image = imageElement.length
          ? new URL(imageElement.attr("src") || "", BASE_URL).href
          : undefined;

        articles.push({
          title: titleLinkElement.text().trim(),
          link,
          content: "",
          image,
        });
      }
    });

    const detailedArticles = await Promise.all(
      articles.map(async (article) => {
        try {
          const detailsResponse = await fetch(article.link, {
            headers: { "User-Agent": "Mozilla/5.0" },
          });
          if (!detailsResponse.ok) {
            throw new Error(`Не вдалося завантажити деталі для ${article.link}: ${detailsResponse.status}`);
          }

          const detailsHtml = await detailsResponse.text();
          const $$ = cheerio.load(detailsHtml);

          const content = $$("div.field-item.even, div.content, article, div.node-content")
            .text()
            .replace(/\s+/g, " ")
            .trim();

          const detailsImageElement = $$("div.content img, article img, div.node-content img").first();
          const detailsImage = detailsImageElement.length
            ? new URL(detailsImageElement.attr("src") || "", article.link).href
            : undefined;

          return {
            title: article.title,
            image: detailsImage || article.image,
            content: content,
          };
        } catch (err) {
          console.error(err);
          return null; 
        }
      })
    );

    
    return detailedArticles.filter(Boolean) as Pick<Article & ArticleDetails, "title" | "image" | "content">[];

  } catch (error) {
    console.error(`Під час парсингу новин сталася помилка:`, error);
    return [];
  }
}