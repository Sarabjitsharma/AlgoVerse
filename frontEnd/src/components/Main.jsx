import articlesData from '../data/algoirthms.json';
import "./style.css"
import { useUser } from "@clerk/clerk-react";
import { useState, useEffect } from 'react';

const ArticleGrid = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const user_id = user?.id || "not logged in";
  const [Articles, setArticles] = useState([]);
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

  useEffect(() => {
    // debug logs (remove later)
    // console.log('useEffect fired', { isLoaded, isSignedIn, user_id });
    if (isLoaded && isSignedIn && user_id !== "not logged in") {
      (async () => {
        const data = await getArticles(user_id);
        console.log("Fetched user algorithms:", data);

        if (data && data.success && Array.isArray(data.data)) {
          setArticles(data.data);  // ✅ store the actual array, not the wrapper object
        } else {
          setArticles([]);
        }
      })();
    } else if (isLoaded && !isSignedIn) {
      setArticles([]); // clear if logged out
    }
  }, [isLoaded, isSignedIn, user_id]);

  // Backend API call
  const getArticles = async (userID) => {
    try {
      const response = await fetch("https://algo-verse-7sci.vercel.app/get_algorithms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userID }), // ✅ change userID → id
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const res = await response.json();
      return res;
    } catch (err) {
      console.error("Error fetching algorithms:", err);
      return { success: false, algorithms: [] };
    }
  };

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
      <h2 className="section-title">My Algorithms</h2>

      {/* Category dropdown */}
      <div className="category-filter">
        <label htmlFor="category-filter" className="article-title">
          Filter by Category:
        </label>
        <select
          id="category-filter"
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setCurrentPage(1);
          }}
          className="category-dropdown"
        >
          <option value="All">All</option>
          {Array.from(new Set(Articles.map(a => a.category || "Uncategorized"))).map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Articles Grid */}
      <div className="articles-grid">
        {Articles && Articles.length > 0 ? (
          Articles
            .filter(article =>
              category === "All" ? true :
                (article.category || "").toLowerCase() === category.toLowerCase()
            )
            .slice((currentPage - 1) * articlesPerPage, currentPage * articlesPerPage)
            .map((article) => (
              <a
                key={article._id}
                href={`/algo/${article._id}`}
                className="article-card-link"
              >
                <div className="article-card">
                  <div className="article-tag">{article.category || "Uncategorized"}</div>
                  <h3 className="article-title">{article.title}</h3>
                  <p className="article-description">{article.description}</p>

                  <div className="article-meta">
                    {article.difficulty && (
                      <span className={`difficulty ${article.difficulty.toLowerCase()}`}>
                        {article.difficulty}
                      </span>
                    )}
                  </div>

                  {article.isVerified && (
                    <span className="human-verified-badge">✅ Human Verified</span>
                  )}

                  {isAdmin && (
                    <label>
                      Verify this algorithm &nbsp;
                      <input type="checkbox" />
                    </label>
                  )}
                </div>
              </a>
            ))
        ) : (
          <p className="text-gray-500 text-center mt-6">
            {isSignedIn
              ? "No algorithms found for this user."
              : "Please sign in to see your algorithms."}
          </p>
        )}
      </div>

      {/* ✅ Fixed Pagination */}
      {Articles && Articles.length > articlesPerPage && (
        <div className="pagination">
          <button
            className="pagination-btn"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="pagination-info">
            Page {currentPage} of {Math.ceil(Articles.length / articlesPerPage)}
          </span>
          <button
            className="pagination-btn"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage >= Math.ceil(Articles.length / articlesPerPage)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default function Main() {
  return (
    <main>
      <section className="hero">
        <div className="container">
          <h1>DSA Learning Hub</h1>
          <p className="hero-subtitle">Master Data Structures & Algorithms</p>

          <div className="hero-description">
            <p>Learn essential algorithms and data structures through interactive examples, practice
              problems, and comprehensive tutorials.</p>
            <p>From basic sorting algorithms to advanced graph theory - everything you need for coding
              interviews and competitive programming.</p>

            <div className="hero-stats">
              <div className="stat">
                <span className="stat-number">{articlesData.articles.length}</span>
                <span className="stat-label">Topics</span>
              </div>
              <div className="stat">
                <span className="stat-number">
                  {articlesData.articles.filter(a => a.difficulty === 'Beginner').length}
                </span>
                <span className="stat-label">Beginner</span>
              </div>
              <div className="stat">
                <span className="stat-number">
                  {articlesData.articles.filter(a => a.difficulty === 'Intermediate').length}
                </span>
                <span className="stat-label">Intermediate</span>
              </div>
              <div className="stat">
                <span className="stat-number">
                  {articlesData.articles.filter(a => a.difficulty === 'Advanced').length}
                </span>
                <span className="stat-label">Advanced</span>
              </div>
            </div>

            <a href="#articles" className="cta-button">
              <div className="text-gray-100">
                Start Learning →
              </div>
            </a>
          </div>
        </div>
      </section>

      <section className="articles-section" id="articles">
        <ArticleGrid />
      </section>
    </main>
  )
}
