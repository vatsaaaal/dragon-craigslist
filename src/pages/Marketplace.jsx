import React, { useState } from "react";
import { Box } from "@mui/material";
import PageHeader from "../components/Header";
import SortFilterBar from "../components/SortFilterBar";
import BookGrid from "../components/BookGrid";

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
        <BookGrid
          searchQuery={searchQuery}
          sortOption={sortOption}
          filterCategory={filterCategory}
        />
      </Box>
    </Box>
  );
}

export default MarketplacePage;
