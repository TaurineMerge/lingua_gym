import { Box, Typography, Chip, Avatar, IconButton, Autocomplete, TextField } from "@mui/material";
import { Person as PersonIcon } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";

interface UserFilterProps {
  users: string[];
  onDelete: (user: string) => void;
  onAdd: (user: string) => void;
  newUser: string;
  setNewUser: (user: string) => void;
}

const availableUsers = [""];

const UserFilter = ({ users, onDelete, onAdd, newUser, setNewUser }: UserFilterProps) => {
  const theme = useTheme();

  return (
    <>
      <Typography variant="subtitle1" fontWeight="bold" mb={1}>User</Typography>
      {users.length ? (
        <Box sx={{ display: "flex", justifyContent: "flex-start", alignItems: "center", mb: 2 }}>
          {users.map(user => (
            <Chip
              key={user}
              label={user}
              onDelete={() => onDelete(user)}
              avatar={<Avatar sx={{ width: 24, height: 24 }}>{user.charAt(0)}</Avatar>}
            />
          ))}
        </Box>
      ) : (
        <Typography variant="body2" color="text.primary" mb={1}>No user selected</Typography>
      )}
      
      <Box sx={{ display: "flex", alignItems: "center", mb: 2, gap: 1 }}>
        <Autocomplete
          freeSolo
          options={availableUsers}
          value={newUser}
          onChange={(_, value) => value && onAdd(value)}
          onInputChange={(_, value) => setNewUser(value)}
          renderInput={(params) => (
            <TextField 
              {...params}
              variant="outlined" 
              size="small" 
              fullWidth
              placeholder="Add user..." 
              onKeyDown={(e) => e.key === "Enter" && onAdd(newUser)}
            />
          )}
          sx={{ flex: 1 }}
        />
        <IconButton 
          onClick={() => onAdd(newUser)}
          disabled={!newUser.trim()}
          sx={{ backgroundColor: theme.palette.primary.main, color: "white" }}
        >
          <PersonIcon fontSize="small" />
        </IconButton>
      </Box>
    </>
  );
};

export default UserFilter;