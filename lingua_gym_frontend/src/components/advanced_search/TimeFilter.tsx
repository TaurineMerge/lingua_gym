import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

interface TimeFilterProps {
  value: string;
  onChange: (value: string) => void;
}

const TimeFilter = ({ value, onChange }: TimeFilterProps) => {
  return (
    <>
      <FormControl fullWidth margin="dense" size="small">
        <InputLabel sx={{ color: "text.primary" }}>Время</InputLabel>
        <Select
          label="Время"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          <MenuItem value="newest">Сначала новые</MenuItem>
          <MenuItem value="oldest">Сначала старые</MenuItem>
        </Select>
      </FormControl>
    </>
  );
};

export default TimeFilter;