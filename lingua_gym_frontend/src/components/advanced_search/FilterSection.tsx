import { Box, Divider, Button, Typography, IconButton, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import TimeFilter from "./TimeFilter";
import MaterialTypeFilter from "./MaterialTypeFilter";
import LanguageFilter from "./LanguageFilter";
import UserFilter from "./UserFilter";
import TagsFilter from "./TagsFilter";
import { Sort as SortIcon } from "@mui/icons-material";

interface FilterSectionProps {
  filters: { time: string; rating: string; materialType: string; language: string; tags: string[]; users: string[] };
  isMobile: boolean;
  showMobileFilters: boolean;
  setShowMobileFilters: (show: boolean) => void;
  handleFilterChange: (filterName: string, value: string) => void;
  handleTagDelete: (tag: string) => void;
  handleUserDelete: (user: string) => void;
  handleAddTag: (tag: string) => void;
  handleAddUser: (user: string) => void;
  clearAllFilters: () => void;
  newTag: string;
  setNewTag: (tag: string) => void;
  newUser: string;
  setNewUser: (user: string) => void;
}

const FilterSection = ({
  filters,
  isMobile,
  showMobileFilters,
  setShowMobileFilters,
  handleFilterChange,
  handleTagDelete,
  handleUserDelete,
  handleAddTag,
  handleAddUser,
  clearAllFilters,
  newTag,
  setNewTag,
  newUser,
  setNewUser
}: FilterSectionProps) => {
  return (
    <Box sx={{ 
      backgroundColor: "#1A1A1A", 
      borderRadius: 2, 
      p: 2,
      position: isMobile && showMobileFilters ? "fixed" : "static",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 1000,
      overflowY: "auto",
      ...(isMobile && showMobileFilters ? {} : {})
    }}>
      {isMobile && (
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Filters</Typography>
          <IconButton onClick={() => setShowMobileFilters(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
      )}
      
      <Typography variant="h6" mb={1} display="flex" alignItems="center" sx={{ fontSize: "1rem" }}>
        <SortIcon sx={{ mr: 1 }} /> Сортировать
      </Typography>

      <TimeFilter 
        value={filters.time}
        onChange={(value) => handleFilterChange("time", value)}
      />

      <FormControl fullWidth margin="dense" size="small">
        <InputLabel sx={{ color: "text.primary" }}>Рейтинг</InputLabel>
        <Select
          label="Рейтинг"
          value={'highest'}
        >
          <MenuItem value="highest">По убыванию</MenuItem>
          <MenuItem value="lowest">По возрастанию</MenuItem>
        </Select>
      </FormControl>
      
      <Divider sx={{ my: 2 }} />
      
      <Typography variant="h6" display="flex" alignItems="center" sx={{ fontSize: "1rem" }}>
        <SortIcon sx={{ mr: 1 }} /> Фильтровать
      </Typography>

      <MaterialTypeFilter 
        value={filters.materialType}
        onChange={(value) => handleFilterChange("materialType", value)}
      />
      
      <FormControl fullWidth margin="dense" size="small">
        <InputLabel sx={{ color: "text.primary" }}>Тип доступа</InputLabel>
        <Select
          label="Тип доступа"
          defaultValue=""
        >
          <MenuItem value=""><em>Все</em></MenuItem>
          <MenuItem value=""><em>Публичный</em></MenuItem>
          <MenuItem value=""><em>Приватный</em></MenuItem>
        </Select>
      </FormControl>

      <LanguageFilter 
        value={filters.language}
        onChange={(value) => handleFilterChange("language", value)}
      />
      
      <Divider sx={{ my: 2 }} />
      
      <UserFilter 
        users={filters.users}
        onDelete={handleUserDelete}
        onAdd={handleAddUser}
        setNewUser={setNewUser}
        newUser={newUser}
      />
      
      <TagsFilter 
        tags={filters.tags}
        onDelete={handleTagDelete}
        onAdd={handleAddTag}
        setNewTag={setNewTag}
        newTag={newTag}
      />
      
      <Button
        variant="outlined"
        fullWidth
        onClick={clearAllFilters}
        disabled={filters.users.length === 0 && filters.tags.length === 0 && filters.materialType === "" && filters.language === ""}
      >
        Сбросить настройки
      </Button>

      {isMobile && (
        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 2 }}
          onClick={() => setShowMobileFilters(false)}
        >
          Применить
        </Button>
      )}
    </Box>
  );
};

export default FilterSection;