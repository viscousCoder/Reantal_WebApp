import React, { useState } from "react";
import {
  Box,
  Checkbox,
  FormControlLabel,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

interface DescriptionFormValues {
  propertyTitle: string;
  detailedDescription: string;
  shortDescription: string;
  amenities: string[];
}

interface DescriptionProps {
  initialValues: DescriptionFormValues;
  onUpdate: (values: DescriptionFormValues) => void;
}

const amenitiesOptions = {
  basic: [
    "Heating",
    "Air Conditioning",
    "Washer",
    "Dryer",
    "Fireplace",
    "WiFi",
    "TV",
    "Cable",
  ],
  kitchen: [
    "Refrigerator",
    "Microwave",
    "Oven",
    "Stove",
    "Dishwasher",
    "Coffee Maker",
    "Toaster",
    "Garbage Disposal",
  ],
  safety: [
    "Smoke Detector",
    "Carbon Monoxide Detector",
    "Fire Extinguisher",
    "First Aid Kit",
    "Security System",
    "Security Camera",
    "Deadbolt Lock",
    "Emergency Exit",
  ],
  community: [
    "Swimming Pool",
    "Fitness Center",
    "Parking",
    "Elevator",
    "Rooftop Terrace",
    "BBQ Area",
    "Laundry Facilities",
    "Storage Space",
  ],
  additional: [],
};

const Description: React.FC<DescriptionProps> = ({
  initialValues,
  onUpdate,
}) => {
  const [form, setForm] = useState<DescriptionFormValues>(initialValues);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const newForm = { ...prev, [name]: value };
      onUpdate(newForm);
      return newForm;
    });
  };

  const handleAmenityToggle = (amenity: string) => {
    setForm((prev) => {
      const newAmenities = prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity];
      const newForm = { ...prev, amenities: newAmenities };
      onUpdate(newForm);
      return newForm;
    });
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Property Description
      </Typography>
      <Typography variant="subtitle2" gutterBottom>
        Write a compelling description to attract potential tenants
      </Typography>

      <Box sx={{ p: 2, border: "1px solid #ddd", borderRadius: 2, mb: 4 }}>
        <TextField
          label="Property Title"
          name="propertyTitle"
          value={form.propertyTitle}
          onChange={handleChange}
          fullWidth
          helperText="Create a catchy title that highlights key features (70 characters max)"
          inputProps={{ maxLength: 70 }}
          sx={{ mb: 2 }}
        />

        <TextField
          label="Detailed Description"
          name="detailedDescription"
          value={form.detailedDescription}
          onChange={handleChange}
          fullWidth
          multiline
          rows={4}
          sx={{ mb: 2 }}
          helperText={`${form.detailedDescription.length} characters (min. 200)`}
          inputProps={{ maxLength: 2000 }}
        />

        <TextField
          label="Short Description"
          name="shortDescription"
          value={form.shortDescription}
          onChange={handleChange}
          fullWidth
          helperText="This will appear in search results (150 characters max)"
          inputProps={{ maxLength: 150 }}
          sx={{ mb: 2 }}
        />
      </Box>

      <Typography variant="h6" gutterBottom>
        Amenities & Features
      </Typography>
      <Typography variant="subtitle2" gutterBottom>
        Select all amenities and features available at your property
      </Typography>

      <Box sx={{ p: 2, border: "1px solid #ddd", borderRadius: 2, mb: 4 }}>
        <Typography variant="subtitle1" gutterBottom>
          Basic Amenities
        </Typography>
        <Grid container spacing={1}>
          {amenitiesOptions.basic.map((amenity) => (
            <Grid size={{ xs: 4 }} key={amenity}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={form.amenities.includes(amenity)}
                    onChange={() => handleAmenityToggle(amenity)}
                  />
                }
                label={amenity}
              />
            </Grid>
          ))}
        </Grid>

        <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
          Kitchen
        </Typography>
        <Grid container spacing={1}>
          {amenitiesOptions.kitchen.map((amenity) => (
            <Grid size={{ xs: 4 }} key={amenity}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={form.amenities.includes(amenity)}
                    onChange={() => handleAmenityToggle(amenity)}
                  />
                }
                label={amenity}
              />
            </Grid>
          ))}
        </Grid>

        <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
          Safety Features
        </Typography>
        <Grid container spacing={1}>
          {amenitiesOptions.safety.map((amenity) => (
            <Grid size={{ xs: 4 }} key={amenity}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={form.amenities.includes(amenity)}
                    onChange={() => handleAmenityToggle(amenity)}
                  />
                }
                label={amenity}
              />
            </Grid>
          ))}
        </Grid>

        <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
          Community Amenities
        </Typography>
        <Grid container spacing={1}>
          {amenitiesOptions.community.map((amenity) => (
            <Grid size={{ xs: 4 }} key={amenity}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={form.amenities.includes(amenity)}
                    onChange={() => handleAmenityToggle(amenity)}
                  />
                }
                label={amenity}
              />
            </Grid>
          ))}
        </Grid>

        <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
          Additional Amenities
        </Typography>
        <Grid container spacing={1}>
          {form.amenities
            .filter(
              (amenity) =>
                !Object.values(amenitiesOptions).flat().includes(amenity)
            )
            .map((amenity, index) => (
              <Grid size={{ xs: 4 }} key={index}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography variant="body2">{amenity}</Typography>
                  <IconButton
                    size="small"
                    onClick={() => handleAmenityToggle(amenity)}
                    sx={{ ml: 1 }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Grid>
            ))}
          <Grid size={{ xs: 4 }}>
            {/* <TextField
              label="Add amenity..."
              variant="outlined"
              size="small"
              onKeyPress={(e) => {
                if (e.key === "Enter" && e.currentTarget.value.trim()) {
                  handleAmenityToggle(e.currentTarget.value.trim());
                  e.currentTarget.value = "";
                }
              }}
              InputProps={{
                endAdornment: (
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      const input = (e.target as HTMLElement)
                        .closest("div")
                        ?.querySelector("input");
                      if (input && input.value.trim()) {
                        handleAmenityToggle(input.value.trim());
                        input.value = "";
                      }
                    }}
                  >
                    <AddIcon />
                  </IconButton>
                ),
              }}
            /> */}
            <TextField
              label="Add amenity..."
              variant="outlined"
              size="small"
              onKeyPress={(e) => {
                const input = e.target as HTMLInputElement;
                if (e.key === "Enter" && input.value.trim()) {
                  handleAmenityToggle(input.value.trim());
                  input.value = "";
                }
              }}
              InputProps={{
                endAdornment: (
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      const input = (e.target as HTMLElement)
                        .closest("div")
                        ?.querySelector("input");
                      if (input && input.value.trim()) {
                        handleAmenityToggle(input.value.trim());
                        input.value = "";
                      }
                    }}
                  >
                    <AddIcon />
                  </IconButton>
                ),
              }}
            />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Description;
