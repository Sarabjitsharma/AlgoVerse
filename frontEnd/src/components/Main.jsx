import articlesData from '../data/algoirthms.json';
import "./style.css"
import { useState } from 'react';
import { useUser } from "@clerk/clerk-react";

const ArticleGrid = () => {
  const { user } = useUser();
  const isAdmin = user?.publicMetadata?.isAdmin || false;

  const [category, setCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 6;

  const articles = articlesData.articles;

  // Get unique full categories, ignore case
  const categories = Array.from(
    new Map(
      articles.map(article => [
        article.category.toLowerCase(),
        article.category
      ])
    ).values()
  );

  // Filter articles by selected category
  const filteredArticles = category === 'All'
    ? articles
    : articles.filter(article => article.category.toLowerCase() === category.toLowerCase());

  // Pagination logic
  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);
  const startIndex = (currentPage - 1) * articlesPerPage;
  const paginatedArticles = filteredArticles.slice(startIndex, startIndex + articlesPerPage);

  // Handle page change
  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  }

  return (
    <div className="container">
      <h2 className="section-title">Algorithm</h2>

      {/* Category dropdown */}
      <div className="mb-4">
        <label
          htmlFor="category-filter"
          className="article-title text-gray-900 dark:text-gray-100"
        >
          Filter by Category:
        </label>
        <select
          id="category-filter"
          value={category}
          onChange={(e) => { setCategory(e.target.value); setCurrentPage(1); }}
          className="ml-2 p-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        >
          <option value="All">All</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>


      <div className="articles-grid">
        {paginatedArticles.map(article => (
          <a
            key={article._id}
            href={article.externalUrl || article.path || `/pages/${article.slug}.html`}
            className="article-card-link"
            target={article.externalUrl ? "_blank" : "_self"}
            rel={article.externalUrl ? "noopener noreferrer" : undefined}
          >
            <div className="article-card">
              <div className="article-tag">{article.category}</div>
              <h3 className="article-title">{article.title}</h3>
              <p className="article-description">{article.description}</p>

              <div className="article-meta">
                {article.readTime > 0 && <span className="read-time">{article.readTime} min read</span>}
                <span className={`difficulty ${article.difficulty.toLowerCase()}`}>{article.difficulty}</span>
                {article.externalUrl && <span className="external-indicator">🔗 External</span>}
              </div>

              {article.isVerified && <span className="human-verified-badge">✅ Human Verified</span>}

              {isAdmin && (
                <label>
                  Verify this article &nbsp;
                  <input type="checkbox" />
                </label>
              )}
            </div>
          </a>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="pagination-btn"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="pagination-info"> Page {currentPage} of {totalPages} </span>
          <button
            className="pagination-btn"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ArticleGrid;
