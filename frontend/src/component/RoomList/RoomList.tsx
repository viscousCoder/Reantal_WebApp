import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Stack,
  Pagination,
  PaginationItem,
  Container,
  Chip,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";

import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarHalfIcon from "@mui/icons-material/StarHalf";
import { fetchProperties } from "../../store/propertySlice";
import Loading from "../Loading/Loading";

// Random rating and review helper
const getRandomRating = () => {
  const ratings = [2, 2.5, 3.5, 4, 4.5, 5];
  const index = Math.floor(Math.random() * ratings.length);
  return ratings[index];
};

const getRandomReviewCount = () => Math.floor(Math.random() * 100) + 1;

const PGCard = styled(Card)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  height: "100%",
  borderRadius: "12px",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  [theme.breakpoints.down("sm")]: {
    margin: theme.spacing(1),
  },
}));

const PGList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, properties: dummyPGData } = useSelector(
    (state: RootState) => state.property
  );

  //   console.log(loading, properties);

  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    dispatch(fetchProperties());
    //   localStorage.removeItem("data");
  }, []);

  const totalPages = Math.ceil(dummyPGData.length / itemsPerPage);

  const currentItems = dummyPGData.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const renderCustomPaginationItem = (item: any) => {
    const { type, page: itemPage, onClick, selected } = item;

    if (type === "page") {
      if (
        itemPage <= 2 ||
        itemPage >= totalPages - 1 ||
        itemPage === page ||
        itemPage === page - 1 ||
        itemPage === page + 1
      ) {
        return (
          <PaginationItem {...item} onClick={onClick} selected={selected} />
        );
      }
      if (itemPage === 3 && page > 3) {
        return (
          <Typography key={`ellipsis-start-${itemPage}`} color="text.secondary">
            ...
          </Typography>
        );
      }
      if (itemPage === totalPages - 2 && page < totalPages - 2) {
        return (
          <Typography key={`ellipsis-end-${itemPage}`} color="text.secondary">
            ...
          </Typography>
        );
      }
      return null;
    }
    return (
      <PaginationItem
        slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
        {...item}
      />
    );
  };

  const handleClick = (pgId: string) => {
    localStorage.setItem("roomId", pgId);
    navigate(`/room-detail/${pgId}`);
  };

  return (
    <>
      {/* {propertyLoading ? (
        <Loading />
      ) : ( */}
      {loading && <Loading />}
      <Container sx={{ maxWidth: "1600px !important" }}>
        <Box
          sx={{
            padding: { xs: 2, md: 4 },
            backgroundColor: "#f5f5f5",
            minHeight: "100vh",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 4,
            }}
          >
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              sx={{ fontWeight: "bold" }}
            >
              PG Listings
            </Typography>
          </Box>
          <Box sx={{ minHeight: "51rem" }}>
            <Grid container spacing={3}>
              {currentItems.map((pg: any) => {
                const rating = getRandomRating();
                const reviews = getRandomReviewCount();
                const noOfRooms = parseInt(pg.noOfSet, 10);
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

                const visibleAmenities = pg?.description?.amenities
                  ?.map((a: any) => a)
                  .slice(0, 3);
                const moreCount =
                  pg?.description?.amenities.map((a: any) => a).length - 3;

                // console.log(
                //   visibleAmenities,
                //   "Data",
                //   pg?.description?.amenities
                // );

                return (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={pg.id}>
                    <PGCard>
                      <Box
                        sx={{
                          height: 200,
                          backgroundImage: `url(${pg.photos[0]?.url})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          borderTopLeftRadius: "12px",
                          borderTopRightRadius: "12px",
                        }}
                      />
                      <CardContent sx={{ flexGrow: 1, padding: "16px" }}>
                        <Box sx={{ minHeight: { md: "14rem", lg: "12rem" } }}>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              mb: 1,
                            }}
                          >
                            <Typography variant="subtitle1" fontWeight="bold">
                              {pg?.description?.title}
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
                            {pg?.address}
                          </Typography>
                          {/* <Box
                          sx={{ display: "flex", alignItems: "center", mb: 1 }}
                        >
                          <Typography variant="body2" color="text.primary">
                            ★ {rating} ({reviews} reviews)
                          </Typography>
                        </Box> */}
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              mb: 1,
                            }}
                          >
                            {/* Render stars based on rating */}
                            {Array.from({ length: 5 }).map((_, index) => {
                              const starValue = index + 1;
                              return (
                                <Box
                                  key={index}
                                  sx={{ color: "#FFD700" /* Gold */ }}
                                >
                                  {rating >= starValue ? (
                                    <StarIcon fontSize="small" />
                                  ) : rating >= starValue - 0.5 ? (
                                    <StarHalfIcon fontSize="small" />
                                  ) : (
                                    <StarBorderIcon fontSize="small" />
                                  )}
                                </Box>
                              );
                            })}
                            <Typography
                              variant="body2"
                              color="text.primary"
                              sx={{ ml: 1 }}
                            >
                              {rating} ({reviews} reviews)
                            </Typography>
                          </Box>

                          <Box
                            sx={{
                              display: "flex",
                              flexWrap: "wrap",
                              gap: 0.5,
                              mt: 1,
                              mb: 1,
                            }}
                          >
                            {visibleAmenities.map(
                              (amenity: any, index: number) => (
                                <Chip
                                  key={index}
                                  label={amenity}
                                  size="small"
                                />
                              )
                            )}
                            {moreCount > 0 && (
                              <Chip label={`+${moreCount} more`} size="small" />
                            )}
                          </Box>
                          <Typography
                            variant="h6"
                            color="primary"
                            gutterBottom
                            sx={{ fontWeight: "bold" }}
                          >
                            ₹{pg.rent}/month
                          </Typography>
                        </Box>
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
                          onClick={() => handleClick(pg.id)}
                        >
                          View Details
                        </Button>
                      </CardContent>
                    </PGCard>
                  </Grid>
                );
              })}
            </Grid>
          </Box>
          <Stack spacing={2} sx={{ mt: 4, alignItems: "center" }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(_, value) => setPage(value)}
              renderItem={renderCustomPaginationItem}
              siblingCount={1}
              boundaryCount={2}
            />
          </Stack>
        </Box>
      </Container>
      {/* )} */}
    </>
  );
};

export default PGList;
