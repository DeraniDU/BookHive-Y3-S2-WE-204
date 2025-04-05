import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import swal from "sweetalert";
import Header from "../../components/Header";
import Footer from "../../components/Footer"; // Make sure to style this page similarly to Home.css

const Recommender = () => {
  const [user, setUser] = useState(null);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [tone, setTone] = useState("All");
  const [recommendations, setRecommendations] = useState([]);
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/api/recommend", {
        query,
        category,
        tone,
      });
      setRecommendations(response.data.recommendations);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      swal("Error", "Failed to fetch recommendations", "error");
    }
  };

  const categories = ["All", "Fiction", "Non-fiction", "History", "Science", "Romance"];
  const tones = ["All", "Happy", "Sad", "Angry", "Surprising", "Suspenseful"];

  return (
    <div className="recommender-container">
      <Header />

      <section id="recommender" className="hero">
        <h2 className="hero-title">Semantic Book Recommender</h2>
        <p className="hero-description">
          Get recommendations based on your thoughts and emotions.
        </p>
      </section>

      <form className="recommendation-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Describe a book or idea (e.g., A tale of survival and courage)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          required
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {categories.map((cat) => (
            <option key={cat}>{cat}</option>
          ))}
        </select>
        <select value={tone} onChange={(e) => setTone(e.target.value)}>
          {tones.map((tone) => (
            <option key={tone}>{tone}</option>
          ))}
        </select>
        <button type="submit">Get Recommendations</button>
      </form>

      <section className="recommendations">
        <h2 className="featured-books-title">Recommended Books</h2>
        <div className="book-list">
        {recommendations.map(([imageUrl, caption], index) => {
  // Split "Title by Author: Description"
  const [titleAuthor] = caption.split(":");
  const [title, author] = titleAuthor.split(" by ");

  return (
    <div className="book-item" key={index}>
      <img src={imageUrl} alt={title} className="book-image" />
      <h3 className="book-title">{title}</h3>
      <p className="book-author">{author}</p>
    </div>
  );
})}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Recommender;
