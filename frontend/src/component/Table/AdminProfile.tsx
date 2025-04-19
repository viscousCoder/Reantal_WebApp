import React, { useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Grid,
  Chip,
  useMediaQuery,
  useTheme,
  CardActionArea,
  CardActions,
  Button,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import Loading from "../Loading/Loading";
import { useNavigate } from "react-router-dom";
import { fetchSelectedUser } from "../../store/adminSlice";

const AdminProfile: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { loading, slectedUser: user } = useSelector(
    (state: RootState) => state.admin
  );

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const selectedUserId = localStorage.getItem("selectedUserId");
    const selectedUserRole = localStorage.getItem("selectedUserRole");
    if (!selectedUserId || !selectedUserRole) {
      navigate("/");
      return;
    }
    dispatch(
      fetchSelectedUser({ userId: selectedUserId, userRole: selectedUserRole })
    );
  }, []);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <Box p={2}>
          {/* Profile Header */}
          <Card
            sx={{
              mb: 2,
              p: 3,
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              alignItems: "center",
              gap: 3,
            }}
          >
            <Avatar
              src={user?.profilePicture || ""}
              alt={user?.fullName || ""}
              sx={{ width: 80, height: 80 }}
            />
            <Box>
              <Typography variant="h5">{user?.fullName}</Typography>
              <Box sx={{ display: "flex", gap: 1, mt: 1, flexWrap: "wrap" }}>
                <Chip label={user?.userRole} color="primary" />
                <Chip
                  icon={<EmailIcon />}
                  label="Email"
                  color={user?.emailVerified ? "success" : "default"}
                />
                <Chip
                  icon={<PhoneIcon />}
                  label="Phone"
                  color={user?.phoneVerified ? "success" : "warning"}
                />
              </Box>
            </Box>
          </Card>

          {/* Contact & Address */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="h6" gutterBottom>
                    <EmailIcon sx={{ verticalAlign: "middle", mr: 1 }} />{" "}
                    Contact Information
                  </Typography>
                  <Typography>Email: {user?.email}</Typography>
                  <Typography>
                    Phone: {user?.phoneCode}-{user?.phoneNumber}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="h6" gutterBottom>
                    <LocationOnIcon sx={{ verticalAlign: "middle", mr: 1 }} />{" "}
                    Address
                  </Typography>
                  <Typography>Street: {user?.street}</Typography>
                  <Typography>
                    Location: {user?.city}, {user?.state} {user?.zip}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <CalendarTodayIcon sx={{ verticalAlign: "middle", mr: 1 }} />{" "}
                Your Listed Properties
              </Typography>

              {/* Check if the user is an owner/admin or tenant */}
              {user?.userRole === "owner" || user?.userRole === "admin" ? (
                // If user is an owner/admin, show their listed properties
                user?.properties?.length === 0 ? (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "200px",
                      backgroundColor: "#f5f5f5",
                      borderRadius: "8px",
                      textAlign: "center",
                    }}
                  >
                    <Typography variant="h6" color="textSecondary">
                      You have no listed properties at the moment.
                    </Typography>
                  </Box>
                ) : (
                  <Grid container spacing={2}>
                    {user?.properties?.map((listed) => {
                      let availability = "Available";
                      let availabilityColor = "#e0f7fa";
                      let availabilityTextColor = "#00acc1";
                      const noOfRooms = listed.noOfSet;

                      // Determine the availability status
                      if (noOfRooms === 0) {
                        availability = "Booked";
                        availabilityColor = "#ffebee";
                        availabilityTextColor = "#f44336";
                      } else if (noOfRooms <= 2) {
                        availability = "Few Rooms Left";
                        availabilityColor = "#fff3e0";
                        availabilityTextColor = "#ff9800";
                      }

                      return (
                        <Grid size={{ xs: 12, md: 4 }} key={listed.id}>
                          <Card
                            sx={{ display: "flex", flexDirection: "column" }}
                          >
                            {/* Property Image */}
                            <img
                              src={listed.photos[0]?.url}
                              alt={listed.description.title}
                              style={{
                                width: "100%",
                                height: 200,
                                objectFit: "cover",
                              }}
                            />
                            <CardContent sx={{ minHeight: "8.5rem" }}>
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <Box>
                                  <Typography
                                    variant="subtitle1"
                                    fontWeight={600}
                                  >
                                    {listed.description.title}
                                  </Typography>
                                  <Typography>
                                    Listed Date:{" "}
                                    {new Date(
                                      listed.created_at
                                    ).toLocaleDateString()}
                                  </Typography>
                                  <Typography>
                                    Rent: ₹{listed.rent}/month
                                  </Typography>
                                </Box>
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
                            </CardContent>
                            <CardActionArea>
                              <CardActions>
                                <Button
                                  variant="contained"
                                  fullWidth
                                  sx={{
                                    backgroundColor: "#000",
                                    color: "#fff",
                                    borderRadius: "8px",
                                    textTransform: "none",
                                    padding: "8px 16px",
                                    "&:hover": {
                                      backgroundColor: "#333",
                                    },
                                  }}
                                  onClick={() =>
                                    navigate(`/property/${listed.id}`)
                                  }
                                >
                                  View Details
                                </Button>
                              </CardActions>
                            </CardActionArea>
                          </Card>
                        </Grid>
                      );
                    })}
                  </Grid>
                )
              ) : user?.userRole === "tenant" ? (
                // If the user is a tenant, show their booked properties
                user?.bookings?.length === 0 ? (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "200px",
                      backgroundColor: "#f5f5f5",
                      borderRadius: "8px",
                      textAlign: "center",
                    }}
                  >
                    <Typography variant="h6" color="textSecondary">
                      You have no booked properties at the moment.
                    </Typography>
                  </Box>
                ) : (
                  <Grid container spacing={2}>
                    {user?.bookings?.map((booking) => (
                      <Grid size={{ xs: 12, md: 4 }} key={booking.id}>
                        <Card sx={{ display: "flex", flexDirection: "column" }}>
                          <img
                            src={booking.property.photos[0]?.url}
                            alt={booking.property.description.title}
                            style={{
                              width: "100%",
                              height: 200,
                              objectFit: "cover",
                            }}
                          />
                          <CardContent sx={{ minHeight: "8.5rem" }}>
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <Box>
                                <Typography
                                  variant="subtitle1"
                                  fontWeight={600}
                                >
                                  {booking.property.description.title}
                                </Typography>
                                <Typography>
                                  Booking Date:{" "}
                                  {new Date(
                                    booking.created_at
                                  ).toLocaleDateString()}
                                </Typography>
                                <Typography>
                                  Rent: ₹{booking.property.rent}/month
                                </Typography>
                              </Box>
                              <Chip
                                label="Booked"
                                size="small"
                                sx={{
                                  backgroundColor: "#ffebee",
                                  color: "#f44336",
                                  fontSize: "12px",
                                }}
                              />
                            </Box>
                          </CardContent>
                          <CardActionArea>
                            <CardActions>
                              <Button
                                variant="contained"
                                fullWidth
                                sx={{
                                  backgroundColor: "#000",
                                  color: "#fff",
                                  borderRadius: "8px",
                                  textTransform: "none",
                                  padding: "8px 16px",
                                  "&:hover": {
                                    backgroundColor: "#333",
                                  },
                                }}
                                onClick={() =>
                                  navigate(`/property/${booking.property.id}`)
                                }
                              >
                                View Details
                              </Button>
                            </CardActions>
                          </CardActionArea>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                )
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "200px",
                    backgroundColor: "#f5f5f5",
                    borderRadius: "8px",
                    textAlign: "center",
                  }}
                >
                  <Typography variant="h6" color="textSecondary">
                    You do not have any properties or bookings.
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Box>
      )}
    </>
  );
};

export default AdminProfile;
