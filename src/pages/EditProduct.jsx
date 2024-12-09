import React, { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Button,
  Box,
  MenuItem,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import PageHeader from "../components/Header";

function EditProduct() {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    isbn: "",
    author: "",
    genre: "",
    date_published: "",
    price: "",
    condition: "",
    quantity: 1,
    description: "",
    book_image: null,
  });
  const [message, setMessage] = useState(null);

  useEffect(() => {
    // Fetch product details
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/products/${id}`,
          {
            withCredentials: true,
          }
        );
        const product = response.data.product;
        setFormData({
          title: product.title,
          isbn: product.isbn,
          author: product.author,
          genre: product.genre,
          date_published: product.date_published.split("T")[0], // Format date to "yyyy-MM-dd"
          price: product.price,
          condition: product.condition,
          quantity: product.quantity,
          description: product.description,
          book_image: null, // No initial image for editing
        });
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };
    fetchProductDetails();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, book_image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    try {
      await axios.put(`${API_URL}/products/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      setMessage("Product updated successfully!");
      setTimeout(() => {
        navigate(`/products/${id}`);
      }, 2000);
    } catch (error) {
      console.error("Error updating product:", error);
      setMessage("Failed to update product.");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          mt: 17,
          minHeight: "100vh",
          position: "relative",
          overflow: "hidden",
          width: "100%",
        }}
      >
        <PageHeader />
        <Typography variant="h4" gutterBottom>
          Edit Product
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="ISBN"
            name="isbn"
            value={formData.isbn}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Author"
            name="author"
            value={formData.author}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Genre"
            name="genre"
            value={formData.genre}
            onChange={handleChange}
            fullWidth
            margin="normal"
            select
          >
            <MenuItem value="Fiction">Fiction</MenuItem>
            <MenuItem value="Non-Fiction">Non-Fiction</MenuItem>
            <MenuItem value="Science">Science</MenuItem>
            <MenuItem value="Technology">Technology</MenuItem>
          </TextField>
          <TextField
            label="Date Published"
            name="date_published"
            type="date"
            value={formData.date_published}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
            margin="normal"
          />
          <TextField
            label="Price"
            name="price"
            type="number"
            value={formData.price}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="Condition"
            name="condition"
            value={formData.condition}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Quantity"
            name="quantity"
            type="number"
            value={formData.quantity}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            fullWidth
            multiline
            rows={4}
            margin="normal"
          />
          <TextField
            label="Upload New Image"
            name="book_image"
            type="file"
            onChange={handleFileChange}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            fullWidth
          >
            Save
          </Button>
        </form>
      </Box>
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

export default EditProduct;
