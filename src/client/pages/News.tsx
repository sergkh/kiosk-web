import { useEffect, useState } from "react";
import type { Article } from "../../shared/models";
import './News.css';
import { fetchNews } from "../lib/news";

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
    <div className="news-page">
      { 
        news.map((article, index) => (
          <NewsArticle key={index} article={article} />
        )) 
      }
    </div>
  );
}

export default News;
