import React, { useEffect } from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store";
import { bookProperty } from "../../store/AuthSlice";

const Success: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(bookProperty());
  }, []);

  return (
    <Box sx={{ padding: 4, textAlign: "center" }}>
      <Typography variant="h4" color="primary" gutterBottom>
        Payment Successful!
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Thank you for booking with us. Your payment has been processed
        successfully.
      </Typography>
      <Button variant="contained" onClick={() => navigate("/")} sx={{ mt: 2 }}>
        Back to Home
      </Button>
    </Box>
  );
};

export default Success;
