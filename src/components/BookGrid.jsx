import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
} from "@mui/material";
import axios from "axios";

function BookGrid() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/products/all-books"
        );
        console.log("API Response:", response.data);
        if (Array.isArray(response.data)) {
          setBooks(response.data);
        } else {
          console.error("Unexpected API response:", response.data);
          setBooks([]);
        }
      } catch (error) {
        console.error("Error fetching books:", error);
        setBooks([]); // Fallback to an empty array in case of an error
      }
    };

    fetchBooks();
  }, []);

  return (
    <Container>
      <Grid container spacing={4}>
        {Array.isArray(books) && books.length > 0 ? (
          books.map((book) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={book.id}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  borderRadius: "12px",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  "&:hover": {
                    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={`/assets/${book.book_image_url}`}
                  alt={book.title}
                  sx={{ objectFit: "contain", padding: "10px" }}
                />
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                    {book.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    {book.author}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    color="primary"
                    sx={{ fontWeight: "bold" }}
                  >
                    ${book.price}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography variant="h6">No books available.</Typography>
        )}
      </Grid>
    </Container>
  );
}

export default BookGrid;
