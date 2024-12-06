import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Typography,
  Box,
  Button,
  CircularProgress,
  Card,
  CardContent,
  CardActions,
  Snackbar,
  Alert,
} from "@mui/material";

function Book() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/products/${id}`,
          {
            withCredentials: true,
          }
        );
        setBook(response.data.product);
        setIsOwner(response.data.isOwner);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching book details:", error);
        setError("Failed to load book details.");
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [id]);

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:3000/products/${id}`, {
        withCredentials: true,
      });
      setMessage("Product deleted successfully!");
      setTimeout(() => {
        navigate("/marketplace");
      }, 2000);
    } catch (error) {
      console.error("Error deleting product:", error);
      setMessage("Failed to delete product.");

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
        {isOwner && (
          <CardActions>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate(`/products/edit/${id}`)}
            >
              Edit
            </Button>
            <Button variant="outlined" color="error" onClick={handleDelete}>
              Delete
            </Button>
          </CardActions>
        )}
      </Card>
      {message && (
        <Snackbar
          open={true}
          autoHideDuration={3000}
          onClose={() => setMessage(null)}
        >
          <Alert
            onClose={() => setMessage(null)}
            severity={message.includes("successfully") ? "success" : "error"}
            sx={{ width: "100%" }}
          >
            {message}
          </Alert>
        </Snackbar>
      )}
    </Container>
  );
}

export default Book;
