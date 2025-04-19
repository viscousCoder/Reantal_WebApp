import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  TextField,
  Typography,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

// Interfaces
interface Policy {
  id: number;
  title: string;
  description: string;
}

export interface PropertyPoliciesFormValues {
  petPolicy: "allowed" | "restricted" | "none";
  petPolicyDescription?: string;
  smokingPolicy: "allowed" | "outside" | "none";
  smokingPolicyDescription?: string;
  noisePolicy: string;
  guestPolicy: string;
  additionalPolicies: Policy[];
}

export interface PropertyPoliciesErrors {
  petPolicy?: string;
  petPolicyDescription?: string;
  smokingPolicy?: string;
  smokingPolicyDescription?: string;
  noisePolicy?: string;
  guestPolicy?: string;
  additionalPolicies?: string;
}

interface PropertyPoliciesProps {
  initialValues: PropertyPoliciesFormValues;
  onUpdate: (values: PropertyPoliciesFormValues) => void;
  errors: Partial<PropertyPoliciesErrors>;
  setErrors: React.Dispatch<
    React.SetStateAction<Partial<PropertyPoliciesErrors>>
  >;
}

const PropertyPolicies: React.FC<PropertyPoliciesProps> = ({
  initialValues,
  onUpdate,
  errors,
  setErrors,
}) => {
  const [petPolicy, setPetPolicy] = useState(initialValues.petPolicy);
  const [smokingPolicy, setSmokingPolicy] = useState(
    initialValues.smokingPolicy
  );
  const [petPolicyDescription, setPetPolicyDescription] = useState(
    initialValues.petPolicyDescription || ""
  );
  const [smokingPolicyDescription, setSmokingPolicyDescription] = useState(
    initialValues.smokingPolicyDescription || ""
  );
  const [noisePolicy, setNoisePolicy] = useState(initialValues.noisePolicy);
  const [guestPolicy, setGuestPolicy] = useState(initialValues.guestPolicy);
  const [additionalPolicies, setAdditionalPolicies] = useState<Policy[]>(
    initialValues.additionalPolicies
  );

  useEffect(() => {
    onUpdate({
      petPolicy,
      petPolicyDescription,
      smokingPolicy,
      smokingPolicyDescription,
      noisePolicy,
      guestPolicy,
      additionalPolicies,
    });
  }, [
    petPolicy,
    petPolicyDescription,
    smokingPolicy,
    smokingPolicyDescription,
    noisePolicy,
    guestPolicy,
    additionalPolicies,
  ]);

  const handlePetPolicyChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value as "allowed" | "restricted" | "none";
    setPetPolicy(value);
  };

  const handleSmokingPolicyChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value as "allowed" | "outside" | "none";
    setSmokingPolicy(value);
  };

  const handlePolicyChange = (
    id: number,
    field: keyof Policy,
    value: string
  ) => {
    setAdditionalPolicies((prev) =>
      prev.map((policy) =>
        policy.id === id ? { ...policy, [field]: value } : policy
      )
    );
  };

  const handleAddPolicy = () => {
    const newId = additionalPolicies.length + 1;
    setAdditionalPolicies([
      ...additionalPolicies,
      { id: newId, title: `Policy ${newId}`, description: "" },
    ]);
  };

  const handleDeletePolicy = (id: number) => {
    setAdditionalPolicies((prev) => prev.filter((policy) => policy.id !== id));
  };

  return (
    <Box sx={{ p: 2, maxWidth: "800px", margin: "auto" }}>
      <Typography variant="h5" gutterBottom>
        Property Policies
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Set rules and policies for your property
      </Typography>

      <Grid container spacing={2} sx={{ mt: 2 }}>
        {/* Pet Policy */}
        <Grid size={{ xs: 12 }}>
          <Typography variant="h6" gutterBottom>
            Pet Policy
          </Typography>
          <FormControlLabel
            control={
              <Checkbox
                checked={petPolicy === "allowed"}
                onChange={handlePetPolicyChange}
                value="allowed"
                color="primary"
              />
            }
            label="Pets allowed"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={petPolicy === "restricted"}
                onChange={handlePetPolicyChange}
                value="restricted"
                color="primary"
              />
            }
            label="Pets allowed with restrictions"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={petPolicy === "none"}
                onChange={handlePetPolicyChange}
                value="none"
                color="primary"
              />
            }
            label="No pets allowed"
          />

          {(petPolicy === "allowed" || petPolicy === "restricted") && (
            <TextField
              label="Pet Policy Description"
              value={petPolicyDescription}
              onChange={(e) => setPetPolicyDescription(e.target.value)}
              onFocus={() =>
                setErrors((prev) => ({ ...prev, petPolicyDescription: "" }))
              }
              error={!!errors.petPolicyDescription}
              helperText={errors.petPolicyDescription}
              fullWidth
              multiline
              rows={3}
              variant="outlined"
              sx={{ mt: 1 }}
            />
          )}
        </Grid>

        {/* Smoking Policy */}
        <Grid size={{ xs: 12 }}>
          <Typography variant="h6" gutterBottom>
            Smoking Policy
          </Typography>
          <FormControlLabel
            control={
              <Checkbox
                checked={smokingPolicy === "allowed"}
                onChange={handleSmokingPolicyChange}
                value="allowed"
                color="primary"
              />
            }
            label="Smoking allowed"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={smokingPolicy === "outside"}
                onChange={handleSmokingPolicyChange}
                value="outside"
                color="primary"
              />
            }
            label="Smoking allowed outside only"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={smokingPolicy === "none"}
                onChange={handleSmokingPolicyChange}
                value="none"
                color="primary"
              />
            }
            label="No smoking allowed"
          />

          {(smokingPolicy === "allowed" || smokingPolicy === "outside") && (
            <TextField
              label="Smoking Policy Description"
              value={smokingPolicyDescription}
              onChange={(e) => setSmokingPolicyDescription(e.target.value)}
              onFocus={() =>
                setErrors((prev) => ({ ...prev, smokingPolicyDescription: "" }))
              }
              error={!!errors.smokingPolicyDescription}
              helperText={errors.smokingPolicyDescription}
              fullWidth
              multiline
              rows={3}
              variant="outlined"
              sx={{ mt: 1 }}
            />
          )}
        </Grid>

        {/* Noise Policy */}
        <Grid size={{ xs: 12 }}>
          <Typography variant="h6" gutterBottom>
            Noise Policy
          </Typography>
          <TextField
            value={noisePolicy}
            onChange={(e) => setNoisePolicy(e.target.value)}
            onFocus={() => setErrors((prev) => ({ ...prev, noisePolicy: "" }))}
            error={!!errors.noisePolicy}
            helperText={errors.noisePolicy}
            fullWidth
            multiline
            rows={3}
            variant="outlined"
          />
        </Grid>

        {/* Guest Policy */}
        <Grid size={{ xs: 12 }}>
          <Typography variant="h6" gutterBottom>
            Guest Policy
          </Typography>
          <TextField
            value={guestPolicy}
            onChange={(e) => setGuestPolicy(e.target.value)}
            onFocus={() => setErrors((prev) => ({ ...prev, guestPolicy: "" }))}
            error={!!errors.guestPolicy}
            helperText={errors.guestPolicy}
            fullWidth
            multiline
            rows={3}
            variant="outlined"
          />
        </Grid>

        {/* Additional Policies */}
        <Grid size={{ xs: 12 }}>
          <Typography variant="h6" gutterBottom>
            Additional Policies
          </Typography>

          {errors.additionalPolicies && (
            <Typography color="error" sx={{ mb: 1 }}>
              {errors.additionalPolicies}
            </Typography>
          )}

          {additionalPolicies.map((policy) => (
            <Box
              key={policy.id}
              sx={{ mb: 2, border: "1px solid #e0e0e0", p: 2, borderRadius: 1 }}
            >
              <Grid container spacing={2} alignItems="center">
                <Grid size={{ xs: 12, sm: 4 }}>
                  <TextField
                    label="Title"
                    value={policy.title}
                    onChange={(e) =>
                      handlePolicyChange(policy.id, "title", e.target.value)
                    }
                    fullWidth
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="Description"
                    value={policy.description}
                    onChange={(e) =>
                      handlePolicyChange(
                        policy.id,
                        "description",
                        e.target.value
                      )
                    }
                    fullWidth
                    multiline
                    rows={2}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 2 }}>
                  <IconButton
                    onClick={() => handleDeletePolicy(policy.id)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Grid>
              </Grid>
            </Box>
          ))}
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddPolicy}
            sx={{ mt: 2 }}
          >
            Add Policy
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PropertyPolicies;
