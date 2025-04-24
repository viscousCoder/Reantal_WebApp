import React, { useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Stack,
  Grid,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import Loading from "../Loading/Loading";
import { useNavigate } from "react-router-dom";
import { fetchBookedProperties } from "../../store/AuthSlice";

const BookedRooms: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, bookedRoom: bookings } = useSelector(
    (state: RootState) => state.auth
  );

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleViewDetails = (propertyId: string) => {
    localStorage.setItem("bookedRoomData", "true");
    navigate(`/booked/${propertyId}`);
  };

  useEffect(() => {
    dispatch(fetchBookedProperties());
  }, []);

  return (
    <>
      {loading && <Loading />}
      <Box
        sx={{
          p: { xs: 2, md: 4 },
          backgroundColor: "#f5f7fa",
          minHeight: "100vh",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            mb: 4,
            gap: 2,
          }}
        >
          <Typography variant="h5" fontWeight={600}>
            My Booked Rooms
          </Typography>
          <Button variant="contained" color="primary">
            List Your Property
          </Button>
        </Box>

        {/* Booking Cards */}
        {bookings?.map((booking) => (
          <Card
            key={booking.propertyId}
            sx={{ mb: 3, borderRadius: 2, boxShadow: 1 }}
          >
            <CardContent>
              {/* Title & Rent */}
              <Stack
                direction={isMobile ? "column" : "row"}
                justifyContent="space-between"
                alignItems={isMobile ? "flex-start" : "center"}
                mb={2}
                spacing={1}
              >
                <Typography variant="h6" color="primary">
                  {booking.property.description.title}
                </Typography>
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography variant="h6" color="text.primary">
                    ₹{booking.property.rent}/month
                  </Typography>
                </Box>
              </Stack>

              {/* Location */}
              <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                <LocationOnIcon color="action" fontSize="small" />
                <Typography variant="body2" color="text.secondary">
                  {booking.property.address}
                </Typography>
              </Stack>

              {/* Room Details */}
              <Grid container spacing={2} mb={2}>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Box
                    border={1}
                    borderRadius={2}
                    p={2}
                    borderColor={"#757575"}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Room Type
                    </Typography>
                    <Typography variant="body1">
                      {booking.property.propertyType}
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Box
                    border={1}
                    borderRadius={2}
                    p={2}
                    borderColor={"#757575"}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Check-in Date
                    </Typography>
                    <Typography variant="body1">
                      {booking.moveInDate}
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Box
                    border={1}
                    borderRadius={2}
                    p={2}
                    borderColor={"#757575"}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Duration
                    </Typography>
                    <Typography variant="body1">{booking.duration}</Typography>
                  </Box>
                </Grid>
              </Grid>

              {/* Actions */}
              <Stack direction="row" spacing={2} mt={2}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleViewDetails(booking.property.id)}
                >
                  View Details
                </Button>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Box>
    </>
  );
};

export default BookedRooms;
