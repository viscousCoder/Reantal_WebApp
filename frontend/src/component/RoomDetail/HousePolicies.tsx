import React, { JSX, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PetsIcon from "@mui/icons-material/Pets";
import SmokeFreeIcon from "@mui/icons-material/SmokeFree";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import GroupIcon from "@mui/icons-material/Group";
import LocalParkingIcon from "@mui/icons-material/LocalParking";
import SecurityIcon from "@mui/icons-material/Security";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import GavelIcon from "@mui/icons-material/Gavel";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useSelector } from "react-redux";
// import { RootState } from "../../store/store";
import { Property } from "../../store/propertySlice";

interface AdditionalPolicy {
  title: string;
  description: string;
}

interface RootState {
  property: {
    property: Property | null;
  };
}

const iconMap: Record<string, JSX.Element> = {
  Parking: <LocalParkingIcon color="primary" fontSize="large" />,
  Security: <SecurityIcon color="error" fontSize="large" />,
  "Electricity Usage": <FlashOnIcon color="warning" fontSize="large" />,
  Privacy: <VisibilityOffIcon color="action" fontSize="large" />,
  "House Rules": <GavelIcon color="secondary" fontSize="large" />,
};

const truncate = (str: string, n: number) =>
  str?.length > n ? str.substring(0, n - 1) + "..." : str;

const HousePolicies: React.FC = () => {
  const { property } = useSelector((state: RootState) => state.property);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // const policyData: PolicyData = {
  //   petPolicy: "Allowed",
  //   smokingPolicy: "Outside Only",
  //   petPolicyDescription: "Pets allowed with prior approval",
  //   smokingPolicyDescription: "Only allowed on balconies or terrace",
  //   noisePolicy: "Quiet hours after 10 PM",
  //   guestPolicy: "Guests allowed with prior notice",
  //   additionalPolicies: [
  //     {
  //       title: "Parking",
  //       description:
  //         "Don't Rush while parking. Make sure you reverse slowly and follow lines properly.",
  //     },
  //     {
  //       title: "Security",
  //       description:
  //         "Always lock the main door before leaving. Keep your valuables safe and report any suspicious activity.",
  //     },
  //     {
  //       title: "Electricity Usage",
  //       description:
  //         "Turn off lights and appliances when not in use. Do not overload sockets.",
  //     },
  //     {
  //       title: "Privacy",
  //       description:
  //         "Respect others' privacy by not entering their designated space or looking through windows.",
  //     },
  //     {
  //       title: "House Rules",
  //       description:
  //         "Follow all community rules including proper garbage disposal, quiet hours, and guest policies.",
  //     },
  //   ],
  //   updated_at: "2025-04-16T00:48:53.374Z",
  // };

  // const formattedDate = new Date(
  //   property?.policies?.updated_at
  // ).toLocaleDateString("en-US", {
  //   year: "numeric",
  //   month: "long",
  //   day: "numeric",
  // });

  const formattedDate = property?.policies?.updated_at
    ? new Date(property.policies.updated_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A";

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState<AdditionalPolicy | null>(
    null
  );

  const handleCardClick = (policy: AdditionalPolicy) => {
    setSelectedPolicy(policy);
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
    setSelectedPolicy(null);
  };

  const corePolicies: AdditionalPolicy[] = [
    {
      title: `Pet Policy: ${property?.policies?.petPolicy}`,
      description: property?.policies?.petPolicyDescription || "You Make risk",
    },
    {
      title: `Smoking Policy: ${property?.policies?.smokingPolicy}`,
      description:
        property?.policies?.smokingPolicyDescription || "You may risk",
    },
    {
      title: "Noise Policy",
      description:
        property?.policies?.noisePolicy || "Don't Make too much noise.",
    },
    {
      title: "Guest Policy",
      description:
        property?.policies?.guestPolicy || "Inform before bringing guests.",
    },
  ];

  const coreIcons = [
    <PetsIcon color="primary" fontSize="large" />,
    <SmokeFreeIcon color="error" fontSize="large" />,
    <VolumeOffIcon color="secondary" fontSize="large" />,
    <GroupIcon color="success" fontSize="large" />,
  ];

  return (
    <Box p={isMobile ? 2 : 4}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        House Policies
      </Typography>
      <Typography variant="subtitle2" color="textSecondary" mb={3}>
        Last updated: {formattedDate}
      </Typography>

      <Grid container spacing={3}>
        {corePolicies.map((policy, index) => (
          <Grid size={{ xs: 12, md: 6 }} key={index}>
            <Card
              onClick={() => handleCardClick(policy)}
              sx={{ cursor: "pointer" }}
            >
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  {coreIcons[index]}
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {policy.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {truncate(policy.description, 20)}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      {(property?.policies?.additionalPolicies ?? []).length > 0 && (
        <Box mt={5}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Additional Policies
          </Typography>
          <Grid container spacing={3}>
            {property?.policies?.additionalPolicies?.map((policy, index) => (
              <Grid size={{ xs: 12, md: 6 }} key={index}>
                <Card
                  onClick={() => handleCardClick(policy)}
                  sx={{ cursor: "pointer" }}
                >
                  <CardContent>
                    <Box display="flex" alignItems="center" gap={2}>
                      {iconMap[policy.title] || (
                        <GavelIcon color="disabled" fontSize="large" />
                      )}
                      <Box>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {policy.title}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {truncate(policy.description, 40)}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
      <Dialog open={openDialog} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>
          {selectedPolicy?.title}
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography>{selectedPolicy?.description}</Typography>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default HousePolicies;
