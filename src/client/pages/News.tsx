import type { InfoCard } from "../../shared/models";
import './News.css';
import { useLoaderData } from "react-router";

type ArticleProps = {
  article: InfoCard
};

function NewsArticle({ article }: ArticleProps) {
  return (
    <div className="article">
      <div className="news-h1">
      <h1>{article.title}</h1>
      </div>
      <div className="news-content">
      { article.image && <img src={article.image} alt={article.title} /> }
      {article.content}   
      </div>
    </div>
  );
}


function News() {
  const news = useLoaderData() as InfoCard[];

  return (
    <div className="news-container">
      { 
        news.map((article, index) => (
          <NewsArticle key={index} article={article} />
        )) 
      }
    </div>
  );
}

export default News;
