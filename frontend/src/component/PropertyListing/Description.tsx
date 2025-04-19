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

interface DescriptionFormErrors {
  propertyTitle?: string;
  detailedDescription?: string;
  shortDescription?: string;
  amenities?: string;
}

interface DescriptionProps {
  initialValues: DescriptionFormValues;
  onUpdate: (values: DescriptionFormValues) => void;
  errors?: DescriptionFormErrors;
  onFieldFocus?: (fieldName: keyof DescriptionFormValues) => void;
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
  errors,
  onFieldFocus,
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

  const handleFocus = (field: keyof DescriptionFormValues) => {
    onFieldFocus?.(field);
  };

  const handleAmenityToggle = (amenity: string) => {
    onFieldFocus?.("amenities");

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
          onFocus={() => handleFocus("propertyTitle")}
          fullWidth
          helperText={
            errors?.propertyTitle ??
            "Create a catchy title that highlights key features (70 characters max)"
          }
          error={Boolean(errors?.propertyTitle)}
          inputProps={{ maxLength: 70 }}
          sx={{ mb: 2 }}
        />

        <TextField
          label="Detailed Description"
          name="detailedDescription"
          value={form.detailedDescription}
          onChange={handleChange}
          onFocus={() => handleFocus("detailedDescription")}
          fullWidth
          multiline
          rows={4}
          sx={{ mb: 2 }}
          helperText={
            errors?.detailedDescription ??
            `${form.detailedDescription.length} characters (min. 200)`
          }
          error={Boolean(errors?.detailedDescription)}
          inputProps={{ maxLength: 2000 }}
        />

        <TextField
          label="Short Description"
          name="shortDescription"
          value={form.shortDescription}
          onChange={handleChange}
          onFocus={() => handleFocus("shortDescription")}
          fullWidth
          helperText={
            errors?.shortDescription ??
            "This will appear in search results (150 characters max)"
          }
          error={Boolean(errors?.shortDescription)}
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
        {errors?.amenities && (
          <Typography variant="body2" color="error" sx={{ mb: 2 }}>
            {errors.amenities}
          </Typography>
        )}

        {Object.entries(amenitiesOptions).map(([section, amenities]) => (
          <Box key={section} sx={{ mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              {section.charAt(0).toUpperCase() + section.slice(1)} Amenities
            </Typography>
            <Grid container spacing={1}>
              {amenities.map((amenity) => (
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
          </Box>
        ))}

        {/* Additional amenities */}
        {form.amenities
          .filter((a) => !Object.values(amenitiesOptions).flat().includes(a))
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

        {/* Input to add custom amenity */}
        <Grid size={{ xs: 4 }}>
          <TextField
            label="Add amenity..."
            variant="outlined"
            size="small"
            onFocus={() => handleFocus("amenities")}
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
      </Box>
    </Box>
  );
};

export default Description;
