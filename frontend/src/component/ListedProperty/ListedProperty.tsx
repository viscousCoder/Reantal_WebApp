import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
  useMediaQuery,
  Card,
  CardContent,
  Grid,
  Pagination,
  PaginationItem,
  Stack,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import Loading from "../Loading/Loading";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useNavigate } from "react-router-dom";
import { getCurrentOwnerProperties } from "../../store/ownerSlice";

// Image preview box
const PlaceholderImage: React.FC<{ image?: string }> = ({ image }) => {
  return (
    <Box
      sx={{
        minWidth: "6rem",
        width: 100,
        height: 100,
        borderRadius: 2,
        marginRight: 2,
        backgroundColor: image ? "transparent" : "#e0e0e0",
        backgroundImage: image ? `url(${image})` : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {!image && (
        <Typography variant="caption" color="text.secondary">
          Image
        </Typography>
      )}
    </Box>
  );
};

// Styled table row
const PropertyRow = styled(TableRow)({
  "&:nth-of-type(odd)": {
    backgroundColor: "#f9f9f9",
  },
});

const ListedProperties: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { currentOwnerLoading, currentOwnerProperties: properties } =
    useSelector((state: RootState) => state.owner);
  // console.log(properties, "data");
  const [page, setPage] = useState(1);
  const itemsPerPage = 4;

  const totalPages = Math.ceil(properties.length / itemsPerPage);
  const currentItems = properties.slice(
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

  useEffect(() => {
    dispatch(getCurrentOwnerProperties());
  }, [dispatch]);

  const handleAction = (propertyId: string) => {
    localStorage.setItem("bookedRoomData", "true");
    navigate(`/listed/${propertyId}`);
  };

  // if (currentOwnerLoading) {
  //   return <Loading />;
  // }

  return (
    <>
      {currentOwnerLoading && <Loading />}
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
            My Listed Properties
          </Typography>
          {/* <Button variant="contained" color="primary">
          Add New Property
        </Button> */}
        </Box>

        {/* Responsive View */}
        {isMobile ? (
          <Grid container spacing={2}>
            {currentItems?.map((property) => (
              <Grid size={{ xs: 12 }} key={property.id}>
                <Card sx={{ borderRadius: 2 }}>
                  <CardContent>
                    <Box display="flex" gap={2} mb={2}>
                      <PlaceholderImage image={property?.photos[0]?.url} />
                      <Box>
                        <Typography variant="body1">
                          {property.description.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {property.propertyType}
                        </Typography>

                        <Chip
                          label={"Listed"}
                          color={"success"}
                          size="small"
                          sx={{ mt: 1 }}
                        />
                      </Box>
                    </Box>

                    <Typography variant="body2" color="text.secondary">
                      Location:
                    </Typography>
                    <Typography variant="body1">{property.address}</Typography>

                    <Typography variant="body2" color="text.secondary" mt={2}>
                      Price:
                    </Typography>
                    <Typography variant="body1">
                      ₹{property.rent}/month
                    </Typography>

                    <Typography variant="body2" color="text.secondary" mt={2}>
                      Total Rooms:
                    </Typography>
                    <Typography variant="body1">{property.noOfSet}</Typography>

                    <Typography variant="body2" color="text.secondary" mt={2}>
                      Listed on:
                    </Typography>
                    <Typography variant="body1">
                      {new Date(property.created_at).toLocaleDateString()}
                    </Typography>

                    <Box mt={3}>
                      <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={() => handleAction(property.id)}
                      >
                        {property.status === "Listed"
                          ? "Edit"
                          : property.status === "Draft"
                          ? "View"
                          : "View Activate"}
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Table sx={{ minWidth: 650 }} aria-label="listed properties table">
            <TableHead>
              <TableRow>
                <TableCell>PROPERTY</TableCell>
                <TableCell>LOCATION</TableCell>
                <TableCell>STATUS</TableCell>
                <TableCell>PRICE</TableCell>
                <TableCell>DETAILS</TableCell>
                <TableCell>ACTIONS</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentItems?.map((property) => (
                <PropertyRow key={property.id}>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <PlaceholderImage image={property.photos[0]?.url} />
                      <Box>
                        <Typography variant="body1">
                          {property.description.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {property.propertyType}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>{property.address}</TableCell>
                  <TableCell>
                    <Chip label={"Listed"} color={"success"} size="small" />
                  </TableCell>
                  <TableCell>₹{property.rent}/month</TableCell>
                  <TableCell>
                    Total Rooms: {property.noOfSet}
                    <br />
                    Listed: {new Date(property.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleAction(property.id)}
                    >
                      {property.status === "Listed"
                        ? "Edit"
                        : property.status === "Draft"
                        ? "View"
                        : "View Activate"}
                    </Button>
                  </TableCell>
                </PropertyRow>
              ))}
            </TableBody>
          </Table>
        )}

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
    </>
  );
};

export default ListedProperties;
