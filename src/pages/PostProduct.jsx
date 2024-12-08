import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Box,
  MenuItem,
  Typography,
  Card,
  CardContent,
  CardActions,
} from "@mui/material";
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

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 13, mb: 5 }}>
        <PageHeader />
        <Card elevation={3} sx={{ padding: 3 }}>
          <CardContent>
            <Typography variant="h4" gutterBottom>
              Create a New Product
            </Typography>
            <form>
              <TextField
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                fullWidth
                required
                margin="normal"
                variant="outlined"
              />
              <TextField
                label="ISBN"
                name="isbn"
                value={formData.isbn}
                onChange={handleChange}
                fullWidth
                margin="normal"
                variant="outlined"
              />
              <TextField
                label="Author"
                name="author"
                value={formData.author}
                onChange={handleChange}
                fullWidth
                margin="normal"
                variant="outlined"
              />
              <TextField
                label="Genre"
                name="genre"
                value={formData.genre}
                onChange={handleChange}
                fullWidth
                margin="normal"
                select
                variant="outlined"
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
                variant="outlined"
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
                variant="outlined"
              />
              <TextField
                label="Condition"
                name="condition"
                value={formData.condition}
                onChange={handleChange}
                fullWidth
                margin="normal"
                variant="outlined"
              />
              <TextField
                label="Quantity"
                name="quantity"
                type="number"
                value={formData.quantity}
                onChange={handleChange}
                fullWidth
                margin="normal"
                variant="outlined"
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
                variant="outlined"
              />
              <Button
                variant="contained"
                component="label"
                fullWidth
                sx={{ marginBottom: 2 }}
              >
                Upload Image
                <input
                  type="file"
                  hidden
                  onChange={handleFileChange}
                />
              </Button>
            </form>
          </CardContent>
          <CardActions>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
            >
              Submit
            </Button>
          </CardActions>
        </Card>
      </Box>
    </Container>
  );
}

export default PostProduct;
