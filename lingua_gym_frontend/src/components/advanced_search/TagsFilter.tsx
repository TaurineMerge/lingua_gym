import { Box, Typography, Chip, IconButton, Autocomplete, TextField } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";

interface TagsFilterProps {
  tags: string[];
  onDelete: (tag: string) => void;
  onAdd: (tag: string) => void;
  newTag: string;
  setNewTag: (tag: string) => void;
}

const availableTags = [""];

const TagsFilter = ({ tags, onDelete, onAdd, newTag, setNewTag }: TagsFilterProps) => {
  const theme = useTheme();

  return (
    <>
      <Typography variant="subtitle1" fontWeight="bold" mb={1}>Tags</Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
        {tags.length > 0 ? (
          tags.map(tag => (
            <Chip
              key={tag}
              label={`#${tag}`}
              onDelete={() => onDelete(tag)}
              variant="outlined"
            />
          ))
        ) : (
          <Typography variant="body2" color="text.primary">No tags selected</Typography>
        )}
      </Box>
      
      <Box sx={{ display: "flex", alignItems: "center", mb: 2, gap: 1 }}>
        <Autocomplete
          freeSolo
          options={availableTags.filter(tag => !tags.includes(tag))}
          value={newTag}
          onChange={(_, value) => value && onAdd(value)}
          onInputChange={(_, value) => setNewTag(value)}
          renderInput={(params) => (
            <TextField 
              {...params}
              variant="outlined" 
              size="small" 
              fullWidth
              placeholder="Add tag..." 
              onKeyDown={(e) => e.key === "Enter" && onAdd(newTag)}
            />
          )}
          sx={{ flex: 1 }}
        />
        <IconButton 
          onClick={() => onAdd(newTag)}
          disabled={!newTag.trim()}
          sx={{ backgroundColor: theme.palette.primary.main, color: "white" }}
        >
          <AddIcon fontSize="small" />
        </IconButton>
      </Box>
    </>
  );
};

export default TagsFilter;