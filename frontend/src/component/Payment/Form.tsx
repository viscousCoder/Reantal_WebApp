import {
  Box,
  Button,
  Grid,
  IconButton,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createCheckoutSession,
  redirectToCheckout,
  resetPaymentState,
} from "../../store/paymentSlice";
import { AppDispatch, RootState } from "../../store/store";
import { getSingleProperty } from "../../store/propertySlice";

interface MoveInDetails {
  moveInDate: string;
  duration: string;
}

interface CustomerDetails {
  name: string;
  email: string;
  addressLine1: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface Errors {
  name?: string;
  email?: string;
  addressLine1?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  moveInDate?: string;
}

const Form = () => {
  const dispatch = useDispatch<AppDispatch>();
  const rent = localStorage.getItem(`rent`);
  const noOfSet = Number(localStorage.getItem(`noOfSet`)) || 0;
  const securityDeposit = localStorage.getItem(`securityDeposit`) || 0;
  const propertyId = localStorage.getItem("roomId");
  const {
    sessionId,
    // loading: paymentLoading,
    // error: paymentError,
  } = useSelector((state: RootState) => state.payment);

  const [moveInDetails, setMoveInDetails] = useState<MoveInDetails>({
    moveInDate: "",
    duration: "1 month", // Default to 1 month
  });

  const [customerDetails, setCustomerDetails] = useState<CustomerDetails>({
    name: "",
    email: "",
    addressLine1: "",
    city: "",
    state: "",
    postalCode: "",
    country: "IN",
  });

  const [errors, setErrors] = useState<Errors>({});

  const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const newErrors: Errors = {};
    if (!customerDetails.name) newErrors.name = "Name is required";
    if (!customerDetails.email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(customerDetails.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!customerDetails.addressLine1)
      newErrors.addressLine1 = "Address is required";
    if (!customerDetails.city) newErrors.city = "City is required";
    if (!customerDetails.state) newErrors.state = "State is required";
    if (!customerDetails.postalCode)
      newErrors.postalCode = "Postal Code is required";
    if (!customerDetails.country) newErrors.country = "Country is required";
    if (!moveInDetails.moveInDate)
      newErrors.moveInDate = "Move-in date is required";
    else if (moveInDetails.moveInDate < today)
      newErrors.moveInDate = "Date must be today or in the future";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleMoveInDateChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setMoveInDetails({ ...moveInDetails, moveInDate: event.target.value });
    setErrors({ ...errors, moveInDate: undefined });
  };

  const handleDurationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMoveInDetails({ ...moveInDetails, duration: event.target.value });
  };

  const handleCustomerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCustomerDetails({
      ...customerDetails,
      [event.target.name]: event.target.value,
    });
    setErrors({ ...errors, [event.target.name]: undefined });
  };

  const handleBookIt = () => {
    // if (!pgData) return;

    if (!validateForm()) {
      return;
    }

    // const months = getDurationInMonths(moveInDetails.duration);
    // const totalAmount = pgData.monthlyRent * months + pgData.securityDeposit; // Convert to cents
    const totalAmount = (Number(rent) + Number(securityDeposit)) * 100;

    const data = {
      moveInDate: moveInDetails.moveInDate,
      duration: moveInDetails.duration,
      totalAmount: totalAmount,
    };

    localStorage.setItem("data", JSON.stringify(data));
    dispatch(
      createCheckoutSession({
        propertyId: Number(localStorage.getItem("roomId")),
        amount: totalAmount,
        description: `Booking for ${localStorage.getItem("roomTitle")} for ${
          data.duration
        }`,
        customerDetails,
      })
    );
  };

  useEffect(() => {
    if (!propertyId) return;
    dispatch(getSingleProperty(propertyId));
    return () => {
      dispatch(resetPaymentState());
    };
  }, [dispatch, propertyId]);

  useEffect(() => {
    if (sessionId) {
      redirectToCheckout(sessionId).catch((error) => {
        console.error("Redirect to Checkout failed:", error);
      });
    }
  }, [sessionId]);

  return (
    <>
      <Grid size={{ xs: 12 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography variant="h6" color="primary" fontWeight="bold">
              ₹{rent}/month
            </Typography>
          </Box>
          <IconButton>
            <FavoriteBorderIcon sx={{ color: "#757575" }} />
          </IconButton>
        </Box>
        <TextField
          label="Move-In Date"
          type="date"
          value={moveInDetails.moveInDate}
          onChange={handleMoveInDateChange}
          fullWidth
          sx={{ mb: 2 }}
          InputLabelProps={{ shrink: true }}
          inputProps={{ min: today }}
          error={!!errors.moveInDate}
          helperText={errors.moveInDate}
        />
        <TextField
          label="Duration of Stay"
          select
          value={moveInDetails.duration}
          onChange={handleDurationChange}
          fullWidth
          sx={{ mb: 2 }}
          InputLabelProps={{ shrink: true }}
        >
          <MenuItem value="1 month">1 month</MenuItem>
          <MenuItem value="3 months">3 months</MenuItem>
          <MenuItem value="6 months">6 months</MenuItem>
          <MenuItem value="12 months">12 months</MenuItem>
        </TextField>
        <TextField
          label="Full Name"
          name="name"
          value={customerDetails.name}
          onChange={handleCustomerChange}
          fullWidth
          sx={{ mb: 2 }}
          error={!!errors.name}
          helperText={errors.name}
        />
        <TextField
          label="Email"
          name="email"
          value={customerDetails.email}
          onChange={handleCustomerChange}
          fullWidth
          sx={{ mb: 2 }}
          error={!!errors.email}
          helperText={errors.email}
        />
        <TextField
          label="Address Line 1"
          name="addressLine1"
          value={customerDetails.addressLine1}
          onChange={handleCustomerChange}
          fullWidth
          sx={{ mb: 2 }}
          error={!!errors.addressLine1}
          helperText={errors.addressLine1}
        />
        <TextField
          label="City"
          name="city"
          value={customerDetails.city}
          onChange={handleCustomerChange}
          fullWidth
          sx={{ mb: 2 }}
          error={!!errors.city}
          helperText={errors.city}
        />
        <TextField
          label="State"
          name="state"
          value={customerDetails.state}
          onChange={handleCustomerChange}
          fullWidth
          sx={{ mb: 2 }}
          error={!!errors.state}
          helperText={errors.state}
        />
        <TextField
          label="Postal Code"
          name="postalCode"
          value={customerDetails.postalCode}
          onChange={handleCustomerChange}
          fullWidth
          sx={{ mb: 2 }}
          error={!!errors.postalCode}
          helperText={errors.postalCode}
        />
        <TextField
          label="Country"
          name="country"
          value={customerDetails.country}
          onChange={handleCustomerChange}
          fullWidth
          sx={{ mb: 2 }}
          error={!!errors.country}
          helperText={errors.country}
        />
        <Button
          variant="contained"
          fullWidth
          onClick={handleBookIt}
          disabled={isNaN(noOfSet) || noOfSet === 0}
          sx={{
            backgroundColor: "#000",
            color: "#fff",
            borderRadius: "8px",
            textTransform: "none",
            mb: 2,
            "&:hover": { backgroundColor: "#333" },
          }}
        >
          {/* {paymentLoading ? "Processing..." : "Book It"} */}
          Book IT
        </Button>
        {/* {paymentError && (
          <Typography variant="body2" color="error" sx={{ mb: 2 }}>
            {paymentError}
          </Typography>
        )} */}
        <Button
          variant="outlined"
          fullWidth
          sx={{
            borderColor: "#000",
            color: "#000",
            borderRadius: "8px",
            textTransform: "none",
            "&:hover": { borderColor: "#333", color: "#333" },
          }}
        >
          Contact Owner
        </Button>
        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
          sx={{ mt: 1 }}
        >
          Usually responds within 24 hours
        </Typography>
      </Grid>
    </>
  );
};

export default Form;
