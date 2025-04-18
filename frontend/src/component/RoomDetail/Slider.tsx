import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardMedia,
  IconButton,
  Stack,
  Container,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ShareIcon from "@mui/icons-material/Share";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ReportIcon from "@mui/icons-material/Report";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { RootState } from "../../store/store";
import { useSelector } from "react-redux";
import Loading from "../Loading/Loading";

const MainImageCard = styled(Card)(({ theme }) => ({
  borderRadius: "12px",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  position: "relative",
  [theme.breakpoints.down("sm")]: {
    height: 200,
  },
}));

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

const OverlayText = styled(Typography)(({ theme }) => ({
  position: "absolute",
  top: 0,
  right: 0,
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  color: "#fff",
  padding: theme.spacing(1),
  borderTopRightRadius: "12px",
  borderBottomLeftRadius: "12px",
  cursor: "pointer",
}));

const Slider: React.FC = () => {
  const { loading, property: singleProperty } = useSelector(
    (state: RootState) => state.property
  );

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const initialVisibleImages = 5; // Initially show 5 images
  const images = singleProperty?.photos?.map(
    (image: { url: string }) => image.url
  );

  // const totalImages = dummyRoomData.images.length;
  const totalImages = images?.length;

  // Automatic Slider
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setCurrentImageIndex((prevIndex) =>
  //       prevIndex === totalImages - 1 ? 0 : prevIndex + 1
  //     );
  //   }, 3000); // Change image every 3 seconds

  //   return () => clearInterval(interval); // Cleanup on unmount
  // }, [totalImages]);

  // Handle Next and Previous Buttons
  const handleNext = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === totalImages - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrevious = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? totalImages - 1 : prevIndex - 1
    );
  };

  // Handle Image Click from List
  const handleImageClick = (index: number) => {
    setCurrentImageIndex(index);
  };

  // Toggle Expand/Collapse
  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // Calculate visible images and remaining count
  const visibleImagesCount = isExpanded ? totalImages : initialVisibleImages;
  const remainingImages = totalImages - visibleImagesCount;

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <Container>
          <Box
            sx={{
              padding: { xs: 2, md: 0 },
              backgroundColor: "#fff",
            }}
          >
            {/* Main Image with Next/Previous Buttons */}
            <MainImageCard sx={{ mb: 2 }}>
              {images?.length > 0 ? (
                <CardMedia
                  component="img"
                  image={images[currentImageIndex]}
                  alt={`Room Image ${currentImageIndex + 1}`}
                  sx={{ height: 400, objectFit: "cover", borderRadius: "12px" }}
                />
              ) : (
                <Typography variant="h6">No images available</Typography>
              )}
              <IconButton
                onClick={handlePrevious}
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: 16,
                  transform: "translateY(-50%)",
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  color: "#fff",
                  "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.7)" },
                }}
              >
                <ArrowBackIosIcon />
              </IconButton>
              <IconButton
                onClick={handleNext}
                sx={{
                  position: "absolute",
                  top: "50%",
                  right: 16,
                  transform: "translateY(-50%)",
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  color: "#fff",
                  "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.7)" },
                }}
              >
                <ArrowForwardIosIcon />
              </IconButton>
            </MainImageCard>

            {/* Image List */}
            <Box
              sx={{
                overflowX: "auto",
                mb: 2,
                display: "flex",
                flexWrap: "nowrap", // Ensure items don't wrap
                "&::-webkit-scrollbar": {
                  height: "8px",
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "#888",
                  borderRadius: "4px",
                },
                "&::-webkit-scrollbar-thumb:hover": {
                  backgroundColor: "#555",
                },
              }}
            >
              <Stack direction="row" spacing={2}>
                {/* {dummyRoomData.images */}
                {images
                  ?.slice(0, visibleImagesCount)
                  ?.map((image: string, index: number) => (
                    <AdditionalImageCard
                      key={index}
                      onClick={() => handleImageClick(index)}
                      sx={{
                        border:
                          currentImageIndex === index
                            ? "2px solid #1976d2"
                            : "none",
                      }}
                    >
                      <CardMedia
                        component="img"
                        image={image}
                        alt={`Image ${index + 1}`}
                        sx={{
                          width: "100%", // Ensure the image takes the full width of the card
                          height: 150,
                          objectFit: "cover",
                          borderRadius: "12px",
                        }}
                      />
                      {index === visibleImagesCount - 1 &&
                        remainingImages > 0 &&
                        !isExpanded && (
                          <OverlayText onClick={handleToggleExpand}>
                            +{remainingImages} more
                          </OverlayText>
                        )}
                    </AdditionalImageCard>
                  ))}
                {isExpanded && (
                  <Button
                    onClick={handleToggleExpand}
                    sx={{
                      display: "inline-flex",
                      alignItems: "center",
                      height: 150,
                      borderRadius: "12px",
                      textTransform: "none",
                      color: "#1976d2",
                      border: "1px solid #1976d2",
                      "&:hover": { backgroundColor: "#f0f0f0" },
                      flexShrink: 0, // Prevent button from shrinking
                      width: 120, // Fixed width for the button
                    }}
                  >
                    Show Less
                  </Button>
                )}
              </Stack>
            </Box>

            {/* Action Buttons */}
            <Box sx={{ display: "flex", gap: 2, mt: 3, flexWrap: "wrap" }}>
              <Button
                variant="outlined"
                startIcon={<ShareIcon />}
                sx={{
                  borderColor: "#1976d2",
                  color: "#1976d2",
                  borderRadius: "8px",
                  textTransform: "none",
                  "&:hover": { borderColor: "#1565c0", color: "#1565c0" },
                }}
              >
                Share
              </Button>
              <Button
                variant="outlined"
                startIcon={<FavoriteBorderIcon />}
                sx={{
                  borderColor: "#1976d2",
                  color: "#1976d2",
                  borderRadius: "8px",
                  textTransform: "none",
                  "&:hover": { borderColor: "#1565c0", color: "#1565c0" },
                }}
              >
                Save
              </Button>
              <Button
                variant="outlined"
                startIcon={<ReportIcon />}
                sx={{
                  borderColor: "#1976d2",
                  color: "#1976d2",
                  borderRadius: "8px",
                  textTransform: "none",
                  "&:hover": { borderColor: "#1565c0", color: "#1565c0" },
                }}
              >
                Report
              </Button>
            </Box>
          </Box>
        </Container>
      )}
    </>
  );
};

export default Slider;
