import { Box, Typography, IconButton, Badge, TextField, useTheme } from "@mui/material";
import { Search as SearchIcon, Clear as ClearIcon } from "@mui/icons-material";
import { FilterList as FilterListIcon } from "@mui/icons-material";

interface SearchHeaderProps {
  searchQuery: string;
  isSmall: boolean;
  isMobile: boolean;
  filters: { time: string; materialType: string; language: string; tags: string[]; users: string[] };
  showMobileFilters: boolean;
  setShowMobileFilters: (show: boolean) => void;
  setSearchQuery: (query: string) => void;
}

const SearchHeader = ({
  searchQuery,
  isSmall,
  isMobile,
  filters,
  setShowMobileFilters,
  setSearchQuery
}: SearchHeaderProps) => {
  const theme = useTheme();
  return (
    <Box 
      display="flex" 
      justifyContent="space-between" 
      alignItems={ "flex-start" } 
      flexDirection={"column"}
      gap={isSmall ? 2 : 0}
      minHeight={isSmall ? "auto" : "10vh"}
    >
      <Typography 
        variant={isSmall ? "h5" : "h4"} 
        mb={isSmall ? 1 : 2}
        sx={{ 
          color: "#00FF9F", 
          fontWeight: "bold",
          width: isSmall ? "100%" : "auto",
          fontSize: isSmall ? "2.5rem" : "3.5rem",
        }}
      >
        { 
          searchQuery.trim() === ""
            ? "Поиск материалов"
            : `Results for '${searchQuery}'`
        }
      </Typography>
      
      {isMobile && (
        <IconButton 
          onClick={() => setShowMobileFilters(true)}
          sx={{ 
            backgroundColor: theme.palette.primary.main,
            color: "#fff",
            "&:hover": { backgroundColor: theme.palette.primary.dark },
            alignSelf: isSmall ? "flex-end" : "auto"
          }}
        >
          <Badge badgeContent={filters.tags.length + filters.users.length} color="error">
            <FilterListIcon />
          </Badge>
        </IconButton>
      )}
      
      <Box sx={{
        backgroundColor: theme.palette.grey[200],
        borderRadius: "20px",
        px: 2, py: 1,
        display: "flex",
        alignItems: "center",
        maxWidth: isMobile ? "100%" : "50%",
        width: "100%",
        minHeight: "7vh"
      }}>
        <SearchIcon sx={{ mr: 1, color: theme.palette.text.secondary }} />
        <TextField
          variant="standard"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Введите название"
          fullWidth
          sx={{ width: "100%" }}
          InputProps={{ 
            disableUnderline: true,
            style: { color: theme.palette.text.secondary },
            endAdornment: searchQuery && (
              <IconButton onClick={() => setSearchQuery("")} size="small">
                <ClearIcon fontSize="small" sx={{ color: theme.palette.text.secondary }} />
              </IconButton>
            )
          }}
        />
      </Box>
    </Box>
  );
};

export default SearchHeader;