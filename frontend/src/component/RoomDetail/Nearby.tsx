import React, { useEffect, useState } from "react";
import { Box, Grid, TextField, Typography } from "@mui/material";

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import * as L from "leaflet";
import "leaflet-control-geocoder";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import Loading from "../Loading/Loading";

const Nearby: React.FC = () => {
  // const { loading, property } = useSelector(
  //   (state: RootState) => state.property
  // );
  const { loading, property } = useSelector(
    (state: RootState) => state.property
  ) as {
    loading: boolean;
    property: {
      description: {
        neighborhood?: string;
        transportation?: string;
        neighborhoodDescription?: string;
        pointsOfInterest?: string[];
        neighborhoodLatitude?: number;
        neighborhoodLongitude?: number;
      };
    };
  };

  const [mapLocation, setMapLocation] = useState<[number, number]>([
    28.6841736, 77.3702128,
  ]);

  const handleCurrentLocation = () => {
    alert("Click on the map to change location");
    if (!navigator.geolocation) return alert("Geolocation is not supported");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords: [number, number] = [
          pos.coords.latitude,
          pos.coords.longitude,
        ];
        setMapLocation(coords);
      },
      () => alert("Unable to access your location")
    );
  };

  const LocationSelector = () => {
    useMapEvents({
      click(e) {
        setMapLocation([e.latlng.lat, e.latlng.lng]);
      },
    });
    return null;
  };

  const RecenterMap = ({ lat, lng }: { lat: number; lng: number }) => {
    const map = useMapEvents({});
    useEffect(() => {
      map.setView([lat, lng], map.getZoom());
    }, [lat, lng, map]);
    return null;
  };

  // const GeocoderControl = ({
  //   onSelect,
  // }: {
  //   onSelect: (coords: [number, number]) => void;
  // }) => {
  //   const map = useMapEvents({});
  //   useEffect(() => {
  //     const geocoder = L.Control.geocoder({
  //       defaultMarkGeocode: false,
  //     })
  //       .on("markgeocode", function (e: any) {
  //         const latlng = e.geocode.center;
  //         map.setView(latlng, 16);
  //         onSelect([latlng.lat, latlng.lng]);
  //       })
  //       .addTo(map);

  //     return () => {
  //       geocoder.remove();
  //     };
  //   }, [map, onSelect]);

  //   return null;
  // };
  const GeocoderControl = ({
    onSelect,
  }: {
    onSelect: (coords: [number, number]) => void;
  }) => {
    const map = useMapEvents({});
    useEffect(() => {
      // Explicitly cast the L.Control object to include geocoder functionality
      const geocoder = (L.Control as any)
        .geocoder({
          defaultMarkGeocode: false,
        })
        .on("markgeocode", function (e: any) {
          const latlng = e.geocode.center;
          map.setView(latlng, 16);
          onSelect([latlng.lat, latlng.lng]);
        })
        .addTo(map);

      return () => {
        geocoder.remove();
      };
    }, [map, onSelect]);

    return null;
  };
  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <Box p={2}>
          <Typography variant="h6" gutterBottom mb={3}>
            Neighborhood Information
          </Typography>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <TextField
                id="outlined-read-only-input"
                label="Neighborhood/Area"
                value={property?.description?.neighborhood}
                defaultValue="Hello World"
                autoFocus={false}
                multiline
                minRows={1}
                InputProps={{
                  readOnly: true,
                  sx: {
                    pointerEvents: "none", // disables click
                    alignItems: "flex-start",
                  },
                }}
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                id="outlined-read-only-input"
                label="Public Transportation"
                value={property?.description?.transportation}
                autoFocus={false}
                multiline
                minRows={1}
                InputProps={{
                  readOnly: true,
                  sx: {
                    pointerEvents: "none",
                    alignItems: "flex-start",
                  },
                }}
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                id="outlined-read-only-input"
                label="Neighborhood Description"
                value={property?.description?.neighborhoodDescription}
                autoFocus={false}
                multiline
                minRows={1}
                InputProps={{
                  readOnly: true,
                  sx: {
                    pointerEvents: "none",
                    alignItems: "flex-start",
                  },
                }}
                fullWidth
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="subtitle1" gutterBottom>
                Nearby Points of Interest
              </Typography>

              {property?.description?.pointsOfInterest?.map((point, index) => (
                <li key={index} style={{ marginBottom: "8px" }}>
                  {point}
                </li>
              ))}
            </Grid>

            <Grid size={{ xs: 12 }} sx={{ position: "relative" }}>
              <Typography variant="subtitle1" gutterBottom>
                Map Location
              </Typography>

              <button
                onClick={handleCurrentLocation}
                style={{
                  position: "absolute",
                  zIndex: 1000,
                  bottom: 13,
                  right: 10,
                  background: "rgb(82 82 82 / 16%)",
                  padding: "6px 12px",
                  borderRadius: 4,
                  cursor: "pointer",
                }}
              >
                <MyLocationIcon />
              </button>

              {property?.description?.neighborhoodLatitude &&
                property?.description?.neighborhoodLongitude && (
                  <MapContainer
                    center={[
                      property?.description?.neighborhoodLatitude,
                      property?.description?.neighborhoodLongitude,
                    ]}
                    zoom={13}
                    scrollWheelZoom={false}
                    style={{ height: "300px", width: "100%" }}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={mapLocation} />
                    <LocationSelector />
                    <RecenterMap lat={mapLocation[0]} lng={mapLocation[1]} />
                    <GeocoderControl
                      onSelect={(coords) => setMapLocation(coords)}
                    />
                  </MapContainer>
                )}
            </Grid>
          </Grid>
        </Box>
      )}
    </>
  );
};

export default Nearby;
