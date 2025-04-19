import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import * as L from "leaflet";
import "leaflet-control-geocoder";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";

interface NeighborhoodProps {
  initialValues: {
    neighborhood: string;
    transportation: string;
    description: string;
    points: string[];
    location: [number, number];
  };
  onUpdate: (data: {
    neighborhood: string;
    transportation: string;
    neighborhoodDescription: string;
    pointsOfInterest: string[];
    location: [number, number];
  }) => void;
  errors: {
    neighborhood?: string;
    transportation?: string;
    neighborhoodDescription?: string;
    pointsOfInterest?: string;
    amenities?: string;
  };
  onFieldFocus: (field: string) => void;
}

const Neighborhood: React.FC<NeighborhoodProps> = ({
  initialValues,
  onUpdate,
  errors,
  onFieldFocus,
}) => {
  const [neighborhood, setNeighborhood] = useState(initialValues?.neighborhood);
  const [transportation, setTransportation] = useState(
    initialValues?.transportation
  );
  const [description, setDescription] = useState(initialValues?.description);
  const [points, setPoints] = useState<string[]>(initialValues?.points);
  const [mapLocation, setMapLocation] = useState<[number, number]>(
    initialValues?.location
  );

  const handlePointChange = (index: number, value: string) => {
    const updated = [...points];
    updated[index] = value;
    setPoints(updated);
  };

  const addPoint = () => {
    setPoints([...points, ""]);
    onFieldFocus("pointsOfInterest");
  };

  const handleRemovePoint = (index: number) => {
    const updated = [...points];
    updated.splice(index, 1);
    setPoints(updated);
  };

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

  useEffect(() => {
    if (typeof onUpdate === "function") {
      onUpdate({
        neighborhood,
        transportation,
        neighborhoodDescription: description,
        pointsOfInterest: points,
        location: mapLocation,
      });
    }
  }, [neighborhood, transportation, description, points, mapLocation]);

  return (
    <Box p={2}>
      <Typography variant="h6" gutterBottom>
        Neighborhood Information
      </Typography>
      <Typography variant="body2" gutterBottom>
        Describe the area around your property
      </Typography>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Neighborhood/Area"
            value={neighborhood}
            onChange={(e) => setNeighborhood(e.target.value)}
            fullWidth
            onFocus={() => onFieldFocus("neighborhood")}
            error={!!errors.neighborhood}
            helperText={errors.neighborhood}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Public Transportation"
            value={transportation}
            onChange={(e) => setTransportation(e.target.value)}
            fullWidth
            onFocus={() => onFieldFocus("transportation")}
            error={!!errors.transportation}
            helperText={errors.transportation}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextField
            label="Neighborhood Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            multiline
            rows={4}
            onFocus={() => onFieldFocus("neighborhoodDescription")}
            error={!!errors.neighborhoodDescription}
            helperText={errors.neighborhoodDescription}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography variant="subtitle1" gutterBottom>
            Nearby Points of Interest
          </Typography>

          {points?.map((point, index) => (
            <Box key={index} display="flex" alignItems="center" gap={1} mb={1}>
              <TextField
                value={point}
                onChange={(e) => handlePointChange(index, e.target.value)}
                fullWidth
                // onFocus={() => onFieldFocus("pointsOfInterest")}
              />
              <IconButton
                onClick={() => handleRemovePoint(index)}
                color="error"
                aria-label="delete"
                size="small"
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          ))}
          <Button onClick={addPoint} startIcon={<AddIcon />} sx={{ mt: 1 }}>
            Add another point of interest
          </Button>
          {errors.pointsOfInterest && (
            <Typography variant="body2" color="error" sx={{ mt: 2 }}>
              {errors.pointsOfInterest}
            </Typography>
          )}
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }} sx={{ position: "relative" }}>
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

          {mapLocation && mapLocation.length === 2 && (
            <MapContainer
              center={mapLocation}
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
              <GeocoderControl onSelect={(coords) => setMapLocation(coords)} />
            </MapContainer>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default Neighborhood;
