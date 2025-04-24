import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store";
import { resetPassword } from "../../store/passwordResetSlice";

const validatePassword = (password: string): string | null => {
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
  return passwordRegex.test(password)
    ? null
    : "Password must be at least 8 characters and include uppercase, lowercase, number, and special character.";
};

const CreatePassword: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPassword(val);
    const error = validatePassword(val);
    setPasswordError(error || "");
    if (confirmPassword) {
      setConfirmPasswordError(
        val === confirmPassword ? "" : "Passwords do not match."
      );
    }
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const val = e.target.value;
    setConfirmPassword(val);
    setConfirmPasswordError(val === password ? "" : "Passwords do not match.");
  };

  const handleSubmit = () => {
    const passwordValidation = validatePassword(password);
    const matchValidation = password === confirmPassword;
    setPasswordError(passwordValidation || "");
    setConfirmPasswordError(matchValidation ? "" : "Passwords do not match.");

    if (!passwordValidation && matchValidation) {
      console.log("Password successfully created:", password);
      dispatch(
        resetPassword({ token: token || "", newPassword: password, navigate })
      );
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="#f9fafb"
      p={2}
    >
      <Paper elevation={3} sx={{ p: 4, maxWidth: 400, width: "100%" }}>
        <Typography variant="h5" fontWeight="bold" mb={2} textAlign="center">
          Create New Password
        </Typography>
        <Typography variant="body2" mb={3} textAlign="center">
          Please create a new password for your account.
        </Typography>
        <TextField
          fullWidth
          type={showPassword ? "text" : "password"}
          label="New Password"
          value={password}
          onChange={handlePasswordChange}
          error={!!passwordError}
          helperText={passwordError}
          sx={{ mb: 2 }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <TextField
          fullWidth
          type={showConfirmPassword ? "text" : "password"}
          label="Confirm Password"
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
          error={!!confirmPasswordError}
          helperText={confirmPasswordError}
          sx={{ mb: 2 }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  edge="end"
                >
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Box mb={2}>
          <Typography variant="body2">Password requirements:</Typography>
          <ul style={{ margin: "4px 0 0 16px", padding: 0 }}>
            <li>Minimum 8 characters</li>
            <li>At least one uppercase letter</li>
            <li>At least one number</li>
            <li>At least one special character</li>
          </ul>
        </Box>

        <Button
          fullWidth
          variant="contained"
          onClick={handleSubmit}
          disabled={
            !!passwordError ||
            !!confirmPasswordError ||
            !password ||
            !confirmPassword
          }
          sx={{ bgcolor: "#5c6ac4", "&:hover": { bgcolor: "#3f51b5" } }}
        >
          Create Password
        </Button>

        <Typography
          variant="body2"
          color="primary"
          textAlign="center"
          mt={2}
          sx={{ cursor: "pointer" }}
        >
          Back to Forgot Password
        </Typography>
      </Paper>
    </Box>
  );
};

export default CreatePassword;
