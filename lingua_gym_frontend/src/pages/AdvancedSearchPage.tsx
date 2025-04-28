import { useState } from "react";
import { Box, Grid, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import FilterSection from "../components/advanced_search/FilterSection";
import SearchHeader from "../components/advanced_search/SearchHeader";
import SearchResultsGrid from "../components/advanced_search/SearchResultsGrid";

const AdvancedSearchPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  
  const [newTag, setNewTag] = useState("");
  const [newUser, setNewUser] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    time: "newest",
    materialType: "",
    language: "",
    tags: [],
    users: []
  } as { time: string; materialType: string; language: string; tags: string[]; users: string[] });
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const handleFilterChange = (filterName: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  const handleTagDelete = (tagToDelete: string) => {
    setFilters(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToDelete)
    }));
  };

  const handleUserDelete = (userToDelete: string) => {
    setFilters(prev => ({
      ...prev,
      users: prev.users.filter(user => user !== userToDelete)
    }));
  };

  const handleAddTag = (tag: string) => {
    if (tag && !filters.tags.includes(tag)) {
      setFilters(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
      setNewTag("");
    }
  };

  const handleAddUser = (user: string) => {
    if (user && !filters.users.includes(user)) {
      setFilters(prev => ({
        ...prev,
        users: [...prev.users, user]
      }));
      setNewUser("");
    }
  };

  const clearAllFilters = () => {
    setFilters({
      time: "newest",
      materialType: "",
      language: "",
      tags: [],
      users: []
    });
  };

  return (
    <Box sx={{ 
      color: theme.palette.text.primary, 
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      paddingLeft: isMobile ? 2 : 4,
      paddingRight: isMobile ? 2 : 4,
      height: "90vh",
      overflowY: "auto",
    }}>
      <SearchHeader 
        searchQuery={searchQuery}
        isSmall={isSmall}
        isMobile={isMobile}
        filters={filters}
        showMobileFilters={showMobileFilters}
        setShowMobileFilters={setShowMobileFilters}
        setSearchQuery={setSearchQuery}
      />
      
      <Grid container spacing={3} sx={{ minHeight: "70vh" }}>
        <Grid size={{ xs: 12, md: 9 }} sx={{ minHeight: "100%" }}>
          <SearchResultsGrid 
            isSmall={isSmall}
            searchQuery={searchQuery}
            filters={filters}
          />
        </Grid>

        {!isMobile && (
          <Grid size={{ xs: 12, md: 3 }}>
            <FilterSection
              filters={filters}
              isMobile={isMobile}
              showMobileFilters={showMobileFilters}
              setShowMobileFilters={setShowMobileFilters}
              handleFilterChange={handleFilterChange}
              handleTagDelete={handleTagDelete}
              handleUserDelete={handleUserDelete}
              handleAddTag={handleAddTag}
              handleAddUser={handleAddUser}
              clearAllFilters={clearAllFilters}
              setNewTag={setNewTag}
              setNewUser={setNewUser}
              newTag={newTag}
              newUser={newUser}
            />
          </Grid>
        )}

        {isMobile && showMobileFilters && (
          <FilterSection
            filters={filters}
            isMobile={isMobile}
            showMobileFilters={showMobileFilters}
            setShowMobileFilters={setShowMobileFilters}
            handleFilterChange={handleFilterChange}
            handleTagDelete={handleTagDelete}
            handleUserDelete={handleUserDelete}
            handleAddTag={handleAddTag}
            handleAddUser={handleAddUser}
            clearAllFilters={clearAllFilters}
            setNewTag={setNewTag}
            setNewUser={setNewUser}
            newTag={newTag}
            newUser={newUser}
          />
        )}
      </Grid>
    </Box>
  );
};

export default AdvancedSearchPage;