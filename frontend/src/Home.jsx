import React, { useEffect, useState } from "react";
import { auth } from "./firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import swal from "sweetalert";
import Header from "./components/Header";
import Footer from "./components/Footer";
import BookSearch from "./components/BookSearch";
import { Container, Icon, Card, Button, Loader, Divider } from "semantic-ui-react";
import "./Home.css";

const Home = () => {
  const [user, setUser] = useState(null);
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication state
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        navigate("/signin"); // Redirect to SignIn if no user is logged in
      } else {
        setUser(currentUser);
      }
    });

    // Fetch Featured Books
    const fetchFeaturedBooks = async () => {
      try {
        const response = await fetch(
          "https://openlibrary.org/search.json?q=technology&limit=20"
        );
        const data = await response.json();

        // Filter books with images and pick 6
        let booksWithImages = data.docs
          .filter((book) => book.cover_i) // Only books with cover images
          .slice(0, 6); // Get 6 books

        setFeaturedBooks(booksWithImages);
      } catch (error) {
        console.error("Error fetching featured books:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedBooks();
    return () => unsubscribe();
  }, [navigate]);

  // Handle Logout
  const handleLogout = async () => {
    try {
      await signOut(auth); // Ensure sign-out completes
      swal("Logged Out!", "You have been logged out successfully.", "success").then(() => {
        navigate("/signin"); // Redirect after SweetAlert confirmation
      });
    } catch (error) {
      swal("Error", error.message, "error");
    }
  };

  return (
    <div className="home-container">
      <Header />

      {/* Improved Hero Section */}
      <section id="hero" className="hero" style={{
        background: "linear-gradient(135deg, rgba(28, 61, 90, 0.9), rgba(45, 55, 72, 0.9)), url('https://source.unsplash.com/random/1600x900/?library') center/cover no-repeat",
        padding: "100px 0",
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
          }}>Welcome to <span style={{ color: "#A6BCFF" }}>BookHive</span></h1>
          
          <p style={{
            fontSize: "1.5rem",
            maxWidth: "700px",
            margin: "0 auto 30px",
            lineHeight: "1.6"
          }}>
            Your community platform to exchange, lend, and bid for books with ease!
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

      {/* Features Section */}
      <section style={{ 
        padding: "80px 0", 
        background: "#f9f9f9" 
      }}>
        <Container>
          <h2 style={{ 
            textAlign: "center", 
            fontSize: "2.2rem", 
            color: "#1C3D5A", 
            marginBottom: "50px",
            position: "relative"
          }}>
            How BookHive Works
            <div style={{ 
              width: "70px", 
              height: "4px", 
              background: "#A6BCFF", 
              margin: "15px auto 0" 
            }}></div>
          </h2>
          
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            flexWrap: "wrap", 
            gap: "20px" 
          }}>
            {[
              { 
                icon: "exchange", 
                title: "Exchange Books", 
                description: "Trade books with other members of the community and discover new reads." 
              },
              { 
                icon: "handshake", 
                title: "Lend Books", 
                description: "Lend your books to others or borrow from fellow book lovers in the community." 
              },
              { 
                icon: "gavel", 
                title: "Bid on Books", 
                description: "Find rare and unique books through our bidding system." 
              },
              { 
                icon: "lightbulb", 
                title: "Get Recommendations", 
                description: "Receive personalized book recommendations based on your preferences." 
              }
            ].map((feature, index) => (
              <div key={index} style={{ 
                flex: "1 1 250px", 
                textAlign: "center", 
                padding: "25px", 
                borderRadius: "10px", 
                background: "#fff", 
                boxShadow: "0 5px 15px rgba(0,0,0,0.05)", 
                transition: "transform 0.3s"
              }} className="hover-lift">
                <div style={{ 
                  width: "80px", 
                  height: "80px", 
                  borderRadius: "50%", 
                  background: "#1C3D5A", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center", 
                  margin: "0 auto 20px" 
                }}>
                  <Icon name={feature.icon} size="big" style={{ color: "#A6BCFF" }} />
                </div>
                <h3 style={{ fontSize: "1.5rem", color: "#1C3D5A", marginBottom: "15px" }}>{feature.title}</h3>
                <p style={{ fontSize: "1rem", color: "#555", lineHeight: "1.6" }}>{feature.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Featured Books Section - Enhanced */}
      <section id="featured-books" className="featured-books" style={{
        padding: "80px 0", 
        background: "#fff"
      }}>
        <Container>
          <h2 style={{ 
            textAlign: "center", 
            fontSize: "2.2rem", 
            color: "#1C3D5A", 
            marginBottom: "50px",
            position: "relative"
          }}>
            Featured Books
            <div style={{ 
              width: "70px", 
              height: "4px", 
              background: "#A6BCFF", 
              margin: "15px auto 0" 
            }}></div>
          </h2>
          
          {loading ? (
            <div style={{ textAlign: "center", padding: "50px 0" }}>
              <Loader active size="large" inline="centered">Loading Books</Loader>
            </div>
          ) : (
            <Card.Group itemsPerRow={3} stackable doubling>
              {featuredBooks.map((book) => (
                <Card key={book.key} style={{ 
                  boxShadow: "0 5px 20px rgba(0,0,0,0.05)", 
                  transition: "transform 0.3s, box-shadow 0.3s",
                  borderRadius: "12px",
                  overflow: "hidden"
                }} className="book-card-hover">
                  <div style={{ 
                    height: "250px", 
                    overflow: "hidden", 
                    backgroundColor: "#f3f4f6",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                  }}>
                    <img
                      src={`https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`}
                      alt={book.title}
                      style={{ 
                        height: "100%", 
                        objectFit: "contain", 
                        transition: "transform 0.5s" 
                      }}
                      className="book-image-zoom"
                    />
                  </div>
                  <Card.Content>
                    <Card.Header style={{ 
                      fontSize: "1.2rem", 
                      color: "#1C3D5A",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis"
                    }}>{book.title}</Card.Header>
                    <Card.Meta style={{ color: "#666", marginTop: "5px" }}>
                      {book.author_name?.join(", ") || "Unknown Author"}
                    </Card.Meta>
                    <Card.Description style={{ 
                      fontSize: "0.9rem", 
                      color: "#555", 
                      height: "40px",
                      overflow: "hidden",
                      marginTop: "10px"
                    }}>
                      {book.first_sentence?.slice(0, 100) || "No description available..."}
                    </Card.Description>
                  </Card.Content>
                  <Card.Content extra>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span>
                        <Icon name="calendar" /> {book.first_publish_year || "N/A"}
                      </span>
                      <span>
                        <Icon name="language" /> {book.language?.[0] || "N/A"}
                      </span>
                    </div>
                  </Card.Content>
                </Card>
              ))}
            </Card.Group>
          )}
          
          <div style={{ textAlign: "center", marginTop: "40px" }}>
            <Button style={{
              background: "#1C3D5A",
              color: "#fff",
              padding: "12px 25px",
              borderRadius: "30px",
              fontWeight: "bold",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
              transition: "background 0.3s"
            }} className="hover-btn">
              <Icon name="plus" /> Explore More Books
            </Button>
          </div>
        </Container>
      </section>

      {/* Book Search Section - Enhanced */}
      <section id="book-search" style={{
        padding: "80px 0",
        background: "linear-gradient(135deg, #1C3D5A 0%, #2C5282 100%)",
        color: "#fff"
      }}>
        <Container>
          <h2 style={{ 
            textAlign: "center", 
            fontSize: "2.2rem", 
            color: "#fff", 
            marginBottom: "50px",
            position: "relative"
          }}>
            Find Your Next Book
            <div style={{ 
              width: "70px", 
              height: "4px", 
              background: "#A6BCFF", 
              margin: "15px auto 0" 
            }}></div>
          </h2>
          
          <div style={{ 
            maxWidth: "800px", 
            margin: "0 auto", 
            background: "rgba(255,255,255,0.1)",
            padding: "30px",
            borderRadius: "15px",
            backdropFilter: "blur(10px)",
            boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
          }}>
            <BookSearch />
          </div>
        </Container>
      </section>

      {/* Community Testimonials Section */}
      <section style={{ 
        padding: "80px 0", 
        background: "#f5f7fa" 
      }}>
        <Container>
          <h2 style={{ 
            textAlign: "center", 
            fontSize: "2.2rem", 
            color: "#1C3D5A", 
            marginBottom: "50px",
            position: "relative"
          }}>
            What Our Community Says
            <div style={{ 
              width: "70px", 
              height: "4px", 
              background: "#A6BCFF", 
              margin: "15px auto 0" 
            }}></div>
          </h2>
          
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            flexWrap: "wrap", 
            gap: "30px" 
          }}>
            {[
              { 
                quote: "BookHive has transformed how I discover new books. The exchange system is brilliant and I've found gems I would have never picked up otherwise!", 
                author: "Sarah Johnson", 
                role: "Book Club Organizer" 
              },
              { 
                quote: "As a college student, the lending feature has been a lifesaver for textbooks and leisure reading alike. The community is incredibly supportive!", 
                author: "Michael Chen", 
                role: "Student" 
              },
              { 
                quote: "I've been collecting rare books for years, and the bidding system helps me connect with other collectors in a way that wasn't possible before.", 
                author: "James Wilson", 
                role: "Book Collector" 
              }
            ].map((testimonial, index) => (
              <div key={index} style={{ 
                flex: "1 1 300px", 
                background: "#fff", 
                padding: "30px", 
                borderRadius: "10px", 
                boxShadow: "0 5px 15px rgba(0,0,0,0.05)", 
                position: "relative"
              }}>
                <div style={{ 
                  position: "absolute",
                  top: "20px",
                  right: "20px",
                  fontSize: "4rem",
                  color: "#A6BCFF",
                  opacity: "0.2",
                  fontFamily: "Georgia, serif"
                }}>"</div>
                <p style={{ 
                  fontSize: "1.1rem", 
                  lineHeight: "1.8", 
                  color: "#555", 
                  marginBottom: "20px",
                  position: "relative",
                  zIndex: "1"
                }}>
                  {testimonial.quote}
                </p>
                <Divider />
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div style={{ 
                    width: "50px", 
                    height: "50px", 
                    borderRadius: "50%", 
                    background: "#1C3D5A", 
                    color: "#fff", 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center", 
                    marginRight: "15px",
                    fontSize: "1.2rem",
                    fontWeight: "bold"
                  }}>
                    {testimonial.author.charAt(0)}
                  </div>
                  <div>
                    <h4 style={{ 
                      margin: "0", 
                      color: "#1C3D5A", 
                      fontSize: "1.1rem" 
                    }}>{testimonial.author}</h4>
                    <p style={{ 
                      margin: "5px 0 0", 
                      color: "#666",
                      fontSize: "0.9rem"
                    }}>{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Call to Action */}
      <section style={{ 
        padding: "80px 0", 
        textAlign: "center",
        background: "linear-gradient(135deg, rgba(28, 61, 90, 0.9), rgba(45, 55, 72, 0.9)), url('https://source.unsplash.com/random/1600x900/?bookshelf') center/cover no-repeat"
      }}>
        <Container>
          <h2 style={{ 
            color: "#fff", 
            fontSize: "2.5rem", 
            marginBottom: "20px",
            maxWidth: "800px",
            margin: "0 auto 20px"
          }}>
            Ready to Join the <span style={{ color: "#A6BCFF" }}>BookHive</span> Community?
          </h2>
          <p style={{ 
            color: "#fff", 
            fontSize: "1.2rem", 
            marginBottom: "40px",
            maxWidth: "600px",
            margin: "0 auto 40px",
            opacity: "0.9"
          }}>
            Connect with book lovers, exchange knowledge, and build your personal library today!
          </p>
          <Button style={{
            background: "#A6BCFF",
            color: "#1C3D5A",
            padding: "15px 35px",
            borderRadius: "30px",
            fontWeight: "bold",
            fontSize: "1.1rem",
            boxShadow: "0 4px 6px rgba(0,0,0,0.2)",
            transition: "transform 0.3s, box-shadow 0.3s"
          }} className="hover-grow">
            <Icon name="user plus" /> Join Now
          </Button>
        </Container>
      </section>

      <Footer />

      {/* Custom CSS for hover animations */}
      <style jsx>{`
        .hover-grow:hover {
          transform: scale(1.05);
          box-shadow: 0 6px 12px rgba(0,0,0,0.15);
        }
        
        .hover-grow-slight:hover {
          transform: scale(1.03);
          box-shadow: 0 6px 12px rgba(0,0,0,0.15);
          background: rgba(255,255,255,0.1);
        }
        
        .hover-lift:hover {
          transform: translateY(-10px);
        }
        
        .book-card-hover:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 25px rgba(0,0,0,0.1);
        }
        
        .book-image-zoom:hover {
          transform: scale(1.1);
        }
        
        .hover-btn:hover {
          background: #2C5282;
        }
      `}</style>
    </div>
  );
};

export default Home;