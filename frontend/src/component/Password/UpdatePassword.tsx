import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  IconButton,
  InputAdornment,
  Grid,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store";
import { updatePassword } from "../../store/AuthSlice";
import { useNavigate } from "react-router-dom";

const validatePassword = (password: string): string | null => {
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
  return passwordRegex.test(password)
    ? null
    : "Password must be at least 8 characters and include uppercase, lowercase, number, and special character.";
};

const UpdatePassword: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [oldPasswordError, setOldPasswordError] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleTogglePasswordVisibility = () => setShowPassword((show) => !show);

  const handleOldPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setOldPassword(val);
    setOldPasswordError(val ? "" : "Old password is required.");
  };

  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setNewPassword(val);
    const error = validatePassword(val);
    setNewPasswordError(error || "");
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
    setConfirmPasswordError(
      val === newPassword ? "" : "Passwords do not match."
    );
  };

  const handleSubmit = () => {
    const oldError = oldPassword ? "" : "Old password is required.";
    const newError = validatePassword(newPassword);
    const confirmError =
      newPassword === confirmPassword ? "" : "Passwords do not match.";

    setOldPasswordError(oldError);
    setNewPasswordError(newError || "");
    setConfirmPasswordError(confirmError);

    if (!oldError && !newError && !confirmError) {
      console.log("Updating password:", { oldPassword, newPassword });
      dispatch(updatePassword({ oldPassword, newPassword }));
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="77vh"
      bgcolor="#f9fafb"
      p={2}
    >
      <Paper elevation={3} sx={{ p: 4, maxWidth: 400, width: "100%" }}>
        <Typography variant="h5" fontWeight="bold" mb={2} textAlign="center">
          Update Password
        </Typography>
        <Typography variant="body2" mb={3} textAlign="center">
          Change your account password.
        </Typography>

        <TextField
          fullWidth
          type={showPassword ? "text" : "password"}
          label="Old Password"
          value={oldPassword}
          onChange={handleOldPasswordChange}
          error={!!oldPasswordError}
          helperText={oldPasswordError}
          sx={{ mb: 2 }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleTogglePasswordVisibility} edge="end">
                  {!showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <TextField
          fullWidth
          type={showNewPassword ? "text" : "password"}
          label="New Password"
          value={newPassword}
          onChange={handleNewPasswordChange}
          error={!!newPasswordError}
          helperText={newPasswordError}
          sx={{ mb: 2 }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  edge="end"
                >
                  {!showNewPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <TextField
          fullWidth
          type={showConfirmPassword ? "text" : "password"}
          label="Confirm New Password"
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
                  {!showConfirmPassword ? <VisibilityOff /> : <Visibility />}
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

        <Grid container spacing={2}>
          <Grid size={{ xs: 6 }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => console.log("Cancelled")}
            >
              Cancel
            </Button>
          </Grid>
          <Grid size={{ xs: 6 }}>
            <Button
              fullWidth
              variant="contained"
              onClick={handleSubmit}
              disabled={
                !!oldPasswordError ||
                !!newPasswordError ||
                !!confirmPasswordError ||
                !oldPassword ||
                !newPassword ||
                !confirmPassword
              }
              sx={{ bgcolor: "#5c6ac4", "&:hover": { bgcolor: "#3f51b5" } }}
            >
              Update Password
            </Button>
          </Grid>
        </Grid>

        <Typography
          variant="body2"
          color="primary"
          textAlign="center"
          mt={2}
          sx={{ cursor: "pointer" }}
          onClick={() => navigate("/profile")}
        >
          Back to Profile Page
        </Typography>
      </Paper>
    </Box>
  );
};

export default UpdatePassword;
