import React, { useEffect } from "react";
import {
  Box,
  Typography,
  CardContent,
  Button,
  Grid,
  Chip,
  Container,
} from "@mui/material";
import Slider from "./Slider";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";

import Loading from "../Loading/Loading";
import { getSingleProperty } from "../../store/propertySlice";
import Nearby from "./Nearby";
import HousePolicies from "./HousePolicies";

const RoomDetails: React.FC = () => {
  const navigate = useNavigate();
  const userRole = localStorage.getItem("userRole");
  const { propertyId } = useParams<{ propertyId: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, property: pgData } = useSelector(
    (state: RootState) => state.property
  );

  const bookedRoomData = localStorage.getItem("bookedRoomData");

  useEffect(() => {
    if (!propertyId) return;
    dispatch(getSingleProperty(propertyId));
    // return () => {
    // dispatch(resetPaymentState());
    // };
    return () => {
      localStorage.removeItem("bookedRoomData");
    };
  }, [dispatch, propertyId]);

  const visibleAmenities = pgData?.description?.amenities?.map((a: any) => a);

  const noOfRooms = parseInt(String(pgData?.noOfSet || "0"), 10);
  let availability = "Available";
  let availabilityColor = "#e0f7fa";
  let availabilityTextColor = "#00acc1";

  if (noOfRooms === 0) {
    availability = "Booked";
    availabilityColor = "#ffebee";
    availabilityTextColor = "#f44336";
  } else if (noOfRooms <= 2) {
    availability = "Few Rooms Left";
    availabilityColor = "#fff3e0";
    availabilityTextColor = "#ff9800";
  }

  const handleBookIt = () => {
    // if (!pgData) return;
    localStorage.setItem("rent", String(pgData.rent));
    localStorage.setItem("securityDeposit", String(pgData.securityDeposit));
    localStorage.setItem("noOfSet", String(pgData.noOfSet));
    localStorage.setItem("roomTitle", pgData.description.title);
    navigate("/payemntform");
  };

  return (
    <>
      {loading && <Loading />}
      <Container sx={{ maxWidth: "1600px !important" }}>
        <Box
          sx={{
            padding: { xs: 2, md: 4 },
            backgroundColor: "#fff",
            minHeight: "100vh",
          }}
        >
          <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
              <Grid container>
                <Grid size={{ xs: 12 }}>
                  <Slider />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <CardContent sx={{ flexGrow: 1, padding: "24px" }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 2,
                      }}
                    >
                      <Typography variant="h5" fontWeight="bold">
                        {pgData?.description?.title}
                      </Typography>
                      <Chip
                        label={availability}
                        size="small"
                        sx={{
                          backgroundColor: availabilityColor,
                          color: availabilityTextColor,
                          fontSize: "12px",
                        }}
                      />
                    </Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      {pgData?.address}
                    </Typography>

                    <Grid container sx={{ mb: 1 }} spacing={1}>
                      <Grid size={{ xs: 6 }}>
                        <Box
                          sx={{
                            border: 1,
                            padding: 1,
                            borderRadius: 2,
                            borderColor: "#9f9b9b",
                          }}
                        >
                          <Typography variant="body2" color="text.primary">
                            Room Type
                          </Typography>
                          <Typography variant="body1">
                            {pgData.propertyType}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid size={{ xs: 6 }}>
                        <Box
                          sx={{
                            border: 1,
                            padding: 1,
                            borderRadius: 2,
                            borderColor: "#9f9b9b",
                          }}
                        >
                          <Typography variant="body2" color="text.primary">
                            Occupancy
                          </Typography>
                          <Typography variant="body1">
                            {pgData.bathrooms}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                    <Grid container spacing={1} mb={1}>
                      <Grid size={{ xs: 6 }}>
                        <Box
                          sx={{
                            border: 1,
                            padding: 1,
                            borderRadius: 2,
                            borderColor: "#9f9b9b",
                          }}
                        >
                          <Typography variant="body2" color="text.primary">
                            Security Deposit
                          </Typography>
                          <Typography variant="body1">
                            ₹{pgData.securityDeposit}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid size={{ xs: 6 }}>
                        <Box
                          sx={{
                            border: 1,
                            padding: 1,
                            borderRadius: 2,
                            borderColor: "#9f9b9b",
                          }}
                        >
                          <Typography variant="body2" color="text.primary">
                            Square Foot
                          </Typography>
                          <Typography variant="body1">
                            {pgData.squareFootage}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                    <Grid container spacing={1} mb={2}>
                      <Grid size={{ xs: 12 }}>
                        <Box
                          sx={{
                            border: 1,
                            padding: 1,
                            borderRadius: 2,
                            borderColor: "#9f9b9b",
                          }}
                        >
                          <Typography variant="body2" color="text.primary">
                            Monthly Rent
                          </Typography>
                          <Typography variant="body1">
                            ₹{pgData.rent}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                    <Typography variant="h6" color="text.primary" gutterBottom>
                      Amenities
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 1,
                        mb: 2,
                      }}
                    >
                      {visibleAmenities?.map(
                        (amenity: string, index: number) => (
                          <Chip
                            key={index}
                            label={amenity}
                            size="small"
                            sx={{ backgroundColor: "#f5f5f5" }}
                          />
                        )
                      )}
                    </Box>
                    <Typography variant="h6" color="text.primary" gutterBottom>
                      Description
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      paragraph
                    >
                      {pgData.description?.description}
                    </Typography>
                  </CardContent>
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Nearby />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <HousePolicies />
                </Grid>
                {!bookedRoomData && userRole !== "owner" && (
                  <Grid size={{ xs: 12 }}>
                    <Button variant="outlined" fullWidth onClick={handleBookIt}>
                      Book It
                    </Button>
                  </Grid>
                )}
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </>
  );
};

export default RoomDetails;
