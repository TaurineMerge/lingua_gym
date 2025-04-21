import { useAuth } from '../../hooks/auth/UseAuthForm';
import { TextField, Typography } from '@mui/material';

export const EmailField = () => {
  const { formData, errors, touched, handleChange, activeTab, isEmailAvailable, isCheckingEmail } = useAuth();
  
  return (
    <TextField
      fullWidth
      variant="outlined"
      label="Email"
      name="email"
      autoComplete='off'
      value={formData.email}
      onChange={handleChange}
      error={!!errors.email && touched.email}
      helperText={
        touched.email ? (
          <>
            {console.log(isEmailAvailable, errors.email, isCheckingEmail)}
            {errors.email}
            {isCheckingEmail && (
              <Typography variant="caption" color="text.secondary">
                Checking availability...
              </Typography>
            )}
            {isEmailAvailable && !errors.email && activeTab === 0 && (
              <Typography variant="caption" color="error">
                User with this email does not exist
              </Typography>
            )}
            {isEmailAvailable === false && activeTab === 1 && (
              <Typography variant="caption" color="error">
                User with this email already exists
              </Typography>
            )}
          </>
        ) : null
      }
      sx={{
        mb: 2,
        input: { color: 'white' },
        label: { color: errors.email && touched.email ? 'error.main' : 'gray' },
        '& .MuiOutlinedInput-root': {
          '& fieldset': { 
            borderColor: errors.email && touched.email ? 'error.main' : 
              isEmailAvailable === false && activeTab === 1 ? 'error.main' :
              isEmailAvailable === true && activeTab === 0 ? 'error.main' : '#333' 
          },
          '&:hover fieldset': { 
            borderColor: errors.email && touched.email ? 'error.main' : 
              isEmailAvailable === false && activeTab === 1 ? 'error.main' :
              isEmailAvailable === true && activeTab === 0 ? 'error.main' : '#888' 
          },
          '&.Mui-focused fieldset': { 
            borderColor: errors.email && touched.email ? 'error.main' : 
              isEmailAvailable === false && activeTab === 1 ? 'error.main' :
              isEmailAvailable === true && activeTab === 0 ? 'error.main' : '#00e676' 
          },
        },
      }}
    />
  );
};