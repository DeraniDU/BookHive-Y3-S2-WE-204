import React, { useState } from "react";
import axios from "axios";
import { Button, Input, Segment, Card, Image, Loader, Grid } from "semantic-ui-react";

const BookSearch = () => {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  const API_KEY = "AIzaSyAb0O_MywOx0cvRbMHRPs9MvqQvvjSvL6A"; // Use the API key from .env file

  const searchBooks = async () => {
    if (!query) return;
    setLoading(true);

    try {
      const response = await axios.get(
        `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${API_KEY}`
      );
      setBooks(response.data.items || []);
    } catch (error) {
      console.error("Error fetching books:", error);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Segment textAlign="center" className="book-search" style={{ padding: "50px 0" }}>
      <h2>Search Books</h2>
      
      {/* Input for book title */}
      <Input
        icon="search"
        placeholder="Enter book title..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ width: "300px" }}
      />
      <Button
        color="blue"
        onClick={searchBooks}
        loading={loading}
        style={{ marginLeft: "10px" }}
      >
        Search
      </Button>

      {/* Loading Spinner */}
      {loading && <Loader active inline="centered" />}

      {/* Display Books */}
      <Grid container style={{ marginTop: "20px" }}>
        {books.length > 0 ? (
          books.map((book) => (
            <Grid.Column key={book.id} mobile={16} tablet={8} computer={4}>
              <Card>
                {book.volumeInfo.imageLinks?.thumbnail && (
                  <Image src={book.volumeInfo.imageLinks.thumbnail} wrapped ui={false} />
                )}
                <Card.Content>
                  <Card.Header>{book.volumeInfo.title}</Card.Header>
                  <Card.Description>
                    {book.volumeInfo.authors?.join(", ")}
                  </Card.Description>
                </Card.Content>
                <Card.Content extra>
                  <Button
                    primary
                    as="a"
                    href={book.volumeInfo.infoLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    More Info
                  </Button>
                </Card.Content>
              </Card>
            </Grid.Column>
          ))
        ) : (
          <p>No books found.</p>
        )}
      </Grid>
    </Segment>
  );
};

export default BookSearch;
