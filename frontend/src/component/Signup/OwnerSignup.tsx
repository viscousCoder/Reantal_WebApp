import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Container,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  InputAdornment,
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
// import { is } from "date-fns/locale";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import Loading from "../Loading/Loading";
import {
  registerOwner,
  sendOtp,
  sendPhoneOtp,
  // verifyOtp,
} from "../../store/AuthSlice";

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
  profilePicture: string;
  profilePictureFile: File | null;
  errors: Record<string, string>; // Dynamic error messages
  userRole: string;
}

const OwnerSignup: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { emailOtp, otpVerified, loading } = useSelector(
    (state: RootState) => state.auth
  );
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
    phoneVerified: true,
    generatedEmailOtp: "",
    generatedPhoneOtp: "",
    otpError: "",
    verifiedEmailOtp: "",
    verifiedPhoneOtp: "",
    profilePicture: "",
    profilePictureFile: null,
    userRole: "owner",
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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword((prev) => !prev);

  // Validation Functions
  const validateFullName = (name: string): string | null => {
    const nameRegex = /^(\w+.*)$/;
    return nameRegex.test(name) ? null : "Enter your name";
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

  console.log(formData);
  // Handle Input Change with Validation
  const handleChange =
    (field: keyof FormData) =>
    (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | any
    ) => {
      let value =
        field === "agreeToTerms" ? event.target.checked : event.target.value;

      if (field === "email" && value) {
        value = value.charAt(0).toLowerCase() + value.slice(1);
      }

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
        errors.profilePicture = formData.profilePictureFile
          ? ""
          : "Profile picture is required";
        return formData.agreeToTerms && !!formData.profilePictureFile;
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
      errors.profilePicture = formData.profilePictureFile
        ? ""
        : "Profile picture is required";
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
        const userFormData = {
          fullName: formData.fullName,
          email: formData.email,
          phoneCode: formData.phoneCode,
          phoneNumber: formData.phoneNumber,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          agreeToTerms: formData.agreeToTerms,
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zip: formData.zip,
          country: formData.country,
          userRole: formData.userRole,
          profilePicture: formData.profilePictureFile,
          verificationMethod: formData.verificationMethod,
          emailOtp: formData.emailOtp,
          phoneOtp: formData.phoneOtp,
          emailVerified: formData.emailVerified,
          phoneVerified: formData.phoneVerified,
          generatedEmailOtp: formData.generatedEmailOtp,
          generatedPhoneOtp: formData.generatedPhoneOtp,
          verifiedEmailOtp: formData.verifiedEmailOtp,
          verifiedPhoneOtp: formData.verifiedPhoneOtp,
        };

        dispatch(registerOwner({ formData: userFormData, navigate }));

        // navigate("/login");
      } else {
        setActiveStep((prevStep) => prevStep + 1);
      }
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
    setFormData((prev) => ({
      ...prev,
      errors: {},
    }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          profilePicture: reader.result as string,
          profilePictureFile: file,
          errors: { ...prev.errors, profilePicture: "" },
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const generateOtp = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const handleSendOtp = () => {
    if (formData.verificationMethod === "email" && formData.email) {
      const otp = generateOtp();
      dispatch(sendOtp({ email: formData.email }));

      setFormData((prev) => ({ ...prev, generatedEmailOtp: otp }));
    } else if (
      formData.verificationMethod === "phone" &&
      formData.phoneNumber
    ) {
      const otp = generateOtp();
      const phoneNumber = formData.phoneCode + formData.phoneNumber;
      dispatch(sendPhoneOtp({ phoneNumber }));

      setFormData((prev) => ({ ...prev, generatedPhoneOtp: otp }));
    }
  };

  const handleVerify = () => {
    if (formData.verificationMethod === "email") {
      if (formData.emailOtp === emailOtp) {
        setFormData((prev) => ({
          ...prev,
          emailVerified: true,
          verificationMethod: "phone", // move to phone verification
          otpError: "",
          verifiedEmailOtp: formData.emailOtp,
          errors: { ...prev.errors, verificationMethod: "" },
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          otpError: "Email OTP does not match",
        }));
      }
    } else if (formData.verificationMethod === "phone") {
      // const phoneNumber = formData.phoneCode + formData.phoneNumber;
      // dispatch(verifyOtp({ phoneNumber, code: formData.phoneOtp }));
      setActiveStep((prev) => prev + 1);
    }
  };

  useEffect(() => {
    if (
      otpVerified &&
      formData.verificationMethod === "phone" &&
      !formData.phoneVerified
    ) {
      setFormData((prev) => ({
        ...prev,
        phoneVerified: true,
        otpError: "",
        verifiedPhoneOtp: formData.phoneOtp,
        errors: { ...prev.errors, verificationMethod: "" },
      }));
    }
  }, [otpVerified, formData.verificationMethod, formData.phoneOtp]);

  useEffect(() => {
    if (formData.emailVerified && formData.phoneVerified) {
      handleNext();
    }
  }, [formData.emailVerified, formData.phoneVerified]);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
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
                  type={showPassword ? "text" : "password"}
                  margin="normal"
                  value={formData.password}
                  onChange={handleChange("password")}
                  onFocus={handleFocus("password")}
                  error={!!formData.errors.password}
                  helperText={formData.errors.password}
                  variant="outlined"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={togglePasswordVisibility}
                          edge="end"
                        >
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  fullWidth
                  label="Confirm Password"
                  type={showConfirmPassword ? "text" : "password"}
                  margin="normal"
                  value={formData.confirmPassword}
                  onChange={handleChange("confirmPassword")}
                  onFocus={handleFocus("confirmPassword")}
                  error={!!formData.errors.confirmPassword}
                  helperText={formData.errors.confirmPassword}
                  variant="outlined"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={toggleConfirmPasswordVisibility}
                          edge="end"
                        >
                          {showConfirmPassword ? (
                            <Visibility />
                          ) : (
                            <VisibilityOff />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
            )}

            {activeStep === 2 && (
              <Box>
                <Box mt={3} sx={{ width: "100%" }}>
                  <FormLabel component="legend">
                    Profile Picture (Required)
                  </FormLabel>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    required
                    style={{ margin: "10px 0" }}
                  />
                  {formData.profilePicture && (
                    <Box mt={2} display="flex" justifyContent="center">
                      <Avatar
                        src={formData.profilePicture}
                        sx={{
                          width: isMobile ? 60 : 80,
                          height: isMobile ? 60 : 80,
                        }}
                      />
                    </Box>
                  )}
                  {formData.errors.profilePicture && (
                    <Typography color="error" variant="caption">
                      {formData.errors.profilePicture}
                    </Typography>
                  )}
                </Box>
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
                      disabled={
                        !formData.emailVerified || formData.phoneVerified
                      }
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
      )}
    </>
  );
};

export default OwnerSignup;
