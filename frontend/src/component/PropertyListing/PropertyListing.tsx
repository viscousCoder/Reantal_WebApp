import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  FormControlLabel,
  Grid,
  InputAdornment,
  MenuItem,
  Step,
  StepLabel,
  Stepper,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import PropertyPhotos from "./Photos";
import Description from "./Description";
import Neighborhood from "./Neighborhood";
import PropertyPolicies from "./PropertyPolicies";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { createProperty } from "../../store/ownerSlice";
import Loading from "../Loading/Loading";
import { useNavigate } from "react-router-dom";

interface UploadedPhoto {
  file: File;
  url: string;
  label: string;
}
export interface Policy {
  id: number;
  title: string;
  description: string;
}
interface PropertyFormValues {
  address: string;
  propertyType: string;
  squareFootage: number;
  bedrooms: number;
  bathrooms: number;
  rent: number;
  noOfSet: number;
  securityDeposit: number;
  leaseTerm: string;
  availableDate: Date | null;
  //   utilities: string[];
  isAvailable: boolean;
  photos: UploadedPhoto[];
  propertyTitle: string;
  detailedDescription: string;
  shortDescription: string;
  amenities: string[];
  //neighborhood
  neighborhood: string;
  transportation: string;
  neighborhoodDescription: string;
  pointsOfInterest: string[];
  neighborhoodLatitude: number;
  neighborhoodLongitude: number;

  //policies
  petPolicy: "allowed" | "restricted" | "none";
  petPolicyDescription?: string;
  smokingPolicy: "allowed" | "none" | "outside";
  smokingPolicyDescription?: string;
  noisePolicy: string;
  guestPolicy: string;
  additionalPolicies: Policy[];
}

interface FormErrors {
  address?: string;
  propertyType?: string;
  squareFootage?: string;
  bedrooms?: string;
  bathrooms?: string;
  rent?: string;
  noOfSet?: string;
  securityDeposit?: string;
  leaseTerm?: string;
  availableDate?: string;
  isAvailable?: string;
  propertyTitle?: string;
  detailedDescription?: string;
  shortDescription?: string;
  amenities?: string;
  neighborhood?: string;
  transportation?: string;
  neighborhoodDescription?: string;
  pointsOfInterest?: string;
  neighborhoodLatitude?: string;
  neighborhoodLongitude?: string;
  petPolicy?: string;
  petPolicyDescription?: string;
  smokingPolicy?: string;
  smokingPolicyDescription?: string;
  noisePolicy?: string;
  guestPolicy?: string;
  additionalPolicies?: string;
  photos?: string;
}

const leaseTerms = ["6 months", "12 months", "18 months"];
const propertyTypes = ["Apartment", "House", "Commercial Space"];

const steps = [
  "Property Details",
  "Photos & Media",
  "Description & Features",
  "Policies",
];

const initialFormState: PropertyFormValues = {
  address: "",
  propertyType: "",
  squareFootage: 0,
  bedrooms: 2,
  bathrooms: 1,
  rent: 0,
  noOfSet: 1,
  securityDeposit: 0,
  leaseTerm: "",
  availableDate: null,
  isAvailable: true,
  photos: [],
  propertyTitle: "",
  detailedDescription: "",
  shortDescription: "",
  amenities: [],
  neighborhood: "",
  transportation: "",
  neighborhoodDescription: "",
  pointsOfInterest: [],
  neighborhoodLatitude: 28.6841736,
  neighborhoodLongitude: 77.3702128,
  petPolicy: "restricted",
  petPolicyDescription: "",
  smokingPolicy: "none",
  smokingPolicyDescription: "",
  noisePolicy: "",
  guestPolicy: "",
  additionalPolicies: [],
};

const PropertyListing: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [activeStep, setActiveStep] = useState(0);

  const [form, setForm] = useState<PropertyFormValues>(initialFormState);
  const [errors, setErrors] = useState<FormErrors>({});

  const { loading } = useSelector((state: RootState) => state.owner);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    // Remove error when user starts editing
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleCounterChange = (
    field: "bedrooms" | "bathrooms",
    delta: number
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: Math.max(0, prev[field] + delta),
    }));
  };

  //step 0 validation
  const validateStep0 = (): boolean => {
    const newErrors: FormErrors = {};

    if (!form.address.trim()) newErrors.address = "Address is required";
    if (!form.propertyType)
      newErrors.propertyType = "Property type is required";
    if (form.squareFootage <= 0)
      newErrors.squareFootage = "Enter valid square footage";
    if (form.bedrooms < 0) newErrors.bedrooms = "Invalid bedroom count";
    if (form.bathrooms < 0) newErrors.bathrooms = "Invalid bathroom count";
    if (form.rent <= 0) newErrors.rent = "Monthly rent is required";
    if (form.securityDeposit <= 0)
      newErrors.securityDeposit = "Invalid security deposit";
    if (!form.leaseTerm) newErrors.leaseTerm = "Select a lease term";
    if (!form.availableDate) newErrors.availableDate = "Select a date";
    if (form.noOfSet <= 0) newErrors.noOfSet = "Invalid set number";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  //step 1 validation
  const validateStep1 = (): boolean => {
    const newErrors: FormErrors = {};

    if (!form.photos || form.photos.length === 0) {
      newErrors.photos = "At least one photo is required";
    }

    setErrors((prev) => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  //setp 2 validation
  const validateStep2 = () => {
    const newErrors: FormErrors = {};

    // Description validation
    if (!form.propertyTitle) {
      newErrors.propertyTitle = "Property title is required.";
    }
    if (!form.detailedDescription || form.detailedDescription.length < 200) {
      newErrors.detailedDescription =
        "Detailed description must be at least 200 characters.";
    }
    if (!form.shortDescription) {
      newErrors.shortDescription = "Short description is required.";
    }

    // Neighborhood validation
    if (!form.neighborhood) {
      newErrors.neighborhood = "Neighborhood is required.";
    }
    if (!form.transportation) {
      newErrors.transportation = "Transportation details are required.";
    }
    if (!form.neighborhoodDescription) {
      newErrors.neighborhoodDescription =
        "Neighborhood description is required.";
    }
    if (form.pointsOfInterest.length === 0) {
      newErrors.pointsOfInterest = "Points of interest are required.";
    }
    if (form.amenities.length === 0) {
      newErrors.amenities = "At least one amenity must be selected.";
    }

    // If there are errors, set them and return false
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return false;
    }

    // If no errors, return true
    return true;
  };

  const validateStep3 = () => {
    const step3Errors: FormErrors = {};

    if (!form.noisePolicy?.trim()) {
      step3Errors.noisePolicy = "Noise policy is required";
    }
    if (!form.guestPolicy?.trim()) {
      step3Errors.guestPolicy = "Guest policy is required";
    }
    if (
      (form.petPolicy === "allowed" || form.petPolicy === "restricted") &&
      !form.petPolicyDescription?.trim()
    ) {
      step3Errors.petPolicyDescription = "Description required for pet policy";
    }
    if (
      (form.smokingPolicy === "allowed" || form.smokingPolicy === "outside") &&
      !form.smokingPolicyDescription?.trim()
    ) {
      step3Errors.smokingPolicyDescription =
        "Description required for smoking policy";
    }

    if (Object.keys(step3Errors).length > 0) {
      setErrors(step3Errors);
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      if (!validateStep3()) return;
      else {
        const formData = new FormData();

        // Simple fields
        formData.append("address", form.address);
        formData.append("propertyType", form.propertyType);
        formData.append("squareFootage", form.squareFootage.toString());
        formData.append("bedrooms", form.bedrooms.toString());
        formData.append("bathrooms", form.bathrooms.toString());
        formData.append("rent", form.rent.toString());
        formData.append("noOfSet", form.noOfSet.toString());
        formData.append("securityDeposit", form.securityDeposit.toString());
        formData.append("leaseTerm", form.leaseTerm);
        formData.append(
          "availableDate",
          form.availableDate?.toISOString() || ""
        );
        formData.append("isAvailable", form.isAvailable.toString());
        formData.append("propertyTitle", form.propertyTitle);
        formData.append("detailedDescription", form.detailedDescription);
        formData.append("shortDescription", form.shortDescription);

        // Arrays
        form.amenities.forEach((a) => formData.append("amenities", a));
        form.pointsOfInterest.forEach((p) =>
          formData.append("pointsOfInterest", p)
        );

        // Neighborhood
        formData.append("neighborhood", form.neighborhood);
        formData.append("transportation", form.transportation);
        formData.append(
          "neighborhoodDescription",
          form.neighborhoodDescription
        );
        formData.append(
          "neighborhoodLatitude",
          form.neighborhoodLatitude.toString()
        );
        formData.append(
          "neighborhoodLongitude",
          form.neighborhoodLongitude.toString()
        );

        // Policies
        formData.append("petPolicy", form.petPolicy);
        if (form.petPolicyDescription) {
          formData.append("petPolicyDescription", form.petPolicyDescription);
        }
        formData.append("smokingPolicy", form.smokingPolicy);
        if (form.smokingPolicyDescription) {
          formData.append(
            "smokingPolicyDescription",
            form.smokingPolicyDescription
          );
        }
        formData.append("noisePolicy", form.noisePolicy);
        formData.append("guestPolicy", form.guestPolicy);

        // Additional policies
        form.additionalPolicies.forEach((policy, index) => {
          formData.append(`additionalPolicies[${index}][title]`, policy.title);
          formData.append(
            `additionalPolicies[${index}][description]`,
            policy.description
          );
        });

        // Photos (binary files)
        form.photos.forEach((photo) => {
          if (photo.file) {
            formData.append("photos", photo.file); // backend uses upload.array("photos")
          }
        });

        // Submit
        dispatch(createProperty({ formData, navigate }));
        // setForm(initialFormState);
        // setActiveStep(0);
      }
    } else {
      // setActiveStep((prev) => prev + 1);

      if (activeStep === 0) {
        if (!validateStep0()) return;
      }

      if (activeStep === 1) {
        if (!validateStep1()) return;
      }
      if (activeStep === 2) {
        if (!validateStep2()) return;
      }

      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep((prev) => prev - 1);
    }
  };

  const handleDescriptionUpdate = (values: {
    propertyTitle: string;
    detailedDescription: string;
    shortDescription: string;
    amenities: string[];
  }) => {
    setForm((prev) => ({
      ...prev,
      propertyTitle: values.propertyTitle,
      detailedDescription: values.detailedDescription,
      shortDescription: values.shortDescription,
      amenities: values.amenities,
    }));
  };

  const handleNeighborhoodUpdate = (updatedData: {
    neighborhood: string;
    transportation: string;
    neighborhoodDescription: string;
    pointsOfInterest: string[];
    location: [number, number];
  }) => {
    setForm((prevForm) => ({
      ...prevForm,
      ...updatedData,
    }));
  };

  const handleFieldFocus = (fieldName: string) => {
    setErrors((prev) => ({ ...prev, [fieldName]: undefined }));
  };

  return (
    <>
      {loading && <Loading />}
      <Container>
        <Box p={4}>
          <Typography variant="h5" gutterBottom>
            Add New Property Listing
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            Basic information about your property
          </Typography>
          <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {activeStep === 0 && (
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <TextField
                  label="Property Address"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  error={!!errors.address}
                  helperText={errors.address}
                  fullWidth
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <TextField
                  select
                  label="Property Type"
                  name="propertyType"
                  value={form.propertyType}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  error={!!errors.propertyType}
                  helperText={errors.propertyType}
                  fullWidth
                >
                  {propertyTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid size={{ xs: 6 }}>
                <TextField
                  label="Square Footage"
                  name="squareFootage"
                  value={form.squareFootage}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  error={!!errors.squareFootage}
                  helperText={errors.squareFootage}
                  fullWidth
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">sq ft</InputAdornment>
                    ),
                  }}
                  type="number"
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <TextField
                  label="No. Of Bedroom"
                  name="bedrooms"
                  value={form.bedrooms}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  error={!!errors.bedrooms}
                  helperText={errors.bedrooms}
                  fullWidth
                  type="number"
                  InputProps={{
                    inputProps: { style: { textAlign: "center" } },
                    endAdornment: (
                      <Button
                        onClick={() => handleCounterChange("bedrooms", 1)}
                      >
                        <AddIcon sx={{ color: "#666666" }} />
                      </Button>
                    ),
                    startAdornment: (
                      <Button
                        onClick={() => handleCounterChange("bedrooms", -1)}
                      >
                        <RemoveIcon sx={{ color: "#666666" }} />
                      </Button>
                    ),
                  }}
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <TextField
                  label="No. of Bathroom"
                  name="bathrooms"
                  value={form.bathrooms}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  error={!!errors.bathrooms}
                  helperText={errors.bathrooms}
                  fullWidth
                  type="number"
                  InputProps={{
                    inputProps: { style: { textAlign: "center" } },
                    endAdornment: (
                      <Button
                        onClick={() => handleCounterChange("bathrooms", 1)}
                      >
                        <AddIcon sx={{ color: "#666666" }} />
                      </Button>
                    ),
                    startAdornment: (
                      <Button
                        onClick={() => handleCounterChange("bathrooms", -1)}
                      >
                        <RemoveIcon sx={{ color: "#666666" }} />
                      </Button>
                    ),
                  }}
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <TextField
                  label="Monthly Rent"
                  name="rent"
                  value={form.rent}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  error={!!errors.rent}
                  helperText={errors.rent}
                  fullWidth
                  type="number"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CurrencyRupeeIcon fontSize="inherit" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <TextField
                  label="Security Deposit"
                  name="securityDeposit"
                  value={form.securityDeposit}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  error={!!errors.securityDeposit}
                  helperText={errors.securityDeposit}
                  fullWidth
                  type="number"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CurrencyRupeeIcon fontSize="inherit" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <TextField
                  select
                  label="Lease Term"
                  name="leaseTerm"
                  value={form.leaseTerm}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  error={!!errors.leaseTerm}
                  helperText={errors.leaseTerm}
                  fullWidth
                >
                  {leaseTerms.map((term) => (
                    <MenuItem key={term} value={term}>
                      {term}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid size={{ xs: 6 }}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Date Available"
                    value={form.availableDate}
                    minDate={new Date()}
                    onChange={(newValue) =>
                      setForm({ ...form, availableDate: newValue })
                    }
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!errors.availableDate,
                        helperText: errors.availableDate,
                        onFocus: handleFocus,
                      },
                    }}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  label="No. of set"
                  name="noOfSet"
                  value={form.noOfSet}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  error={!!errors.noOfSet}
                  helperText={errors.noOfSet}
                  fullWidth
                  type="number"
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={form.isAvailable}
                      onChange={(e) =>
                        setForm({ ...form, isAvailable: e.target.checked })
                      }
                    />
                  }
                  label="Property Available"
                />
              </Grid>
            </Grid>
          )}

          {activeStep === 1 && (
            <>
              <PropertyPhotos
                photos={form.photos}
                setPhotos={(newPhotos) => {
                  setForm((prev) => ({ ...prev, photos: newPhotos }));
                  setErrors((prev) => ({ ...prev, photos: undefined }));
                }}
                error={errors.photos}
              />
              {errors.photos && (
                <Typography
                  variant="body2"
                  color="error"
                  sx={{ mt: 1, ml: 2, fontWeight: 500 }}
                >
                  {errors.photos}
                </Typography>
              )}
            </>
          )}

          {activeStep == 2 && (
            <>
              <Description
                initialValues={{
                  propertyTitle: form.propertyTitle,
                  detailedDescription: form.detailedDescription,
                  shortDescription: form.shortDescription,
                  amenities: form.amenities,
                }}
                onUpdate={handleDescriptionUpdate}
                errors={{
                  propertyTitle: errors.propertyTitle,
                  detailedDescription: errors.detailedDescription,
                  shortDescription: errors.shortDescription,
                  amenities: errors.amenities,
                }}
                onFieldFocus={handleFieldFocus}
              />

              <Neighborhood
                initialValues={{
                  neighborhood: form.neighborhood,
                  transportation: form.transportation,
                  description: form.neighborhoodDescription,
                  points: form.pointsOfInterest,
                  location: [
                    form.neighborhoodLatitude,
                    form.neighborhoodLongitude,
                  ],
                }}
                onUpdate={handleNeighborhoodUpdate}
                errors={{
                  neighborhood: errors.neighborhood,
                  transportation: errors.transportation,
                  neighborhoodDescription: errors.neighborhoodDescription,
                  pointsOfInterest: errors.pointsOfInterest,
                  // mapLocation: errors.mapLocation,
                }}
                onFieldFocus={handleFieldFocus}
              />
            </>
          )}

          {activeStep === 3 && (
            <PropertyPolicies
              initialValues={{
                petPolicy: form.petPolicy,
                petPolicyDescription: form.petPolicyDescription,
                smokingPolicy: form.smokingPolicy,
                smokingPolicyDescription: form.smokingPolicyDescription,
                noisePolicy: form.noisePolicy,
                guestPolicy: form.guestPolicy,
                additionalPolicies: form.additionalPolicies,
              }}
              errors={errors}
              setErrors={setErrors}
              onUpdate={(values) =>
                setForm((prev) => ({
                  ...prev,
                  ...values,
                }))
              }
            />
          )}

          <Box mt={3} display="flex" justifyContent="space-between">
            <Button
              variant="outlined"
              onClick={handleBack}
              disabled={activeStep === 0}
            >
              Back to Properties
            </Button>
            <Button variant="contained" color="primary" onClick={handleNext}>
              {activeStep === steps.length - 1 ? "Finish" : "Next"}
            </Button>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default PropertyListing;
