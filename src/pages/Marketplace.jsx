import React, { useState, useMemo } from "react";
import { Box } from "@mui/material";
import PageHeader from "../components/Header";
import SortFilterBar from "../components/SortFilterBar";
import BookGrid from "../components/BookGrid";
import bookSampleImage from "/src/assets/bookSample.jpg";

const initialBooks = [
  {
    id: 1,
    title: "Introduction to Algorithms",
    author: "Thomas H. Cormen",
    price: 45.0,
    image: bookSampleImage,
    category: "Technology",
  },
  {
    id: 2,
    title: "Clean Code",
    author: "Robert C. Martin",
    price: 40.0,
    image: bookSampleImage,
    category: "Technology",
  },
  {
    id: 3,
    title: "The Pragmatic Programmer",
    author: "Andy Hunt",
    price: 50.0,
    image: bookSampleImage,
    category: "Technology",
  },
  // Add more books as needed
];

function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [filterCategory, setFilterCategory] = useState("");

  const handleSearch = (query) => {
    setSearchQuery(query.toLowerCase());
  };

  const handleSort = (option) => {
    setSortOption(option);
  };

  const handleFilter = (category) => {
    setFilterCategory(category);
  };

  const filteredBooks = useMemo(() => {
    let books = initialBooks;

    // Filter by category
    if (filterCategory) {
      books = books.filter((book) => book.category === filterCategory);
    }

    // Search by title or author
    if (searchQuery) {
      books = books.filter(
        (book) =>
          book.title.toLowerCase().includes(searchQuery) ||
          book.author.toLowerCase().includes(searchQuery)
      );
    }

    // Sort books
    if (sortOption === "Price") {
      books = books.sort((a, b) => a.price - b.price);
    } else if (sortOption === "Author") {
      books = books.sort((a, b) => a.author.localeCompare(b.author));
    } else if (sortOption === "Title") {
      books = books.sort((a, b) => a.title.localeCompare(b.title));
    }

    return books;
  }, [searchQuery, sortOption, filterCategory]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        width: "100%",
      }}
    >
      <PageHeader />
      <Box sx={{ mt: 10, padding: "20px 0" }}>
        <SortFilterBar
          onSearch={handleSearch}
          onSort={handleSort}
          onFilter={handleFilter}
        />
        <BookGrid books={filteredBooks} />
      </Box>
    </Box>
  );
}

export default MarketplacePage;
