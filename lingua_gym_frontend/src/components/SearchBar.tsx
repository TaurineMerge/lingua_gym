import { InputBase, Paper, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useTheme } from '@mui/material/styles';
import TuneIcon from '@mui/icons-material/Tune';

const SearchBar = () => {
  const theme = useTheme();

  return (
    <Paper
      component="form"
      sx={{
        p: '2px 8px',
        display: 'flex',
        alignItems: 'center',
        borderRadius: '30px',
        width: '70%',
        height: '74px',
        backgroundColor: '#E5E5E7',
      }}
    >
      <IconButton sx={{ p: '10px', color: theme.palette.text.secondary, '&:hover': { backgroundColor: '#CCC' } }} aria-label="menu">
        <TuneIcon />
      </IconButton>
      <InputBase
        sx={{ ml: 1, flex: 1, color: theme.palette.text.secondary }}
        placeholder="Hinted search text"
        inputProps={{ 'aria-label': 'search materials' }}
      />
      <IconButton type="submit" sx={{ p: '10px', color: theme.palette.text.secondary, '&:hover': { backgroundColor: '#CCC' } }} aria-label="search">
        <SearchIcon />
      </IconButton>
    </Paper>
  );
};

export default SearchBar;
