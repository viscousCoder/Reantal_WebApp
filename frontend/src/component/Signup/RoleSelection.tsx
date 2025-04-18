import { Box, Button, Typography, Avatar, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ApartmentIcon from "@mui/icons-material/Apartment";
import PersonIcon from "@mui/icons-material/Person";
import { styled } from "@mui/system";

const TestimonialBox = styled(Box)(({ theme }) => ({
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2),
}));

export default function RoleSelection() {
  const navigate = useNavigate();

  const handleNavigation = (role: string) => {
    if (role === "tenant") navigate("/tenant-signup");
    else if (role === "owner") navigate("/owner-signup");
  };

  return (
    <>
      <Grid
        container
        sx={{
          minHeight: "100vh",
          flexDirection: { xs: "column", md: "row" },
        }}
      >
        {/* Left Side */}
        <Grid
          size={{ xs: 12, md: 6 }}
          sx={{
            backgroundImage: `url('https://plus.unsplash.com/premium_photo-1683891068536-2467572c9a2b?q=80&w=3024&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            display: "flex",
            alignItems: "flex-end",
            color: "white",
            padding: 3,
            height: { xs: "50vh", md: "100vh" },
          }}
        >
          <TestimonialBox>
            <Avatar
              alt="Sarah Johnson"
              src="https://randomuser.me/api/portraits/women/44.jpg"
            />
            <Box>
              <Typography variant="body1">
                "Find the perfect accommodation with WebBroker. We offer a wide
                range of rooms, PGs, and hostels to suit your needs and budget."
              </Typography>
              <Typography variant="caption" sx={{ mt: 1 }}>
                Sarah Johnson <br /> Happy Tenant
              </Typography>
            </Box>
          </TestimonialBox>
        </Grid>

        {/* Right Side */}
        <Grid
          size={{ xs: 12, md: 6 }}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: { xs: 3, md: 5 },
          }}
        >
          <Box
            flex={1}
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
          >
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Welcome to WebBroker
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              Select your role to get started
            </Typography>

            <Box mt={4} display="flex" gap={4}>
              <Button
                variant="outlined"
                startIcon={<PersonIcon sx={{ fontSize: 40 }} />}
                sx={{
                  width: 160,
                  height: 160,
                  flexDirection: "column",
                  textTransform: "none",
                  fontSize: 18,
                }}
                onClick={() => handleNavigation("tenant")}
              >
                Tenant
              </Button>
              <Button
                variant="outlined"
                startIcon={<ApartmentIcon sx={{ fontSize: 40 }} />}
                sx={{
                  width: 160,
                  height: 160,
                  flexDirection: "column",
                  textTransform: "none",
                  fontSize: 18,
                }}
                onClick={() => handleNavigation("owner")}
              >
                Property Owner
              </Button>
            </Box>
            <Box>
              <Typography mt={2}>
                Already have an account?{" "}
                <Button
                  onClick={() => navigate("/login")}
                  sx={{ textTransform: "none" }}
                >
                  Sign in
                </Button>
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </>
  );
}
