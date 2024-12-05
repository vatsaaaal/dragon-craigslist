import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useChat } from '../hooks/useChat';
import {
  Container,
  Typography,
  Box,
  Button,
  CircularProgress,
  Card,
  CardContent,
  CardActions,
} from "@mui/material";
import { fetchUserId } from "../hooks/useFetchUserId";

function Book() {
  const { id } = useParams(); // Get the book ID from the URL
  const [book, setBook] = useState(null); // State to hold book details
  const [isOwner, setIsOwner] = useState(false); // State to hold ownership status
  const [loading, setLoading] = useState(true); // State to indicate loading
  const [error, setError] = useState(null); // State to hold errors
  const [currentUserId, setCurrentUserId] = useState(null);

  // Fetch user ID when component mounts
  useEffect(() => {
    const getUserId = async () => {
      const user = await fetchUserId();
      if (user) {
        setCurrentUserId(user.user_id); // Store user_id in state
      }
    };

    getUserId();
  }, []);

  // Fetch the book details
  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/products/${id}`,
          {
            withCredentials: true, // Ensure cookies are included
          }
        );
        setBook(response.data.product);
        setIsOwner(response.data.isOwner); // Set ownership status
        setLoading(false);
      } catch (error) {
        console.error("Error fetching book details:", error);
        setError("Failed to load book details.");
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [id]);

  const handleContactUser = async() => {
    console.log("Current User ID:", currentUserId, "Book Owner ID:", book?.user_id);

    if (currentUserId && book?.id) {
      const targetUrl = `http://localhost:5173/chatbox/${book.id}`;
      sessionStorage.setItem('bookInfo', JSON.stringify({ bookId: book.id, sellerId: book.user_id }));
      window.location.href = targetUrl;
    } else {
      console.error("User ID or book information is missing.");
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
          textAlign: "center",
        }}
      >
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Container>
      <Card
        sx={{
          maxWidth: 600,
          margin: "0 auto",
          mt: 4,
          padding: 2,
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <CardContent>
          <Typography variant="h4" gutterBottom>
            {book.title}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            Author: {book.author}
          </Typography>
          <Typography variant="h6" color="primary" gutterBottom>
            Price: ${book.price}
          </Typography>
          <Typography variant="body1" paragraph>
            {book.description}
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Condition: {book.condition}
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Genre: {book.genre}
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Date Published: {new Date(book.date_published).toLocaleDateString()}
          </Typography>
        </CardContent>
        {/* Conditionally render buttons based on ownership */}
        {isOwner && (
          <CardActions>
            <Button variant="contained" color="primary">
              Edit
            </Button>
            <Button variant="outlined" color="error">
              Delete
            </Button>
          </CardActions>
        )}
        {!isOwner && (
          <CardActions>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => {
                handleContactUser();
              }}
            >
              Contact User
            </Button>
          </CardActions>
        )}
      </Card>
    </Container>
  );
}

export default Book;
