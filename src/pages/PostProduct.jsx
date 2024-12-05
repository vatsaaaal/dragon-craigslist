import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Box,
  MenuItem,
  Typography,
} from "@mui/material";
import axios from "axios";
import PageHeader from "../components/Header";

function PostProduct() {
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

    // Append fields to FormData
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    for (let [key, value] of data.entries()) {
      console.log(key, value);
    }

    try {
      axios.post("http://localhost:3000/products/add-products", data, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true, // Include cookies in the request
      });
      alert("Product created successfully!");
    } catch (error) {
      console.error("Error creating product:", error);
      alert("Failed to create product.");
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
          Create a New Product
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
            label="Upload Image"
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
            Submit
          </Button>
        </form>
      </Box>
    </Container>
  );
}

export default PostProduct;
