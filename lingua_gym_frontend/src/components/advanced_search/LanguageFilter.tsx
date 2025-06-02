import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

interface LanguageFilterProps {
  value: string;
  onChange: (value: string) => void;
}

const LanguageFilter = ({ value, onChange }: LanguageFilterProps) => {
  const languageCodes: { [key: string]: string } = {
    "English": "en",
    "Spanish": "es",
    "French": "fr",
  }
  const availableLanguages = Object.keys(languageCodes);

  return (
    <FormControl fullWidth margin="dense" size="small">
      <InputLabel sx={{ color: "text.primary" }}>Язык</InputLabel>
      <Select
        label="Язык"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <MenuItem value=""><em>None</em></MenuItem>
        {availableLanguages.map((language) => (
          <MenuItem key={language} value={languageCodes[language]}>
            {language}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default LanguageFilter;