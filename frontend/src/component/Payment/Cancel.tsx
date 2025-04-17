import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Cancel: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ padding: 4, textAlign: "center" }}>
      <Typography variant="h4" color="error" gutterBottom>
        Payment Cancelled
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Your payment was cancelled. Please try again or contact support if you
        need assistance.
      </Typography>
      <Button variant="contained" onClick={() => navigate("/")} sx={{ mt: 2 }}>
        Back to Home
      </Button>
    </Box>
  );
};

export default Cancel;
