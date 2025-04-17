import React from "react";
import { Box, Grid, Typography, Link } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";

const Footer: React.FC = () => {
  return (
    <Box component="footer" sx={{ bgcolor: "#f9f9f9", mt: 5, py: 5, px: 2 }}>
      <Grid container spacing={4} justifyContent="space-between">
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          {/* <Typography variant="h6" fontWeight="bold" gutterBottom>
            LOGO
          </Typography> */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box
              sx={{ backgroundColor: "black", borderRadius: 2, p: 1, mr: 1 }}
            >
              <HomeIcon sx={{ color: "white" }} />
            </Box>
            <Box>
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", lineHeight: 1 }}
              >
                StayEase
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Your Home Away From Home
              </Typography>
            </Box>
          </Box>
          <Typography variant="body2">
            Making property rental simple and efficient for everyone.
          </Typography>
        </Grid>

        <Grid size={{ xs: 6, sm: 3, md: 2 }}>
          <Typography variant="subtitle1" fontWeight="bold">
            Solutions
          </Typography>
          {[
            "Property Listing",
            "Rental Management",
            "Tenant Screening",
            "Payment Processing",
          ].map((item) => (
            <Typography key={item} variant="body2">
              <Link href="#" underline="none" color="text.secondary">
                {item}
              </Link>
            </Typography>
          ))}
        </Grid>

        <Grid size={{ xs: 6, sm: 3, md: 2 }}>
          <Typography variant="subtitle1" fontWeight="bold">
            Support
          </Typography>
          {["Help Center", "FAQs", "Contact Us", "Security"].map((item) => (
            <Typography key={item} variant="body2">
              <Link href="#" underline="none" color="text.secondary">
                {item}
              </Link>
            </Typography>
          ))}
        </Grid>

        <Grid size={{ xs: 6, sm: 3, md: 2 }}>
          <Typography variant="subtitle1" fontWeight="bold">
            Company
          </Typography>
          {["About", "Blog", "Partners", "Careers"].map((item) => (
            <Typography key={item} variant="body2">
              <Link href="#" underline="none" color="text.secondary">
                {item}
              </Link>
            </Typography>
          ))}
        </Grid>

        <Grid size={{ xs: 6, sm: 3, md: 2 }}>
          <Typography variant="subtitle1" fontWeight="bold">
            Legal
          </Typography>
          {["Privacy", "Terms", "Cookie Policy", "Licensing"].map((item) => (
            <Typography key={item} variant="body2">
              <Link href="#" underline="none" color="text.secondary">
                {item}
              </Link>
            </Typography>
          ))}
        </Grid>
      </Grid>

      <Box textAlign="center" mt={4}>
        <Typography variant="caption" color="text.secondary">
          © 2024 RentEase, Inc. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default Footer;
