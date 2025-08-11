// import
import articlesData from '../data/algoirthms.json'; // typo:  algorithms -> algoirthms
import "./style.css"


const ArticleGrid = () => {
  const articles = articlesData.articles;

  return (
    <div className="container">
      <h2 className="section-title">Algorithm Topics</h2>
      <div className="articles-grid">
        {articles.map(article => (
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
                {article.readTime > 0 && (
                  <span className="read-time">{article.readTime} min read</span>
                )}
                <span className={`difficulty ${article.difficulty.toLowerCase()}`}>
                  {article.difficulty}
                </span>
                {article.externalUrl && (
                  <span className="external-indicator">🔗 External</span>
                )}
              </div>
            </div>
          </a>
        ))}
      </div>
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
            <p>Learn essential algorithms and data structures through interactive examples, practice problems, and comprehensive tutorials.</p>
            <p>From basic sorting algorithms to advanced graph theory - everything you need for coding interviews and competitive programming.</p>

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