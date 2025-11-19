import "./style.css"
import { useUser } from "@clerk/clerk-react";
import { useState, useEffect } from 'react';
import BlurText from './BlurText';
import AnimatedContent from './AnimatedContent.jsx';
import FloatingLines from './FloatingLines';

const ArticleGrid = ({ Articles, isSignedIn, isAdmin }) => {

  const [category, setCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 6;

  const handleVerify = async (algoId, isChecked) => {
    try {
      // const response = await fetch("https://algo-verse-7sci.vercel.app/verify-algo", {
      const response = await fetch("http://127.0.0.1:8000/verify-algo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          algoId,
          isVerified: isChecked,
        }),
      });

      const data = await response.json();

      if (data.success) {
        console.log("Verification updated successfully");
      }
    } catch (err) {
      console.error("Verification update failed:", err);
    }
  };

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
                      <input
                        type="checkbox"
                        checked={article.isVerified}
                        onChange={(e) =>
                          handleVerify(article._id, e.target.checked)
                        }
                      />
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
  const { isLoaded, isSignedIn, user } = useUser();
  const user_id = user?.id || "guest";
  const [Articles, setArticles] = useState([]);
  const isAdmin = user?.publicMetadata?.isAdmin || false;

  // Backend API call
  const getArticles = async (userID, isAdmin) => {
    try {
      // const response = await fetch("https://algo-verse-7sci.vercel.app/get_algorithms", {
        const response = await fetch("http://127.0.0.1:8000/get_algorithms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userID, admin: isAdmin }),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (err) {
      console.error("Error fetching algorithms:", err);
      return { success: false, data: [] };
    }
  };

  useEffect(() => {
    if (!isLoaded) return;
    (async () => {
      const data = await getArticles(user_id, isAdmin);
      if (data && data.success && Array.isArray(data.data)) {
        setArticles(data.data);
      } else {
        setArticles([]);
      }
    })();
  }, [isLoaded, isSignedIn, user_id, isAdmin]);

  // Calculate stats based on the 'Articles' state
  const totalTopics = Articles.length;
  const beginnerTopics = Articles.filter(a => a.difficulty === 'Beginner').length;
  const intermediateTopics = Articles.filter(a => a.difficulty === 'Intermediate').length;
  const advancedTopics = Articles.filter(a => a.difficulty === 'Advanced').length;

  return (
    <main>
      <AnimatedContent >
        <div style={{ width: "100%", height: "600px", position: "relative" }}>

          <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
            <FloatingLines
              enabledWaves={['top', 'bottom']}
              lineCount={[10, 15, 20]}
              lineDistance={[8, 6, 4]}
              bendRadius={5.0}
              bendStrength={-0.5}
              interactive={true}
              parallax={true}
            />
          </div>
          <section className="hero" style={{ position: "relative", zIndex: 10 }}>

          <div className="container">
            <h1 className="flex justify-center">
              <BlurText
                text="DSA Learning Hub"
                delay={150}
                animateBy="words"
                direction="top"
                className="text-6xl"
              />
            </h1>
            <p className="hero-subtitle">Master Data Structures & Algorithms</p>

            <div className="hero-description text-black dark:text-gray-300">
              <p>Learn essential algorithms and data structures through interactive examples, practice
                problems, and comprehensive tutorials.</p>
              <p>From basic sorting algorithms to advanced graph theory - everything you need for coding
                interviews and competitive programming.</p>

              {/* --- UPDATED STATS --- */}
              <div className="hero-stats">
                <div className="stat">
                  <span className="stat-number">{totalTopics}</span>
                  <span className="stat-label">Topics</span>
                </div>
                <div className="stat">
                  <span className="stat-number">
                    {beginnerTopics}
                  </span>
                  <span className="stat-label">Beginner</span>
                </div>
                <div className="stat">
                  <span className="stat-number">
                    {intermediateTopics}
                  </span>
                  <span className="stat-label">Intermediate</span>
                </div>
                <div className="stat">
                  <span className="stat-number">
                    {advancedTopics}
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
        </div>

      </AnimatedContent>
      <section className="articles-section" id="articles">
        {/* Pass the state and props down to ArticleGrid */}
        <ArticleGrid
          Articles={Articles}
          isSignedIn={isSignedIn}
          isAdmin={isAdmin}
        />
      </section>
    </main>
  )
}