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
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store";
import { createProperty } from "../../store/ownerSlice";

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
  const dispatch = useDispatch<AppDispatch>();
  const [activeStep, setActiveStep] = useState(0);

  //   const [photos, setPhotos] = useState<UploadedPhoto[]>([]);

  //   const [form, setForm] = useState<PropertyFormValues>({
  //     address: "",
  //     propertyType: "",
  //     squareFootage: 0,
  //     bedrooms: 2,
  //     bathrooms: 1,
  //     rent: 0,
  //     noOfSet: 1,
  //     securityDeposit: 0,
  //     leaseTerm: "",
  //     availableDate: null,
  //     // utilities: [],
  //     isAvailable: true,
  //     photos: [],
  //     propertyTitle: "",
  //     detailedDescription: "",
  //     shortDescription: "",
  //     amenities: [],
  //     neighborhood: "",
  //     transportation: "",
  //     neighborhoodDescription: "",
  //     pointsOfInterest: [],
  //     neighborhoodLatitude: 28.6841736,
  //     neighborhoodLongitude: 77.3702128,
  //     petPolicy: "restricted",
  //     smokingPolicy: "none",
  //     noisePolicy: "",
  //     guestPolicy: "",
  //     additionalPolicies: [],
  //   });
  const [form, setForm] = useState<PropertyFormValues>(initialFormState);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
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

  // const handleNext = () => {
  //   if (activeStep === steps.length - 1) {
  //     console.log("Form Submitted:", form);
  //     dispatch(createProperty(form));
  //     setForm(initialFormState);

  //     setActiveStep(0);
  //   } else {
  //     setActiveStep((prev) => prev + 1);
  //   }
  // };

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      console.log("Form Submitted:", form);

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
      formData.append("availableDate", form.availableDate?.toISOString() || "");
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
      formData.append("neighborhoodDescription", form.neighborhoodDescription);
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
      dispatch(createProperty(formData));
      // setForm(initialFormState);
      // setActiveStep(0);
    } else {
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

  console.log(form, "Data is herer");

  return (
    <>
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
                  fullWidth
                  sx={{ textAlign: "center" }}
                  InputProps={{
                    inputProps: {
                      style: { textAlign: "center" },
                    },
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
                  type="number"
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <TextField
                  label="No. of Bathroom"
                  name="bathrooms"
                  value={form.bathrooms}
                  fullWidth
                  sx={{ textAlign: "center" }}
                  InputProps={{
                    inputProps: {
                      style: { textAlign: "center" },
                    },
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
                  type="number"
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <TextField
                  label="Monthly Rent"
                  name="rent"
                  value={form.rent}
                  onChange={handleChange}
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
                    onChange={(newValue) =>
                      setForm({ ...form, availableDate: newValue })
                    }
                    slotProps={{ textField: { fullWidth: true } }} // Replace renderInput with slotProps
                  />
                </LocalizationProvider>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  label="No. of set"
                  name="noOfSet"
                  value={form.noOfSet}
                  onChange={handleChange}
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

          {activeStep == 1 && (
            <PropertyPhotos
              photos={form.photos}
              setPhotos={(newPhotos) =>
                setForm((prev) => ({ ...prev, photos: newPhotos }))
              }
            />
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
                // onUpdate={handleNeighborhoodUpdate}
                onUpdate={handleNeighborhoodUpdate}
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
