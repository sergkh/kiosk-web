import { useEffect, useState } from "react";
import type { Article } from "../../shared/models";
import './News.css';
// @ts-ignore We have no types for js-cache
import cache from "js-cache";

const localNewsCache = new cache.Cache({
  max: 1,
  ttl: 1000 * 60 * 60 // 1 hour
});

async function fetchNews(): Promise<Article[]> {
  const cached = localNewsCache.get('news');
  
  if (cached) return localNewsCache.get('news') as Article[];
  
  const result = await fetch('/news')
  const news = await result.json() as Article[];
  localNewsCache.set('news', news);
  return news;
}

type ArticleProps = {
  article: Article
};

function NewsArticle({ article }: ArticleProps) {
  return (
    <div className=".article"> 
      <h1>{article.title}</h1>
      <img src={article.image} alt={article.title} />      
      <p>{article.content}</p>      
    </div>
  );
}


function News() {
  const [news, setNews] = useState<Article[]>([]);

  useEffect(() => {
    fetchNews().then(setNews).catch(console.error);
  }, []);

  return (
    <div>
      { 
        news.map((article, index) => (
          <NewsArticle key={index} article={article} />
        )) 
      }
    </div>
  );
}

export default News;
