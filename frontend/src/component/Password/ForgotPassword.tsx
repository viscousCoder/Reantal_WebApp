import React, { useState } from "react";
import { Box, Button, TextField, Typography, Paper } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
// import { useNavigate } from "react-router-dom";
import { sendResetLink } from "../../store/passwordResetSlice";
import { useNavigate } from "react-router-dom";
import Loading from "../Loading/Loading";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ForgotPassword: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.password);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isTypingStarted, setIsTypingStarted] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setEmail(value);

    if (!isTypingStarted) {
      setIsTypingStarted(true);
      setError("");
    } else {
      validateEmail(value);
    }
  };

  const handleFocus = () => {
    setError("");
  };

  const validateEmail = (value: string) => {
    if (!emailRegex.test(value)) {
      setError("Please enter a valid email address.");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = () => {
    if (validateEmail(email)) {
      const userRole = localStorage.getItem("userRole");
      console.log("Sending data:", { email });
      dispatch(sendResetLink({ email, userRole: userRole || "", navigate }));

      // Send data here (API call, etc.)
    }
  };

  return (
    <>
      {loading && <Loading />}
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
            Forgot Password
          </Typography>
          <Typography variant="body2" mb={3} textAlign="center">
            Enter your email address and we'll send you a link to reset your
            password.
          </Typography>
          <TextField
            fullWidth
            label="Email Address"
            value={email}
            onChange={handleChange}
            onFocus={handleFocus}
            error={!!error}
            helperText={error}
            InputProps={{ sx: { bgcolor: "white" } }}
            sx={{ mb: 2 }}
          />
          <Button
            fullWidth
            variant="contained"
            onClick={handleSubmit}
            disabled={!email || !!error}
            sx={{ bgcolor: "#5c6ac4", "&:hover": { bgcolor: "#3f51b5" } }}
          >
            Send Reset Link
          </Button>
        </Paper>
      </Box>
    </>
  );
};

export default ForgotPassword;
