import React, { useEffect, useState } from "react";
import {
  Container,
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function BookGrid({ searchQuery, sortOption, filterCategory }) {
  const [books, setBooks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get(
          "https://dragon-craigslist.onrender.com/products/all-books"
        );
        console.log(response.data)
        if (Array.isArray(response.data)) {
          const filteredBooks = response.data.filter((book) => !book.is_blocked);
          setBooks(filteredBooks);
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

  const filteredBooks = books
    .filter((book) => {
      // Filter by category
      if (filterCategory && book.genre !== filterCategory) return false;

      // Search by title or author
      if (
        searchQuery &&
        !(
          book.title.toLowerCase().includes(searchQuery) ||
          book.author.toLowerCase().includes(searchQuery)
        )
      ) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      // Sort books
      if (sortOption === "Price") {
        return a.price - b.price;
      } else if (sortOption === "Author") {
        return a.author.localeCompare(b.author);
      } else if (sortOption === "Title") {
        return a.title.localeCompare(b.title);
      }
      return 0; // Default: no sorting
    });

  return (
    <Container>
      <Grid container spacing={4}>
        {Array.isArray(filteredBooks) && filteredBooks.length > 0 ? (
          filteredBooks.map((book) => (
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
                onClick={() => navigate(`/products/${book.id}`)}
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
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "50vh",
              width: "100%",
              textAlign: "center",
            }}
          >
            <Typography variant="h6" color="text.secondary">
              No books available.
            </Typography>
          </Box>
        )}
      </Grid>
    </Container>
  );
}

export default BookGrid;
