import { TextField, Typography } from '@mui/material';
import { useAuth } from '../../hooks/auth/UseAuthForm';

export const UsernameField = () => {
  const { 
    activeTab,
    formData, 
    errors, 
    touched,
    isUsernameAvailable,
    isCheckingUsername,
    handleChange 
  } = useAuth();

  if (activeTab !== 1) return null;

  return (
    <TextField
      fullWidth
      variant="outlined"
      label="Username"
      name="username"
      value={formData.username}
      onChange={handleChange}
      error={!!errors.username && touched.username}
      helperText={
        touched.username ? (
          <>
            {console.log(isUsernameAvailable, errors.username, isCheckingUsername)}
            {errors.username}
            {isCheckingUsername && (
              <Typography variant="caption" color="text.secondary">
                Checking availability...
              </Typography>
            )}
            {isUsernameAvailable === false && !errors.username && (
              <Typography variant="caption" color="success.main">
                Username is available
              </Typography>
            )}
            {isUsernameAvailable && (
              <Typography variant="caption" color="error">
                Username is already taken
              </Typography>
            )}
          </>
        ) : null
      }
      sx={{
        mb: 2,
        input: { color: 'white' },
        label: { color: errors.username && touched.username ? 'error.main' : 'gray' },
        '& .MuiOutlinedInput-root': {
          '& fieldset': { 
            borderColor: errors.username && touched.username ? 'error.main' : 
              isUsernameAvailable === false ? 'success.main' : 
              isUsernameAvailable ? 'error.main' : '#333' 
          },
          '&:hover fieldset': { 
            borderColor: errors.username && touched.username ? 'error.main' : 
              isUsernameAvailable === false ? 'success.main' : 
              isUsernameAvailable ? 'error.main' : '#888' 
          },
          '&.Mui-focused fieldset': { 
            borderColor: errors.username && touched.username ? 'error.main' : 
              isUsernameAvailable === false ? 'success.main' : 
              isUsernameAvailable ? 'error.main' : '#00e676' 
          },
        },
      }}
    />
  );
};