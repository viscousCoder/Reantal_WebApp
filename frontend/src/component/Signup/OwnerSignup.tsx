import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControl,
  FormControlLabel,
  FormLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

// Interfaces for TypeScript
interface FormData {
  fullName: string;
  email: string;
  phoneCode: string;
  phoneNumber: string;
  companyName: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
  verificationMethod: "email" | "phone";
  emailOtp: string;
  phoneOtp: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  generatedEmailOtp: string;
  generatedPhoneOtp: string;
  otpError: string;
  verifiedEmailOtp: string;
  verifiedPhoneOtp: string;
  errors: Record<string, string>; // Dynamic error messages
}

const OwnerSignup: React.FC = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phoneCode: "+91",
    phoneNumber: "",
    companyName: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
    verificationMethod: "email",
    emailOtp: "",
    phoneOtp: "",
    emailVerified: false,
    phoneVerified: false,
    generatedEmailOtp: "",
    generatedPhoneOtp: "",
    otpError: "",
    verifiedEmailOtp: "",
    verifiedPhoneOtp: "",
    errors: {},
  });

  const steps = [
    "Basic Information",
    "Set Up Login Credentials",
    "Agree to Terms",
    "Verification",
    "Complete Profile",
  ];

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Validation Functions
  const validateFullName = (name: string): string | null => {
    const nameRegex = /^(\w+\s+\w+.*)$/;
    return nameRegex.test(name)
      ? null
      : "Full name must contain at least two words";
  };

  const validateEmail = (email: string): string | null => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) ? null : "Enter a valid email address";
  };

  const validatePhoneNumber = (phone: string): string | null => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone) ? null : "Phone number must be 10 digits";
  };

  const validatePassword = (password: string): string | null => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    return passwordRegex.test(password)
      ? null
      : "Password must be at least 8 characters with uppercase, lowercase, numbers, and special characters (!@#$%^&*)";
  };

  const validateConfirmPassword = (
    password: string,
    confirmPassword: string
  ): string | null => {
    return password === confirmPassword && confirmPassword !== ""
      ? null
      : "Passwords do not match";
  };

  const validateZip = (zip: string): string | null => {
    const zipRegex = /^\d{6}$/;
    return zipRegex.test(zip) ? null : "Zip code must be 6 digits";
  };

  // Handle Input Change with Validation
  const handleChange =
    (field: keyof FormData) =>
    (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | any
    ) => {
      const value =
        field === "agreeToTerms" ? event.target.checked : event.target.value;
      let errors = { ...formData.errors };

      switch (field) {
        case "fullName":
          errors[field] = validateFullName(value) || "";
          break;
        case "email":
          errors[field] = validateEmail(value) || "";
          break;
        case "phoneNumber":
          errors[field] = validatePhoneNumber(value) || "";
          break;
        case "password":
          errors[field] = validatePassword(value) || "";
          if (formData.confirmPassword) {
            errors["confirmPassword"] =
              validateConfirmPassword(value, formData.confirmPassword) || "";
          }
          break;
        case "confirmPassword":
          errors[field] =
            validateConfirmPassword(formData.password, value) || "";
          break;
        case "zip":
          errors[field] = validateZip(value) || "";
          break;
        case "verificationMethod":
          errors[field] = "";
          break;
        default:
          delete errors[field];
      }

      setFormData({ ...formData, [field]: value, errors });
    };

  // Handle Focus to Clear Errors
  const handleFocus = (field: keyof FormData) => () => {
    setFormData((prev) => ({
      ...prev,
      errors: { ...prev.errors, [field]: "" },
    }));
  };

  // Check if all required fields are valid for the current step
  const isStepValid = () => {
    const errors = { ...formData.errors };
    switch (activeStep) {
      case 0:
        errors.fullName = validateFullName(formData.fullName) || "";
        errors.email = validateEmail(formData.email) || "";
        errors.phoneNumber = validatePhoneNumber(formData.phoneNumber) || "";
        errors.street = formData.street ? "" : "Street is required";
        errors.city = formData.city ? "" : "City is required";
        errors.state = formData.state ? "" : "State is required";
        errors.zip =
          validateZip(formData.zip) || (formData.zip ? "" : "Zip is required");
        errors.country = formData.country ? "" : "Country is required";
        return Object.values(errors).every((error) => !error);
      case 1:
        errors.password = validatePassword(formData.password) || "";
        errors.confirmPassword =
          validateConfirmPassword(
            formData.password,
            formData.confirmPassword
          ) || "";
        return Object.values(errors).every((error) => !error);
      case 2:
        errors.agreeToTerms = !formData.agreeToTerms
          ? "Must agree to terms"
          : "";
        return formData.agreeToTerms;
      case 3:
        if (!formData.emailVerified || !formData.phoneVerified) {
          errors.verificationMethod = "Both email and phone must be verified";
        } else {
          delete errors.verificationMethod;
        }
        return formData.emailVerified && formData.phoneVerified;
      case 4:
        return true; // Profile completion is optional
      default:
        return true;
    }
  };

  const handleNext = () => {
    let errors = { ...formData.errors };
    if (activeStep === 0) {
      errors.fullName = validateFullName(formData.fullName) || "";
      errors.email = validateEmail(formData.email) || "";
      errors.phoneNumber = validatePhoneNumber(formData.phoneNumber) || "";
      errors.street = formData.street ? "" : "Street is required";
      errors.city = formData.city ? "" : "City is required";
      errors.state = formData.state ? "" : "State is required";
      errors.zip =
        validateZip(formData.zip) || (formData.zip ? "" : "Zip is required");
      errors.country = formData.country ? "" : "Country is required";
    } else if (activeStep === 1) {
      errors.password = validatePassword(formData.password) || "";
      errors.confirmPassword =
        validateConfirmPassword(formData.password, formData.confirmPassword) ||
        "";
    } else if (activeStep === 2) {
      errors.agreeToTerms = !formData.agreeToTerms ? "Must agree to terms" : "";
    } else if (activeStep === 3) {
      if (!formData.emailVerified || !formData.phoneVerified) {
        errors.verificationMethod = "Both email and phone must be verified";
      } else {
        delete errors.verificationMethod;
      }
    }

    setFormData((prev) => ({ ...prev, errors }));
    if (Object.values(errors).every((error) => !error)) {
      if (activeStep === steps.length - 1) {
        console.log("Form Submitted:", formData);
        setFormData({
          fullName: "",
          email: "",
          phoneCode: "+91",
          phoneNumber: "",
          companyName: "",
          street: "",
          city: "",
          state: "",
          zip: "",
          country: "",
          password: "",
          confirmPassword: "",
          agreeToTerms: false,
          verificationMethod: "email",
          emailOtp: "",
          phoneOtp: "",
          emailVerified: false,
          phoneVerified: false,
          generatedEmailOtp: "",
          generatedPhoneOtp: "",
          otpError: "",
          verifiedEmailOtp: "",
          verifiedPhoneOtp: "",
          errors: {},
        });
        navigate("/");
      } else {
        setActiveStep((prevStep) => prevStep + 1);
      }
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
    setFormData((prev) => ({
      ...prev,
      errors: { ...prev.errors, [steps[activeStep]]: "Re-validate this step" },
    }));
  };

  const generateOtp = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const handleSendOtp = () => {
    if (formData.verificationMethod === "email" && formData.email) {
      const otp = generateOtp();
      console.log("Generated Email OTP:", otp);
      setFormData((prev) => ({ ...prev, generatedEmailOtp: otp }));
    } else if (
      formData.verificationMethod === "phone" &&
      formData.phoneNumber
    ) {
      const otp = generateOtp();
      console.log("Generated Phone OTP:", otp);
      setFormData((prev) => ({ ...prev, generatedPhoneOtp: otp }));
    }
  };

  const handleVerify = () => {
    if (formData.verificationMethod === "email") {
      if (formData.emailOtp === formData.generatedEmailOtp) {
        setFormData((prev) => ({
          ...prev,
          emailVerified: true,
          verificationMethod: "phone",
          otpError: "Verified email",
          verifiedEmailOtp: formData.emailOtp,
          errors: { ...prev.errors, verificationMethod: "" },
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          otpError: "OTP not matched",
        }));
      }
    } else if (formData.verificationMethod === "phone") {
      if (formData.phoneOtp === formData.generatedPhoneOtp) {
        setFormData((prev) => ({
          ...prev,
          phoneVerified: true,
          otpError: "Verified phone",
          verifiedPhoneOtp: formData.phoneOtp,
          errors: { ...prev.errors, verificationMethod: "" },
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          otpError: "OTP not matched",
        }));
      }
    }
  };

  useEffect(() => {
    if (formData.emailVerified && formData.phoneVerified) {
      handleNext();
    }
  }, [formData.emailVerified, formData.phoneVerified]);

  return (
    <Container
      maxWidth="sm"
      sx={{
        padding: isMobile ? "10px" : "20px",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          my: 4,
          width: "100%",
          maxWidth: "500px",
          margin: "0 auto",
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          align="center"
          sx={{ fontSize: isMobile ? "1.5rem" : "2rem" }}
        >
          Create Your Landlord Account
        </Typography>
        <Typography
          variant="body1"
          gutterBottom
          align="center"
          sx={{ fontSize: isMobile ? "0.9rem" : "1rem" }}
        >
          Please fill in your information to get started
        </Typography>
        <Stepper activeStep={activeStep} alternativeLabel sx={{ my: 2 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {activeStep === 0 && (
          <Box mt={3} sx={{ width: "100%" }}>
            <TextField
              fullWidth
              label="Full Name (First and Last)"
              margin="normal"
              value={formData.fullName}
              onChange={handleChange("fullName")}
              onFocus={handleFocus("fullName")}
              error={!!formData.errors.fullName}
              helperText={formData.errors.fullName}
              variant="outlined"
            />
            <TextField
              fullWidth
              label="Email Address"
              margin="normal"
              type="email"
              value={formData.email}
              onChange={handleChange("email")}
              onFocus={handleFocus("email")}
              error={!!formData.errors.email}
              helperText={formData.errors.email}
              variant="outlined"
            />
            <Box
              display="flex"
              gap={2}
              sx={{ flexDirection: isMobile ? "column" : "row" }}
            >
              <TextField
                select
                label="Code"
                value={formData.phoneCode}
                onChange={handleChange("phoneCode")}
                margin="normal"
                sx={{ width: isMobile ? "100%" : "30%" }}
                variant="outlined"
              >
                <MenuItem value="+91">+91</MenuItem>
                <MenuItem value="+912">+912</MenuItem>
                <MenuItem value="+44">+44</MenuItem>
              </TextField>
              <TextField
                fullWidth
                label="Phone Number"
                margin="normal"
                type="tel"
                value={formData.phoneNumber}
                onChange={handleChange("phoneNumber")}
                onFocus={handleFocus("phoneNumber")}
                error={!!formData.errors.phoneNumber}
                helperText={formData.errors.phoneNumber}
                variant="outlined"
              />
            </Box>
            <TextField
              fullWidth
              label="Company Name (if applicable)"
              margin="normal"
              value={formData.companyName}
              onChange={handleChange("companyName")}
              variant="outlined"
            />
            <TextField
              fullWidth
              label="Street Address"
              margin="normal"
              value={formData.street}
              onChange={handleChange("street")}
              onFocus={handleFocus("street")}
              error={!!formData.errors.street}
              helperText={formData.errors.street}
              variant="outlined"
            />
            <TextField
              fullWidth
              label="City"
              margin="normal"
              value={formData.city}
              onChange={handleChange("city")}
              onFocus={handleFocus("city")}
              error={!!formData.errors.city}
              helperText={formData.errors.city}
              variant="outlined"
            />
            <TextField
              fullWidth
              label="State/Province"
              margin="normal"
              value={formData.state}
              onChange={handleChange("state")}
              onFocus={handleFocus("state")}
              error={!!formData.errors.state}
              helperText={formData.errors.state}
              variant="outlined"
            />
            <TextField
              fullWidth
              label="Zip/Postal Code"
              margin="normal"
              value={formData.zip}
              onChange={handleChange("zip")}
              onFocus={handleFocus("zip")}
              error={!!formData.errors.zip}
              helperText={formData.errors.zip}
              variant="outlined"
            />
            <TextField
              fullWidth
              label="Country"
              margin="normal"
              value={formData.country}
              onChange={handleChange("country")}
              onFocus={handleFocus("country")}
              error={!!formData.errors.country}
              helperText={formData.errors.country}
              variant="outlined"
            />
          </Box>
        )}

        {activeStep === 1 && (
          <Box mt={3} sx={{ width: "100%" }}>
            <TextField
              fullWidth
              label="Password"
              type="password"
              margin="normal"
              value={formData.password}
              onChange={handleChange("password")}
              onFocus={handleFocus("password")}
              error={!!formData.errors.password}
              helperText={formData.errors.password}
              variant="outlined"
            />
            <TextField
              fullWidth
              label="Confirm Password"
              type="password"
              margin="normal"
              value={formData.confirmPassword}
              onChange={handleChange("confirmPassword")}
              onFocus={handleFocus("confirmPassword")}
              error={!!formData.errors.confirmPassword}
              helperText={formData.errors.confirmPassword}
              variant="outlined"
            />
          </Box>
        )}

        {activeStep === 2 && (
          <Box mt={3} sx={{ width: "100%" }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.agreeToTerms}
                  onChange={handleChange("agreeToTerms")}
                />
              }
              label={
                <Typography variant="body2">
                  I agree to the{" "}
                  <a href="#" style={{ textDecoration: "underline" }}>
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" style={{ textDecoration: "underline" }}>
                    Privacy Policy
                  </a>
                </Typography>
              }
            />
            {formData.errors.agreeToTerms && (
              <Typography color="error" variant="caption">
                {formData.errors.agreeToTerms}
              </Typography>
            )}
          </Box>
        )}

        {activeStep === 3 && (
          <Box mt={3} sx={{ width: "100%" }}>
            <FormControl component="fieldset" margin="normal">
              <FormLabel component="legend">Verification Method</FormLabel>
              <RadioGroup
                row
                value={formData.verificationMethod}
                onChange={handleChange("verificationMethod")}
              >
                <FormControlLabel
                  value="email"
                  control={<Radio />}
                  label="Email"
                  disabled={formData.emailVerified}
                />
                <FormControlLabel
                  value="phone"
                  control={<Radio />}
                  label="Phone"
                  disabled={!formData.emailVerified || formData.phoneVerified}
                />
              </RadioGroup>
            </FormControl>
            {formData.verificationMethod === "email" && (
              <TextField
                fullWidth
                label="Email Address"
                margin="normal"
                type="email"
                value={formData.email}
                disabled
              />
            )}
            {formData.verificationMethod === "phone" && (
              <TextField
                fullWidth
                label="Phone Number"
                margin="normal"
                type="tel"
                value={`${formData.phoneCode} ${formData.phoneNumber}`}
                disabled
              />
            )}
            {formData.verificationMethod === "email" && (
              <TextField
                fullWidth
                label="Enter Email OTP"
                margin="normal"
                value={formData.emailOtp}
                onChange={handleChange("emailOtp")}
                error={formData.otpError === "OTP not matched"}
                helperText={
                  formData.otpError || "Enter the OTP sent to your email"
                }
                InputProps={{
                  style: {
                    color:
                      formData.otpError === "OTP not matched"
                        ? "red"
                        : "inherit",
                  },
                }}
              />
            )}
            {formData.verificationMethod === "phone" && (
              <TextField
                fullWidth
                label="Enter Phone OTP"
                margin="normal"
                value={formData.phoneOtp}
                onChange={handleChange("phoneOtp")}
                error={formData.otpError === "OTP not matched"}
                helperText={
                  formData.otpError || "Enter the OTP sent to your phone"
                }
                InputProps={{
                  style: {
                    color:
                      formData.otpError === "OTP not matched"
                        ? "red"
                        : "inherit",
                  },
                }}
              />
            )}
            <Box display="flex" gap={2} mt={2}>
              <Button variant="outlined" onClick={handleSendOtp}>
                Send OTP
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleVerify}
                disabled={
                  (formData.verificationMethod === "email" &&
                    !formData.emailOtp) ||
                  (formData.verificationMethod === "phone" &&
                    !formData.phoneOtp) ||
                  !!formData.errors.verificationMethod
                }
              >
                Verify
              </Button>
            </Box>
            {formData.errors.verificationMethod && (
              <Typography color="error" variant="caption" sx={{ mt: 1 }}>
                {formData.errors.verificationMethod}
              </Typography>
            )}
          </Box>
        )}

        {activeStep === 4 && (
          <Box mt={3} sx={{ width: "100%" }}>
            <Typography variant="h6" gutterBottom>
              Profile Completion (Optional)
            </Typography>
            <TextField
              fullWidth
              label="Company Name (if applicable)"
              margin="normal"
              value={formData.companyName}
              onChange={handleChange("companyName")}
              variant="outlined"
            />
          </Box>
        )}

        <Box
          mt={4}
          display="flex"
          justifyContent="space-between"
          sx={{
            flexDirection: isMobile ? "column" : "row",
            gap: isMobile ? 2 : 0,
          }}
        >
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            variant="outlined"
            sx={{ mb: isMobile ? 2 : 0, width: isMobile ? "100%" : "auto" }}
          >
            Back
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleNext}
            disabled={!isStepValid()}
            sx={{ width: isMobile ? "100%" : "auto" }}
          >
            {activeStep === steps.length - 1 ? "Submit" : "Save & Continue"}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default OwnerSignup;

//Second attemp
// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   Avatar,
//   Box,
//   Button,
//   Checkbox,
//   Container,
//   FormControl,
//   FormControlLabel,
//   FormLabel,
//   MenuItem,
//   Step,
//   StepLabel,
//   Stepper,
//   TextField,
//   Typography,
//   useMediaQuery,
//   useTheme,
// } from "@mui/material";

// // Interfaces for TypeScript
// interface FormData {
//   fullName: string;
//   email: string;
//   phoneCode: string;
//   phoneNumber: string;
//   companyName: string;
//   street: string;
//   city: string;
//   state: string;
//   zip: string;
//   country: string;
//   password: string;
//   confirmPassword: string;
//   agreeToTerms: boolean;
//   emailVerified: boolean;
//   emailOtp: string;
//   generatedEmailOtp: string;
//   otpError: string;
//   verifiedEmailOtp: string;
//   errors: Record<string, string>; // Dynamic error messages
// }

// const OwnerSignup: React.FC = () => {
//   const navigate = useNavigate();
//   const [activeStep, setActiveStep] = useState(0);
//   const [formData, setFormData] = useState<FormData>({
//     fullName: "",
//     email: "",
//     phoneCode: "+91",
//     phoneNumber: "",
//     companyName: "",
//     street: "",
//     city: "",
//     state: "",
//     zip: "",
//     country: "",
//     password: "",
//     confirmPassword: "",
//     agreeToTerms: false,
//     emailVerified: false,
//     emailOtp: "",
//     generatedEmailOtp: "",
//     otpError: "",
//     verifiedEmailOtp: "",
//     errors: {},
//   });

//   const steps = [
//     "Basic Information",
//     "Set Up Login Credentials",
//     "Agree to Terms",
//     "Email Verification",
//     "Complete Profile",
//   ];

//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

//   // Validation Functions
//   const validateFullName = (name: string): string | null => {
//     const nameRegex = /^(\w+\s+\w+.*)$/;
//     return nameRegex.test(name)
//       ? null
//       : "Full name must contain at least two words";
//   };

//   const validateEmail = (email: string): string | null => {
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return emailRegex.test(email) ? null : "Enter a valid email address";
//   };

//   const validatePhoneNumber = (phone: string): string | null => {
//     const phoneRegex = /^\d{10}$/;
//     return phoneRegex.test(phone) ? null : "Phone number must be 10 digits";
//   };

//   const validatePassword = (password: string): string | null => {
//     const passwordRegex =
//       /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
//     return passwordRegex.test(password)
//       ? null
//       : "Password must be at least 8 characters with uppercase, lowercase, numbers, and special characters (!@#$%^&*)";
//   };

//   const validateConfirmPassword = (
//     password: string,
//     confirmPassword: string
//   ): string | null => {
//     return password === confirmPassword && confirmPassword !== ""
//       ? null
//       : "Passwords do not match";
//   };

//   const validateZip = (zip: string): string | null => {
//     const zipRegex = /^\d{6}$/;
//     return zipRegex.test(zip) ? null : "Zip code must be 6 digits";
//   };

//   // Handle Input Change with Validation
//   const handleChange =
//     (field: keyof FormData) =>
//     (
//       event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | any
//     ) => {
//       const value =
//         field === "agreeToTerms" ? event.target.checked : event.target.value;
//       let errors = { ...formData.errors };

//       switch (field) {
//         case "fullName":
//           errors[field] = validateFullName(value) || "";
//           break;
//         case "email":
//           errors[field] = validateEmail(value) || "";
//           break;
//         case "phoneNumber":
//           errors[field] = validatePhoneNumber(value) || "";
//           break;
//         case "password":
//           errors[field] = validatePassword(value) || "";
//           if (formData.confirmPassword) {
//             errors["confirmPassword"] =
//               validateConfirmPassword(value, formData.confirmPassword) || "";
//           }
//           break;
//         case "confirmPassword":
//           errors[field] =
//             validateConfirmPassword(formData.password, value) || "";
//           break;
//         case "zip":
//           errors[field] = validateZip(value) || "";
//           break;
//         default:
//           delete errors[field];
//       }

//       setFormData({ ...formData, [field]: value, errors });
//     };

//   // Handle Focus to Clear Errors
//   const handleFocus = (field: keyof FormData) => () => {
//     setFormData((prev) => ({
//       ...prev,
//       errors: { ...prev.errors, [field]: "" },
//     }));
//   };

//   // Check if all required fields are valid for the current step
//   const isStepValid = () => {
//     const errors = { ...formData.errors };
//     switch (activeStep) {
//       case 0:
//         errors.fullName = validateFullName(formData.fullName) || "";
//         errors.email = validateEmail(formData.email) || "";
//         errors.phoneNumber = validatePhoneNumber(formData.phoneNumber) || "";
//         errors.street = formData.street ? "" : "Street is required";
//         errors.city = formData.city ? "" : "City is required";
//         errors.state = formData.state ? "" : "State is required";
//         errors.zip =
//           validateZip(formData.zip) || (formData.zip ? "" : "Zip is required");
//         errors.country = formData.country ? "" : "Country is required";
//         return Object.values(errors).every((error) => !error);
//       case 1:
//         errors.password = validatePassword(formData.password) || "";
//         errors.confirmPassword =
//           validateConfirmPassword(
//             formData.password,
//             formData.confirmPassword
//           ) || "";
//         return Object.values(errors).every((error) => !error);
//       case 2:
//         errors.agreeToTerms = !formData.agreeToTerms
//           ? "Must agree to terms"
//           : "";
//         return formData.agreeToTerms;
//       case 3:
//         if (!formData.emailVerified) {
//           errors.emailVerified = "Email must be verified";
//         } else {
//           delete errors.emailVerified;
//         }
//         return formData.emailVerified;
//       case 4:
//         return true; // Profile completion is optional
//       default:
//         return true;
//     }
//   };

//   const handleNext = () => {
//     let errors = { ...formData.errors };
//     if (activeStep === 0) {
//       errors.fullName = validateFullName(formData.fullName) || "";
//       errors.email = validateEmail(formData.email) || "";
//       errors.phoneNumber = validatePhoneNumber(formData.phoneNumber) || "";
//       errors.street = formData.street ? "" : "Street is required";
//       errors.city = formData.city ? "" : "City is required";
//       errors.state = formData.state ? "" : "State is required";
//       errors.zip =
//         validateZip(formData.zip) || (formData.zip ? "" : "Zip is required");
//       errors.country = formData.country ? "" : "Country is required";
//     } else if (activeStep === 1) {
//       errors.password = validatePassword(formData.password) || "";
//       errors.confirmPassword =
//         validateConfirmPassword(formData.password, formData.confirmPassword) ||
//         "";
//     } else if (activeStep === 2) {
//       errors.agreeToTerms = !formData.agreeToTerms ? "Must agree to terms" : "";
//     } else if (activeStep === 3) {
//       if (!formData.emailVerified) {
//         errors.emailVerified = "Email must be verified";
//       } else {
//         delete errors.emailVerified;
//       }
//     }

//     setFormData((prev) => ({ ...prev, errors }));
//     if (Object.values(errors).every((error) => !error)) {
//       if (activeStep === steps.length - 1) {
//         console.log("Form Submitted:", formData);
//         setFormData({
//           fullName: "",
//           email: "",
//           phoneCode: "+91",
//           phoneNumber: "",
//           companyName: "",
//           street: "",
//           city: "",
//           state: "",
//           zip: "",
//           country: "",
//           password: "",
//           confirmPassword: "",
//           agreeToTerms: false,
//           emailVerified: false,
//           emailOtp: "",
//           generatedEmailOtp: "",
//           otpError: "",
//           verifiedEmailOtp: "",
//           errors: {},
//         });
//         navigate("/");
//       } else {
//         setActiveStep((prevStep) => prevStep + 1);
//       }
//     }
//   };

//   const handleBack = () => {
//     setActiveStep((prevStep) => prevStep - 1);
//     setFormData((prev) => ({
//       ...prev,
//       errors: { ...prev.errors, [steps[activeStep]]: "Re-validate this step" },
//     }));
//   };

//   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     if (event.target.files?.[0]) {
//       const file = event.target.files[0];
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setFormData((prev) => ({
//           ...prev,
//           profilePicture: reader.result as string,
//           errors: { ...prev.errors, profilePicture: "" },
//         }));
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const generateOtp = (): string => {
//     return Math.floor(100000 + Math.random() * 900000).toString();
//   };

//   const handleSendOtp = () => {
//     if (formData.email) {
//       const otp = generateOtp();
//       console.log("Generated Email OTP:", otp);
//       setFormData((prev) => ({ ...prev, generatedEmailOtp: otp }));
//     }
//   };

//   const handleVerify = () => {
//     if (formData.emailOtp === formData.generatedEmailOtp) {
//       setFormData((prev) => ({
//         ...prev,
//         emailVerified: true,
//         otpError: "Verified email",
//         verifiedEmailOtp: formData.emailOtp,
//         errors: { ...prev.errors, emailVerified: "" },
//       }));
//     } else {
//       setFormData((prev) => ({
//         ...prev,
//         otpError: "OTP not matched",
//       }));
//     }
//   };

//   useEffect(() => {
//     if (formData.emailVerified) {
//       handleNext();
//     }
//   }, [formData.emailVerified]);

//   return (
//     <Container
//       maxWidth="sm"
//       sx={{
//         padding: isMobile ? "10px" : "20px",
//         minHeight: "100vh",
//         display: "flex",
//         flexDirection: "column",
//         justifyContent: "center",
//       }}
//     >
//       <Box
//         sx={{
//           my: 4,
//           width: "100%",
//           maxWidth: "500px",
//           margin: "0 auto",
//         }}
//       >
//         <Typography
//           variant="h4"
//           gutterBottom
//           align="center"
//           sx={{ fontSize: isMobile ? "1.5rem" : "2rem" }}
//         >
//           Create Your Landlord Account
//         </Typography>
//         <Typography
//           variant="body1"
//           gutterBottom
//           align="center"
//           sx={{ fontSize: isMobile ? "0.9rem" : "1rem" }}
//         >
//           Please fill in your information to get started
//         </Typography>
//         <Stepper activeStep={activeStep} alternativeLabel sx={{ my: 2 }}>
//           {steps.map((label) => (
//             <Step key={label}>
//               <StepLabel>{label}</StepLabel>
//             </Step>
//           ))}
//         </Stepper>

//         {activeStep === 0 && (
//           <Box mt={3} sx={{ width: "100%" }}>
//             <TextField
//               fullWidth
//               label="Full Name (First and Last)"
//               margin="normal"
//               value={formData.fullName}
//               onChange={handleChange("fullName")}
//               onFocus={handleFocus("fullName")}
//               error={!!formData.errors.fullName}
//               helperText={formData.errors.fullName}
//               variant="outlined"
//             />
//             <TextField
//               fullWidth
//               label="Email Address"
//               margin="normal"
//               type="email"
//               value={formData.email}
//               onChange={handleChange("email")}
//               onFocus={handleFocus("email")}
//               error={!!formData.errors.email}
//               helperText={formData.errors.email}
//               variant="outlined"
//             />
//             <Box
//               display="flex"
//               gap={2}
//               sx={{ flexDirection: isMobile ? "column" : "row" }}
//             >
//               <TextField
//                 select
//                 label="Code"
//                 value={formData.phoneCode}
//                 onChange={handleChange("phoneCode")}
//                 margin="normal"
//                 sx={{ width: isMobile ? "100%" : "30%" }}
//                 variant="outlined"
//               >
//                 <MenuItem value="+91">+91</MenuItem>
//                 <MenuItem value="+912">+912</MenuItem>
//                 <MenuItem value="+44">+44</MenuItem>
//               </TextField>
//               <TextField
//                 fullWidth
//                 label="Phone Number"
//                 margin="normal"
//                 type="tel"
//                 value={formData.phoneNumber}
//                 onChange={handleChange("phoneNumber")}
//                 onFocus={handleFocus("phoneNumber")}
//                 error={!!formData.errors.phoneNumber}
//                 helperText={formData.errors.phoneNumber}
//                 variant="outlined"
//               />
//             </Box>
//             <TextField
//               fullWidth
//               label="Company Name (if applicable)"
//               margin="normal"
//               value={formData.companyName}
//               onChange={handleChange("companyName")}
//               variant="outlined"
//             />
//             <TextField
//               fullWidth
//               label="Street Address"
//               margin="normal"
//               value={formData.street}
//               onChange={handleChange("street")}
//               onFocus={handleFocus("street")}
//               error={!!formData.errors.street}
//               helperText={formData.errors.street}
//               variant="outlined"
//             />
//             <TextField
//               fullWidth
//               label="City"
//               margin="normal"
//               value={formData.city}
//               onChange={handleChange("city")}
//               onFocus={handleFocus("city")}
//               error={!!formData.errors.city}
//               helperText={formData.errors.city}
//               variant="outlined"
//             />
//             <TextField
//               fullWidth
//               label="State/Province"
//               margin="normal"
//               value={formData.state}
//               onChange={handleChange("state")}
//               onFocus={handleFocus("state")}
//               error={!!formData.errors.state}
//               helperText={formData.errors.state}
//               variant="outlined"
//             />
//             <TextField
//               fullWidth
//               label="Zip/Postal Code"
//               margin="normal"
//               value={formData.zip}
//               onChange={handleChange("zip")}
//               onFocus={handleFocus("zip")}
//               error={!!formData.errors.zip}
//               helperText={formData.errors.zip}
//               variant="outlined"
//             />
//             <TextField
//               fullWidth
//               label="Country"
//               margin="normal"
//               value={formData.country}
//               onChange={handleChange("country")}
//               onFocus={handleFocus("country")}
//               error={!!formData.errors.country}
//               helperText={formData.errors.country}
//               variant="outlined"
//             />
//           </Box>
//         )}

//         {activeStep === 1 && (
//           <Box mt={3} sx={{ width: "100%" }}>
//             <TextField
//               fullWidth
//               label="Password"
//               type="password"
//               margin="normal"
//               value={formData.password}
//               onChange={handleChange("password")}
//               onFocus={handleFocus("password")}
//               error={!!formData.errors.password}
//               helperText={formData.errors.password}
//               variant="outlined"
//             />
//             <TextField
//               fullWidth
//               label="Confirm Password"
//               type="password"
//               margin="normal"
//               value={formData.confirmPassword}
//               onChange={handleChange("confirmPassword")}
//               onFocus={handleFocus("confirmPassword")}
//               error={!!formData.errors.confirmPassword}
//               helperText={formData.errors.confirmPassword}
//               variant="outlined"
//             />
//           </Box>
//         )}

//         {activeStep === 2 && (
//           <Box mt={3} sx={{ width: "100%" }}>
//             <FormControlLabel
//               control={
//                 <Checkbox
//                   checked={formData.agreeToTerms}
//                   onChange={handleChange("agreeToTerms")}
//                 />
//               }
//               label={
//                 <Typography variant="body2">
//                   I agree to the{" "}
//                   <a href="#" style={{ textDecoration: "underline" }}>
//                     Terms of Service
//                   </a>{" "}
//                   and{" "}
//                   <a href="#" style={{ textDecoration: "underline" }}>
//                     Privacy Policy
//                   </a>
//                 </Typography>
//               }
//             />
//             {formData.errors.agreeToTerms && (
//               <Typography color="error" variant="caption">
//                 {formData.errors.agreeToTerms}
//               </Typography>
//             )}
//           </Box>
//         )}

//         {activeStep === 3 && (
//           <Box mt={3} sx={{ width: "100%" }}>
//             <TextField
//               fullWidth
//               label="Email Address"
//               margin="normal"
//               type="email"
//               value={formData.email}
//               disabled
//             />
//             <TextField
//               fullWidth
//               label="Enter Email OTP"
//               margin="normal"
//               value={formData.emailOtp}
//               onChange={handleChange("emailOtp")}
//               error={formData.otpError === "OTP not matched"}
//               helperText={
//                 formData.otpError || "Enter the OTP sent to your email"
//               }
//               InputProps={{
//                 style: {
//                   color:
//                     formData.otpError === "OTP not matched" ? "red" : "inherit",
//                 },
//               }}
//             />
//             <Box display="flex" gap={2} mt={2}>
//               <Button variant="outlined" onClick={handleSendOtp}>
//                 Send OTP
//               </Button>
//               <Button
//                 variant="contained"
//                 color="primary"
//                 onClick={handleVerify}
//                 disabled={!formData.emailOtp}
//               >
//                 Verify
//               </Button>
//             </Box>
//           </Box>
//         )}

//         {activeStep === 4 && (
//           <Box mt={3} sx={{ width: "100%" }}>
//             <Typography variant="h6" gutterBottom>
//               Profile Completion (Optional)
//             </Typography>
//             <TextField
//               fullWidth
//               label="Company Name (if applicable)"
//               margin="normal"
//               value={formData.companyName}
//               onChange={handleChange("companyName")}
//               variant="outlined"
//             />
//           </Box>
//         )}

//         <Box
//           mt={4}
//           display="flex"
//           justifyContent="space-between"
//           sx={{
//             flexDirection: isMobile ? "column" : "row",
//             gap: isMobile ? 2 : 0,
//           }}
//         >
//           <Button
//             disabled={activeStep === 0}
//             onClick={handleBack}
//             variant="outlined"
//             sx={{ mb: isMobile ? 2 : 0, width: isMobile ? "100%" : "auto" }}
//           >
//             Back
//           </Button>
//           <Button
//             variant="contained"
//             color="primary"
//             onClick={handleNext}
//             disabled={!isStepValid()}
//             sx={{ width: isMobile ? "100%" : "auto" }}
//           >
//             {activeStep === steps.length - 1 ? "Submit" : "Save & Continue"}
//           </Button>
//         </Box>
//       </Box>
//     </Container>
//   );
// };

// export default OwnerSignup;

//first attempt
// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   Avatar,
//   Box,
//   Button,
//   Checkbox,
//   Container,
//   FormControl,
//   FormControlLabel,
//   FormLabel,
//   MenuItem,
//   Radio,
//   RadioGroup,
//   Step,
//   StepLabel,
//   Stepper,
//   TextField,
//   Typography,
// } from "@mui/material";

// // Interfaces for TypeScript
// interface FormData {
//   fullName: string;
//   email: string;
//   phoneCode: string;
//   phoneNumber: string;
//   companyName: string;
//   address: string;
//   password: string;
//   confirmPassword: string;
//   agreeToTerms: boolean;
//   businessPropertyManagerName: string;
//   bankAccountInfo: string;
//   taxInformation: string;
//   identificationFile: string;
//   identificationFileFile: File | null;
//   businessLicenseFile: string;
//   businessLicenseFileFile: File | null;
//   proofOfOwnershipFile: string;
//   proofOfOwnershipFileFile: File | null;
//   propertyAddress: string;
//   propertyPhotos: string[];
//   propertyPhotosFiles: File[];
//   rentPrice: string;
//   availabilityDates: string;
//   amenities: string;
//   emailOtp: string;
//   phoneOtp: string;
//   emailVerified: boolean;
//   phoneVerified: boolean;
//   generatedEmailOtp: string;
//   generatedPhoneOtp: string;
//   otpError: string;
//   verifiedEmailOtp: string;
//   verifiedPhoneOtp: string;
//   errors: Record<string, string>; // Dynamic error messages
// }

// const OwnerSignup: React.FC = () => {
//   const navigate = useNavigate();
//   const [activeStep, setActiveStep] = useState(0);
//   const [formData, setFormData] = useState<FormData>({
//     fullName: "",
//     email: "",
//     phoneCode: "+91",
//     phoneNumber: "",
//     companyName: "",
//     address: "",
//     password: "",
//     confirmPassword: "",
//     agreeToTerms: false,
//     businessPropertyManagerName: "",
//     bankAccountInfo: "",
//     taxInformation: "",
//     identificationFile: "",
//     identificationFileFile: null,
//     businessLicenseFile: "",
//     businessLicenseFileFile: null,
//     proofOfOwnershipFile: "",
//     proofOfOwnershipFileFile: null,
//     propertyAddress: "",
//     propertyPhotos: [],
//     propertyPhotosFiles: [],
//     rentPrice: "",
//     availabilityDates: "",
//     amenities: "",
//     emailOtp: "",
//     phoneOtp: "",
//     emailVerified: false,
//     phoneVerified: false,
//     generatedEmailOtp: "",
//     generatedPhoneOtp: "",
//     otpError: "",
//     verifiedEmailOtp: "",
//     verifiedPhoneOtp: "",
//     errors: {},
//   });

//   const steps = [
//     "Basic Information",
//     "Set Up Login Credentials",
//     "Agree to Terms",
//     "Complete Profile",
//     "Upload Identification",
//     "Set Up Property Listings",
//     "Final Confirmation",
//   ];

//   // Validation Functions
//   const validateFullName = (name: string): string | null => {
//     const nameRegex = /^(\w+\s+\w+.*)$/;
//     return nameRegex.test(name)
//       ? null
//       : "Full name must contain at least two words";
//   };

//   const validateEmail = (email: string): string | null => {
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return emailRegex.test(email) ? null : "Enter a valid email address";
//   };

//   const validatePhoneNumber = (phone: string): string | null => {
//     const phoneRegex = /^\d{10}$/;
//     return phoneRegex.test(phone) ? null : "Phone number must be 10 digits";
//   };

//   const validatePassword = (password: string): string | null => {
//     const passwordRegex =
//       /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
//     return passwordRegex.test(password)
//       ? null
//       : "Password must be at least 8 characters with uppercase, lowercase, numbers, and special characters";
//   };

//   const validateConfirmPassword = (
//     password: string,
//     confirmPassword: string
//   ): string | null => {
//     return password === confirmPassword && confirmPassword !== ""
//       ? null
//       : "Passwords do not match";
//   };

//   const validateRentPrice = (price: string): string | null => {
//     const priceRegex = /^\d+(\.\d{1,2})?$/;
//     return priceRegex.test(price)
//       ? null
//       : "Enter a valid rent price (e.g., 1000 or 1000.50)";
//   };

//   // Handle Input Change with Validation
//   const handleChange =
//     (field: keyof FormData) =>
//     (
//       event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | any
//     ) => {
//       const value =
//         field === "agreeToTerms" ? event.target.checked : event.target.value;
//       let errors = { ...formData.errors };

//       switch (field) {
//         case "fullName":
//           errors[field] = validateFullName(value) || "";
//           break;
//         case "email":
//           errors[field] = validateEmail(value) || "";
//           break;
//         case "phoneNumber":
//           errors[field] = validatePhoneNumber(value) || "";
//           break;
//         case "password":
//           errors[field] = validatePassword(value) || "";
//           if (formData.confirmPassword) {
//             errors["confirmPassword"] =
//               validateConfirmPassword(value, formData.confirmPassword) || "";
//           }
//           break;
//         case "confirmPassword":
//           errors[field] =
//             validateConfirmPassword(formData.password, value) || "";
//           break;
//         case "rentPrice":
//           errors[field] = validateRentPrice(value) || "";
//           break;
//         default:
//           delete errors[field];
//       }

//       setFormData({ ...formData, [field]: value, errors });
//     };

//   // Handle Focus to Clear Errors
//   const handleFocus = (field: keyof FormData) => () => {
//     setFormData((prev) => ({
//       ...prev,
//       errors: { ...prev.errors, [field]: "" },
//     }));
//   };

//   // Handle File Change for Identification and Property Photos
//   const handleFileChange =
//     (
//       field:
//         | "identificationFileFile"
//         | "businessLicenseFileFile"
//         | "proofOfOwnershipFileFile"
//         | "propertyPhotosFiles"
//     ) =>
//     (event: React.ChangeEvent<HTMLInputElement>) => {
//       if (event.target.files?.[0]) {
//         const file = event.target.files[0];
//         const reader = new FileReader();
//         reader.onloadend = () => {
//           if (field === "propertyPhotosFiles") {
//             setFormData((prev) => ({
//               ...prev,
//               propertyPhotos: [...prev.propertyPhotos, reader.result as string],
//               propertyPhotosFiles: [...prev.propertyPhotosFiles, file],
//               errors: { ...prev.errors, [field]: "" },
//             }));
//           } else {
//             setFormData((prev) => ({
//               ...prev,
//               [field === "identificationFileFile"
//                 ? "identificationFile"
//                 : field === "businessLicenseFileFile"
//                 ? "businessLicenseFile"
//                 : "proofOfOwnershipFile"]: reader.result as string,
//               [field]: file,
//               errors: { ...prev.errors, [field]: "" },
//             }));
//           }
//         };
//         reader.readAsDataURL(file);
//       }
//     };

//   // Check if all required fields are valid for the current step
//   const isStepValid = () => {
//     const errors = { ...formData.errors };
//     switch (activeStep) {
//       case 0:
//         errors.fullName = validateFullName(formData.fullName) || "";
//         errors.email = validateEmail(formData.email) || "";
//         errors.phoneNumber = validatePhoneNumber(formData.phoneNumber) || "";
//         errors.address = formData.address ? "" : "Address is required";
//         return Object.values(errors).every((error) => !error);
//       case 1:
//         errors.password = validatePassword(formData.password) || "";
//         errors.confirmPassword =
//           validateConfirmPassword(
//             formData.password,
//             formData.confirmPassword
//           ) || "";
//         return Object.values(errors).every((error) => !error);
//       case 2:
//         errors.agreeToTerms = !formData.agreeToTerms
//           ? "Must agree to terms"
//           : "";
//         return !errors.agreeToTerms;
//       case 3:
//         errors.businessPropertyManagerName =
//           formData.businessPropertyManagerName
//             ? ""
//             : "Business/Property Manager Name is required";
//         errors.bankAccountInfo = formData.bankAccountInfo
//           ? ""
//           : "Bank Account Information is required";
//         return Object.values(errors).every((error) => !error);
//       case 4:
//         errors.identificationFileFile = formData.identificationFileFile
//           ? ""
//           : "ID/Passport is required";
//         return !!formData.identificationFileFile;
//       case 5:
//         errors.propertyAddress = formData.propertyAddress
//           ? ""
//           : "Property Address is required";
//         errors.rentPrice = validateRentPrice(formData.rentPrice) || "";
//         errors.propertyPhotosFiles =
//           formData.propertyPhotosFiles.length > 0
//             ? ""
//             : "At least one property photo is required";
//         return Object.values(errors).every((error) => !error);
//       case 6:
//         return true; // Final confirmation step, no validation needed
//       default:
//         return true;
//     }
//   };

//   const handleNext = () => {
//     let errors = { ...formData.errors };
//     if (activeStep === 0) {
//       errors.fullName = validateFullName(formData.fullName) || "";
//       errors.email = validateEmail(formData.email) || "";
//       errors.phoneNumber = validatePhoneNumber(formData.phoneNumber) || "";
//       errors.address = formData.address ? "" : "Address is required";
//     } else if (activeStep === 1) {
//       errors.password = validatePassword(formData.password) || "";
//       errors.confirmPassword =
//         validateConfirmPassword(formData.password, formData.confirmPassword) ||
//         "";
//     } else if (activeStep === 2) {
//       errors.agreeToTerms = !formData.agreeToTerms ? "Must agree to terms" : "";
//     } else if (activeStep === 3) {
//       errors.businessPropertyManagerName = formData.businessPropertyManagerName
//         ? ""
//         : "Business/Property Manager Name is required";
//       errors.bankAccountInfo = formData.bankAccountInfo
//         ? ""
//         : "Bank Account Information is required";
//     } else if (activeStep === 4) {
//       errors.identificationFileFile = formData.identificationFileFile
//         ? ""
//         : "ID/Passport is required";
//     } else if (activeStep === 5) {
//       errors.propertyAddress = formData.propertyAddress
//         ? ""
//         : "Property Address is required";
//       errors.rentPrice = validateRentPrice(formData.rentPrice) || "";
//       errors.propertyPhotosFiles =
//         formData.propertyPhotosFiles.length > 0
//           ? ""
//           : "At least one property photo is required";
//     }

//     setFormData((prev) => ({ ...prev, errors }));
//     if (Object.values(errors).every((error) => !error)) {
//       if (activeStep === steps.length - 1) {
//         console.log("Form Submitted:", formData);
//         // Simulate welcome email and dashboard redirection
//         alert("Welcome email sent! Redirecting to dashboard...");
//         setFormData({
//           fullName: "",
//           email: "",
//           phoneCode: "+91",
//           phoneNumber: "",
//           companyName: "",
//           address: "",
//           password: "",
//           confirmPassword: "",
//           agreeToTerms: false,
//           businessPropertyManagerName: "",
//           bankAccountInfo: "",
//           taxInformation: "",
//           identificationFile: "",
//           identificationFileFile: null,
//           businessLicenseFile: "",
//           businessLicenseFileFile: null,
//           proofOfOwnershipFile: "",
//           proofOfOwnershipFileFile: null,
//           propertyAddress: "",
//           propertyPhotos: [],
//           propertyPhotosFiles: [],
//           rentPrice: "",
//           availabilityDates: "",
//           amenities: "",
//           emailOtp: "",
//           phoneOtp: "",
//           emailVerified: false,
//           phoneVerified: false,
//           generatedEmailOtp: "",
//           generatedPhoneOtp: "",
//           otpError: "",
//           verifiedEmailOtp: "",
//           verifiedPhoneOtp: "",
//           errors: {},
//         });
//         navigate("/dashboard"); // Replace with actual dashboard route
//       } else {
//         setActiveStep((prevStep) => prevStep + 1);
//       }
//     }
//   };

//   const handleBack = () => {
//     setActiveStep((prevStep) => prevStep - 1);
//     // Disable "Save & Continue" button after going back
//     setFormData((prev) => ({
//       ...prev,
//       errors: { ...prev.errors, [steps[activeStep]]: "Re-validate this step" },
//     }));
//   };

//   const generateOtp = (): string => {
//     return Math.floor(100000 + Math.random() * 900000).toString();
//   };

//   const handleSendOtp = () => {
//     if (formData.email) {
//       const otp = generateOtp();
//       console.log("Generated Email OTP:", otp);
//       setFormData((prev) => ({ ...prev, generatedEmailOtp: otp }));
//     }
//     if (formData.phoneNumber) {
//       const otp = generateOtp();
//       console.log("Generated Phone OTP:", otp);
//       setFormData((prev) => ({ ...prev, generatedPhoneOtp: otp }));
//     }
//   };

//   const handleVerify = () => {
//     if (formData.emailOtp === formData.generatedEmailOtp) {
//       setFormData((prev) => ({
//         ...prev,
//         emailVerified: true,
//         otpError: "Verified email",
//         verifiedEmailOtp: formData.emailOtp,
//       }));
//     } else {
//       setFormData((prev) => ({
//         ...prev,
//         otpError: "OTP not matched",
//       }));
//     }
//     if (formData.phoneOtp === formData.generatedPhoneOtp) {
//       setFormData((prev) => ({
//         ...prev,
//         phoneVerified: true,
//         otpError: "Verified phone",
//         verifiedPhoneOtp: formData.phoneOtp,
//       }));
//     } else {
//       setFormData((prev) => ({
//         ...prev,
//         otpError: "OTP not matched",
//       }));
//     }
//   };

//   useEffect(() => {
//     if (formData.emailVerified && formData.phoneVerified && activeStep === 2) {
//       handleNext();
//     }
//   }, [formData.emailVerified, formData.phoneVerified, activeStep]);

//   return (
//     <Container maxWidth="sm">
//       <Box my={4}>
//         <Typography variant="h4" gutterBottom>
//           Create Your Landlord Account
//         </Typography>
//         <Typography variant="body1" gutterBottom>
//           Please fill in your information to get started
//         </Typography>
//         <Stepper activeStep={activeStep} alternativeLabel>
//           {steps.map((label) => (
//             <Step key={label}>
//               <StepLabel>{label}</StepLabel>
//             </Step>
//           ))}
//         </Stepper>

//         {activeStep === 0 && (
//           <Box mt={3}>
//             <TextField
//               fullWidth
//               label="Full Name (First and Last)"
//               margin="normal"
//               value={formData.fullName}
//               onChange={handleChange("fullName")}
//               onFocus={handleFocus("fullName")}
//               error={!!formData.errors.fullName}
//               helperText={formData.errors.fullName}
//               variant="outlined"
//             />
//             <TextField
//               fullWidth
//               label="Email Address"
//               margin="normal"
//               type="email"
//               value={formData.email}
//               onChange={handleChange("email")}
//               onFocus={handleFocus("email")}
//               error={!!formData.errors.email}
//               helperText={formData.errors.email}
//               variant="outlined"
//             />
//             <Box display="flex" gap={2}>
//               <TextField
//                 select
//                 label="Code"
//                 value={formData.phoneCode}
//                 onChange={handleChange("phoneCode")}
//                 margin="normal"
//                 style={{ width: "30%" }}
//                 variant="outlined"
//               >
//                 <MenuItem value="+91">+91</MenuItem>
//                 <MenuItem value="+912">+912</MenuItem>
//                 <MenuItem value="+44">+44</MenuItem>
//               </TextField>
//               <TextField
//                 fullWidth
//                 label="Phone Number"
//                 margin="normal"
//                 type="tel"
//                 value={formData.phoneNumber}
//                 onChange={handleChange("phoneNumber")}
//                 onFocus={handleFocus("phoneNumber")}
//                 error={!!formData.errors.phoneNumber}
//                 helperText={formData.errors.phoneNumber}
//                 variant="outlined"
//               />
//             </Box>
//             <TextField
//               fullWidth
//               label="Company Name (if applicable)"
//               margin="normal"
//               value={formData.companyName}
//               onChange={handleChange("companyName")}
//               onFocus={handleFocus("companyName")}
//               variant="outlined"
//             />
//             <TextField
//               fullWidth
//               label="Address (for verification)"
//               margin="normal"
//               value={formData.address}
//               onChange={handleChange("address")}
//               onFocus={handleFocus("address")}
//               error={!!formData.errors.address}
//               helperText={formData.errors.address}
//               variant="outlined"
//             />
//           </Box>
//         )}

//         {activeStep === 1 && (
//           <Box mt={3}>
//             <TextField
//               fullWidth
//               label="Password"
//               type="password"
//               margin="normal"
//               value={formData.password}
//               onChange={handleChange("password")}
//               onFocus={handleFocus("password")}
//               error={!!formData.errors.password}
//               helperText={formData.errors.password}
//               variant="outlined"
//             />
//             <TextField
//               fullWidth
//               label="Confirm Password"
//               type="password"
//               margin="normal"
//               value={formData.confirmPassword}
//               onChange={handleChange("confirmPassword")}
//               onFocus={handleFocus("confirmPassword")}
//               error={!!formData.errors.confirmPassword}
//               helperText={formData.errors.confirmPassword}
//               variant="outlined"
//             />
//           </Box>
//         )}

//         {activeStep === 2 && (
//           <Box mt={3}>
//             <FormControlLabel
//               control={
//                 <Checkbox
//                   checked={formData.agreeToTerms}
//                   onChange={handleChange("agreeToTerms")}
//                 />
//               }
//               label={
//                 <Typography variant="body2">
//                   I agree to the{" "}
//                   <a href="#" style={{ textDecoration: "underline" }}>
//                     Terms of Service
//                   </a>{" "}
//                   and{" "}
//                   <a href="#" style={{ textDecoration: "underline" }}>
//                     Privacy Policy
//                   </a>
//                 </Typography>
//               }
//             />
//             {formData.errors.agreeToTerms && (
//               <Typography color="error" variant="caption">
//                 {formData.errors.agreeToTerms}
//               </Typography>
//             )}
//             <Box mt={2}>
//               <TextField
//                 fullWidth
//                 label="Enter Email OTP"
//                 margin="normal"
//                 value={formData.emailOtp}
//                 onChange={handleChange("emailOtp")}
//                 error={formData.otpError === "OTP not matched"}
//                 helperText={
//                   formData.otpError || "Enter the OTP sent to your email"
//                 }
//                 InputProps={{
//                   style: {
//                     color:
//                       formData.otpError === "OTP not matched"
//                         ? "red"
//                         : "inherit",
//                   },
//                 }}
//               />
//               <TextField
//                 fullWidth
//                 label="Enter Phone OTP"
//                 margin="normal"
//                 value={formData.phoneOtp}
//                 onChange={handleChange("phoneOtp")}
//                 error={formData.otpError === "OTP not matched"}
//                 helperText={
//                   formData.otpError || "Enter the OTP sent to your phone"
//                 }
//                 InputProps={{
//                   style: {
//                     color:
//                       formData.otpError === "OTP not matched"
//                         ? "red"
//                         : "inherit",
//                   },
//                 }}
//               />
//             </Box>
//             <Box display="flex" gap={2} mt={2}>
//               <Button variant="outlined" onClick={handleSendOtp}>
//                 Send OTP
//               </Button>
//               <Button
//                 variant="contained"
//                 color="primary"
//                 onClick={handleVerify}
//                 disabled={!formData.emailOtp || !formData.phoneOtp}
//               >
//                 Verify
//               </Button>
//             </Box>
//             <Box mt={2}>
//               <Button
//                 variant="contained"
//                 color="primary"
//                 onClick={handleNext}
//                 disabled={!isStepValid()}
//                 style={{
//                   display:
//                     formData.emailVerified && formData.phoneVerified
//                       ? "block"
//                       : "none",
//                 }}
//               >
//                 {activeStep === steps.length - 1 ? "Submit" : "Save & Continue"}
//               </Button>
//             </Box>
//           </Box>
//         )}

//         {activeStep === 3 && (
//           <Box mt={3}>
//             <TextField
//               fullWidth
//               label="Business/Property Manager Name"
//               margin="normal"
//               value={formData.businessPropertyManagerName}
//               onChange={handleChange("businessPropertyManagerName")}
//               onFocus={handleFocus("businessPropertyManagerName")}
//               error={!!formData.errors.businessPropertyManagerName}
//               helperText={formData.errors.businessPropertyManagerName}
//               variant="outlined"
//             />
//             <TextField
//               fullWidth
//               label="Bank Account Information"
//               margin="normal"
//               value={formData.bankAccountInfo}
//               onChange={handleChange("bankAccountInfo")}
//               onFocus={handleFocus("bankAccountInfo")}
//               error={!!formData.errors.bankAccountInfo}
//               helperText={formData.errors.bankAccountInfo}
//               variant="outlined"
//             />
//             <TextField
//               fullWidth
//               label="Tax Information (optional)"
//               margin="normal"
//               value={formData.taxInformation}
//               onChange={handleChange("taxInformation")}
//               variant="outlined"
//             />
//           </Box>
//         )}

//         {activeStep === 4 && (
//           <Box mt={3}>
//             <FormLabel component="legend">
//               Upload Identification/Proof
//             </FormLabel>
//             <input
//               type="file"
//               accept="image/*,application/pdf"
//               onChange={handleFileChange("identificationFileFile")}
//               required
//             />
//             {formData.identificationFile && (
//               <Box mt={2} display="flex" justifyContent="center">
//                 <Avatar
//                   src={formData.identificationFile}
//                   sx={{ width: 80, height: 80 }}
//                 />
//               </Box>
//             )}
//             <input
//               type="file"
//               accept="image/*,application/pdf"
//               onChange={handleFileChange("businessLicenseFileFile")}
//             />
//             {formData.businessLicenseFile && (
//               <Box mt={2} display="flex" justifyContent="center">
//                 <Avatar
//                   src={formData.businessLicenseFile}
//                   sx={{ width: 80, height: 80 }}
//                 />
//               </Box>
//             )}
//             <input
//               type="file"
//               accept="image/*,application/pdf"
//               onChange={handleFileChange("proofOfOwnershipFileFile")}
//             />
//             {formData.proofOfOwnershipFile && (
//               <Box mt={2} display="flex" justifyContent="center">
//                 <Avatar
//                   src={formData.proofOfOwnershipFile}
//                   sx={{ width: 80, height: 80 }}
//                 />
//               </Box>
//             )}
//             {formData.errors.identificationFileFile && (
//               <Typography color="error" variant="caption">
//                 {formData.errors.identificationFileFile}
//               </Typography>
//             )}
//             <Box mt={2}>
//               <Button
//                 variant="contained"
//                 color="primary"
//                 onClick={handleNext}
//                 disabled={!isStepValid()}
//               >
//                 {activeStep === steps.length - 1 ? "Submit" : "Save & Continue"}
//               </Button>
//             </Box>
//           </Box>
//         )}

//         {activeStep === 5 && (
//           <Box mt={3}>
//             <TextField
//               fullWidth
//               label="Property Address"
//               margin="normal"
//               value={formData.propertyAddress}
//               onChange={handleChange("propertyAddress")}
//               onFocus={handleFocus("propertyAddress")}
//               error={!!formData.errors.propertyAddress}
//               helperText={formData.errors.propertyAddress}
//               variant="outlined"
//             />
//             <TextField
//               fullWidth
//               label="Rent Price"
//               margin="normal"
//               value={formData.rentPrice}
//               onChange={handleChange("rentPrice")}
//               onFocus={handleFocus("rentPrice")}
//               error={!!formData.errors.rentPrice}
//               helperText={formData.errors.rentPrice}
//               variant="outlined"
//             />
//             <TextField
//               fullWidth
//               label="Availability Dates"
//               margin="normal"
//               value={formData.availabilityDates}
//               onChange={handleChange("availabilityDates")}
//               variant="outlined"
//             />
//             <TextField
//               fullWidth
//               label="Amenities"
//               margin="normal"
//               value={formData.amenities}
//               onChange={handleChange("amenities")}
//               variant="outlined"
//             />
//             <FormLabel component="legend">Upload Property Photos</FormLabel>
//             <input
//               type="file"
//               accept="image/*"
//               onChange={handleFileChange("propertyPhotosFiles")}
//               multiple
//               required
//             />
//             {formData.propertyPhotos.length > 0 && (
//               <Box mt={2} display="flex" justifyContent="center" gap={2}>
//                 {formData.propertyPhotos.map((photo, index) => (
//                   <Avatar
//                     key={index}
//                     src={photo}
//                     sx={{ width: 80, height: 80 }}
//                   />
//                 ))}
//               </Box>
//             )}
//             {formData.errors.propertyPhotosFiles && (
//               <Typography color="error" variant="caption">
//                 {formData.errors.propertyPhotosFiles}
//               </Typography>
//             )}
//             <Box mt={2}>
//               <Button
//                 variant="contained"
//                 color="primary"
//                 onClick={handleNext}
//                 disabled={!isStepValid()}
//               >
//                 {activeStep === steps.length - 1 ? "Submit" : "Save & Continue"}
//               </Button>
//             </Box>
//           </Box>
//         )}

//         {activeStep === 6 && (
//           <Box mt={3}>
//             <Typography variant="h6" gutterBottom>
//               Account Created Successfully!
//             </Typography>
//             <Typography variant="body1">
//               A welcome email has been sent to {formData.email}. You will be
//               redirected to your dashboard shortly.
//             </Typography>
//           </Box>
//         )}

//         <Box mt={4} display="flex" justifyContent="space-between">
//           <Button
//             disabled={activeStep === 0}
//             onClick={handleBack}
//             variant="outlined"
//           >
//             Back
//           </Button>
//           <Button
//             variant="contained"
//             color="primary"
//             onClick={handleNext}
//             disabled={!isStepValid()}
//             style={{
//               display:
//                 activeStep === 2 &&
//                 !formData.emailVerified &&
//                 !formData.phoneVerified
//                   ? "none"
//                   : "block",
//             }}
//           >
//             {activeStep === steps.length - 1 ? "Submit" : "Save & Continue"}
//           </Button>
//         </Box>
//       </Box>
//     </Container>
//   );
// };

// export default OwnerSignup;
