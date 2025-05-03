import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import swal from "sweetalert";
import { Container, Icon, Card, Button, Loader, Divider } from "semantic-ui-react";
import Header from "../../components/Header";
import Footer from "../../components/Footer"; 
import {
  CardMeta,
  CardHeader,
  CardDescription,
  CardContent,
  Image,
} from 'semantic-ui-react'

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
      <section id="hero" className="hero" style={{
        background: "linear-gradient(135deg, rgba(28, 61, 90, 0.9), rgba(45, 55, 72, 0.9)), url('https://source.unsplash.com/random/1600x900/?library') center/cover no-repeat",
        padding: "120px 0",
        textAlign: "center",
        color: "#fff",
        position: "relative",
        overflow: "hidden"
      }}>
        <Container>
          <h1 style={{
            fontSize: "3.5rem",
            fontWeight: "bold",
            marginBottom: "20px",
            color: "#fff",
            textShadow: "0 2px 4px rgba(0,0,0,0.3)"
          }}>Semantic <span style={{ color: "#A6BCFF" }}>Recommender</span></h1>
          
          <p style={{
            fontSize: "1.5rem",
            maxWidth: "700px",
            margin: "0 auto 30px",
            lineHeight: "1.6"
          }}>
            Receive personalized book recommendations based on your preferences.
          </p>
          
          <div style={{ display: "flex", justifyContent: "center", gap: "20px", flexWrap: "wrap" }}>
            <Button 
              size="large"
              style={{
                background: "#A6BCFF",
                color: "#1C3D5A",
                padding: "15px 30px",
                borderRadius: "30px",
                fontWeight: "bold",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                transition: "transform 0.3s, box-shadow 0.3s"
              }}
              onClick={() => document.getElementById('book-search').scrollIntoView({ behavior: 'smooth' })}
              className="hover-grow"
            >
              <Icon name="search" /> Find Books
            </Button>
            
            <Button 
              size="large"
              style={{
                background: "transparent",
                color: "#fff",
                border: "2px solid #A6BCFF",
                padding: "15px 30px",
                borderRadius: "30px",
                fontWeight: "bold",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                transition: "transform 0.3s, box-shadow 0.3s, background 0.3s"
              }}
              onClick={() => document.getElementById('featured-books').scrollIntoView({ behavior: 'smooth' })}
              className="hover-grow-slight"
            >
              <Icon name="book" /> Explore Books
            </Button>
          </div>
          
          {/* Animated wave effect at bottom */}
          <div style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            height: "50px",
            background: "url('data:image/svg+xml;utf8,<svg viewBox=\"0 0 1200 120\" xmlns=\"http://www.w3.org/2000/svg\" preserveAspectRatio=\"none\"><path d=\"M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z\" opacity=\".25\" fill=\"%23FFFFFF\"/><path d=\"M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z\" opacity=\".5\" fill=\"%23FFFFFF\"/><path d=\"M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z\" fill=\"%23FFFFFF\"/></svg>') no-repeat center center",
            backgroundSize: "cover"
          }}></div>
        </Container>
      </section>

      {/* Search Form Section */}
      <div id="book-search" style={{ padding: "50px 0", backgroundColor: "#f9f9f9" }}>
        <Container>
          <form className="recommendation-form" onSubmit={handleSubmit} style={{ textAlign: "center" }}>
            <input
              type="text"
              placeholder="Describe a book or idea (e.g., A tale of survival and courage)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              required
              style={{
                padding: "10px 20px",
                borderRadius: "30px",
                border: "2px solid #A6BCFF",
                width: "100%",
                maxWidth: "600px",
                fontSize: "16px",
                marginBottom: "20px",
              }}
            />
            <div style={{ display: "flex", justifyContent: "center", gap: "15px", marginBottom: "20px" }}>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{
                  padding: "10px 20px",
                  borderRadius: "30px",
                  border: "2px solid #A6BCFF",
                  fontSize: "16px",
                  cursor: "pointer",
                  width: "200px"
                }}
              >
                {categories.map((cat) => (
                  <option key={cat}>{cat}</option>
                ))}
              </select>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                style={{
                  padding: "10px 20px",
                  borderRadius: "30px",
                  border: "2px solid #A6BCFF",
                  fontSize: "16px",
                  cursor: "pointer",
                  width: "200px"
                }}
              >
                {tones.map((tone) => (
                  <option key={tone}>{tone}</option>
                ))}
              </select>
            </div>
            <button type="submit" style={{
              padding: "15px 30px",
              borderRadius: "30px",
              fontSize: "16px",
              fontWeight: "bold",
              background: "#A6BCFF",
              border: "none",
              color: "#1C3D5A",
              cursor: "pointer",
              transition: "background 0.3s",
            }}>
              Get Recommendations
            </button>
          </form>
        </Container>
      </div>

      {/* Recommendations Section */}
      <section className="recommendations" style={{ padding: "50px 0" }}>
        <Container>
          <h2 className="featured-books-title" style={{
            textAlign: "center",
            fontSize: "2rem",
            fontWeight: "bold",
            marginBottom: "40px"
          }}>Recommended Books</h2>
          <div className="book-list" style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            gap: "20px"
          }}>
            {recommendations.map(([imageUrl, caption, description], index) => {
              const [titleAuthor] = caption.split(":");
              const [title, author] = titleAuthor.split(" by ");

              return (
                <Card key={index} style={{ boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}>
                  <Image src={imageUrl} wrapped ui={false} />
                  <CardContent>
                    <CardHeader>{title}</CardHeader>
                    <CardMeta>
                      <span>{author}</span>
                    </CardMeta>
                    <CardDescription>
                      {description}
                    </CardDescription>
                  </CardContent>
                  <CardContent extra>
                    <a>
                      <Icon name="user" />
                      22 Friends
                    </a>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </Container>
      </section>

      <Footer />
    </div>
  );
};

export default Recommender;
