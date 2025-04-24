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
  Stack,
  styled,
  CardMedia,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { fetchUserAllDetails } from "../../store/AuthSlice";
import Loading from "../Loading/Loading";
import { useNavigate } from "react-router-dom";
import AssuredWorkloadIcon from "@mui/icons-material/AssuredWorkload";
import SyncLockIcon from "@mui/icons-material/SyncLock";
import HistoryIcon from "@mui/icons-material/History";
import { Photo } from "../../types/Admin";
import PersonIcon from "@mui/icons-material/Person";

const AdditionalImageCard = styled(Card)(({ theme }) => ({
  borderRadius: "12px",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  position: "relative",
  cursor: "pointer",
  flexShrink: 0,
  width: 120,
  [theme.breakpoints.down("sm")]: {
    height: 100,
    width: 150, // Slightly smaller width on small screens
  },
}));

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, userFullDetails: user } = useSelector(
    (state: RootState) => state.auth
  );

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    dispatch(fetchUserAllDetails());
  }, []);

  const handleClick = (url: string) => {
    window.open(url);
  };

  return (
    <>
      {loading && <Loading />}
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
              <Chip
                icon={<PersonIcon />}
                label={user?.userRole}
                color="primary"
              />
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
                  <EmailIcon sx={{ verticalAlign: "middle", mr: 1 }} /> Contact
                  Information
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
              {user && "paymentMethod" in user && (
                <>
                  {user.paymentMethod === "Card" ? (
                    <>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography variant="h6" gutterBottom>
                          <AssuredWorkloadIcon
                            sx={{ verticalAlign: "middle", mr: 1 }}
                          />{" "}
                          Bank Info
                        </Typography>
                        <Typography>
                          Payment Method: {user?.paymentMethod}
                        </Typography>
                        <Typography>
                          Account Number: {user?.paymentMethods[0].cardNumber}
                        </Typography>
                        <Typography>
                          IFSC Number: {user?.paymentMethods[0].ifsc}
                        </Typography>
                      </Grid>
                    </>
                  ) : (
                    <>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography variant="h6" gutterBottom>
                          <AssuredWorkloadIcon
                            sx={{ verticalAlign: "middle", mr: 1 }}
                          />{" "}
                          Payment Info
                        </Typography>
                        <Typography>
                          Payment Method: {user?.paymentMethod}
                        </Typography>
                        <Typography>
                          Upi Id:{" "}
                          {user?.paymentMethods.length != 0
                            ? user?.paymentMethods[0]?.upiId
                            : "N/A"}
                        </Typography>
                      </Grid>
                    </>
                  )}
                </>
              )}
            </Grid>
          </CardContent>
        </Card>

        {/* Rental History  */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            {user && "paymentMethod" in user && (
              <>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="h6" gutterBottom>
                    <HistoryIcon sx={{ verticalAlign: "middle", mr: 1 }} />{" "}
                    Rental History
                  </Typography>
                  <Stack direction="row" spacing={2} sx={{ overflow: "auto" }}>
                    {user?.history.length === 0 ? (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          height: "200px",
                          backgroundColor: "#f5f5f5",
                          borderRadius: "8px",
                          textAlign: "center",
                          width: "100%",
                        }}
                      >
                        <Typography variant="h6" color="textSecondary">
                          No Rented History
                        </Typography>
                      </Box>
                    ) : (
                      <>
                        {user?.history?.map((images: Photo, index: any) => (
                          <AdditionalImageCard key={index}>
                            <CardMedia
                              component={"img"}
                              image={images.url}
                              onClick={() => handleClick(images.url)}
                            />
                          </AdditionalImageCard>
                        ))}
                      </>
                    )}
                  </Stack>
                </Grid>
              </>
            )}
          </CardContent>
        </Card>

        {/* Update Password */}
        {localStorage.getItem("id") === user?.id && (
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <SyncLockIcon sx={{ verticalAlign: "middle", mr: 1 }} />{" "}
                Password Update
              </Typography>

              <Typography variant="body2" sx={{ mb: 2 }}>
                It's a good idea to update your password regularly to keep your
                account secure. Click the button below to change your current
                password.
              </Typography>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Button
                    variant="outlined"
                    onClick={() => navigate("/update-password")}
                  >
                    Update Password
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}

        {/* Bookings */}

        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              <CalendarTodayIcon sx={{ verticalAlign: "middle", mr: 1 }} /> Your
              Listed Properties
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
                        <Card sx={{ display: "flex", flexDirection: "column" }}>
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
                              <Typography variant="subtitle1" fontWeight={600}>
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
                        {/* <CardActionArea> */}
                        {/* <CardActions> */}
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
                        {/* </CardActions> */}
                        {/* </CardActionArea> */}
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
    </>
  );
};

export default Profile;
