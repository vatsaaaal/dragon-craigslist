import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Container,
  Menu,
  MenuItem,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

function SortFilterBar({ onSearch, onSort, onFilter }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedSort, setSelectedSort] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("");
  const navigate = useNavigate();

  const handleSortClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSortClose = (option) => {
    setAnchorEl(null);
    if (option) {
      setSelectedSort(option);
      onSort(option);
    }
  };

  const handleFilterChange = (event) => {
    const value = event.target.value;
    setSelectedFilter(value);
    onFilter(value);
  };

  return (
    <Container sx={{ my: 2 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 20px",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          backgroundColor: "#f9fafb",
        }}
      >
        <TextField
          placeholder="Search books..."
          variant="outlined"
          size="small"
          sx={{ width: "300px" }}
          onChange={(e) => onSearch(e.target.value)}
        />
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="outlined"
            size="small"
            sx={{ textTransform: "none" }}
            onClick={handleSortClick}
          >
            Sort By {selectedSort || "..."}
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => handleSortClose(null)}
          >
            <MenuItem onClick={() => handleSortClose("Price")}>Price</MenuItem>
            <MenuItem onClick={() => handleSortClose("Author")}>
              Author
            </MenuItem>
            <MenuItem onClick={() => handleSortClose("Title")}>Title</MenuItem>
          </Menu>
          <Button
            variant="contained"
            size="small"
            sx={{ textTransform: "none" }}
            onClick={() => navigate(`/products/post`)}
          >
            Post a Product
          </Button>
          <TextField
            select
            label="Filter By Category"
            value={selectedFilter}
            onChange={handleFilterChange}
            variant="outlined"
            size="small"
            sx={{ width: "200px" }}
          >
            <MenuItem value="">None</MenuItem>
            <MenuItem value="Fiction">Fiction</MenuItem>
            <MenuItem value="Non-Fiction">Non-Fiction</MenuItem>
            <MenuItem value="Science">Science</MenuItem>
            <MenuItem value="Technology">Technology</MenuItem>
          </TextField>
        </Box>
      </Box>
    </Container>
  );
}

export default SortFilterBar;
