import { Typography, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { Sort as SortIcon } from "@mui/icons-material";

interface TimeFilterProps {
  value: string;
  onChange: (value: string) => void;
}

const TimeFilter = ({ value, onChange }: TimeFilterProps) => {
  return (
    <>
      <Typography variant="h6" mb={2} display="flex" alignItems="center" sx={{ fontSize: "1rem" }}>
        <SortIcon sx={{ mr: 1 }} /> Sort by
      </Typography>
      <FormControl fullWidth margin="dense" size="small">
        <InputLabel sx={{ color: "text.primary" }}>Time</InputLabel>
        <Select
          label="Time"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          <MenuItem value="newest">Newest</MenuItem>
          <MenuItem value="oldest">Oldest</MenuItem>
        </Select>
      </FormControl>
    </>
  );
};

export default TimeFilter;