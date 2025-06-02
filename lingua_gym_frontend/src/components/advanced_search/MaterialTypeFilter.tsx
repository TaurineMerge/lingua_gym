import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

interface MaterialTypeFilterProps {
  value: string;
  onChange: (value: string) => void;
}

const MaterialTypeFilter = ({ value, onChange }: MaterialTypeFilterProps) => {
  const availableTypes = ["сеты", "тексты"];
  
  return (
    <FormControl fullWidth margin="dense" size="small">
      <InputLabel sx={{ color: "text.primary" }}>Тип материала</InputLabel>
      <Select
        label="Тип учебного материала"
        value={value}
        defaultValue=""
        onChange={(e) => onChange(e.target.value as string)}
      >
        <MenuItem value=""><em>Все</em></MenuItem>
        {availableTypes.map((type) => (
          <MenuItem key={type} value={type}>
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default MaterialTypeFilter;