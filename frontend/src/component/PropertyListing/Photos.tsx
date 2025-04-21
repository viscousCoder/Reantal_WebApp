import React, { useRef } from "react";
import {
  Box,
  Button,
  Grid,
  IconButton,
  Typography,
  styled,
} from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import DeleteIcon from "@mui/icons-material/Delete";

interface UploadedPhoto {
  file: File;
  url: string;
  label: string;
}
// interface PropertyPhotosProps {
//   photos: UploadedPhoto[];
//   setPhotos: (photos: UploadedPhoto[]) => void;
// }

interface PropertyPhotosProps {
  photos: UploadedPhoto[];
  setPhotos: (photos: UploadedPhoto[]) => void;
  error?: string; // ⬅️ Add this
}

const HiddenInput = styled("input")({
  display: "none",
});

const PropertyPhotos: React.FC<PropertyPhotosProps> = ({
  photos,
  setPhotos,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const uploaded = Array.from(files).map((file) => ({
        file,
        url: URL.createObjectURL(file),
        label: file.name,
      }));
      setPhotos([...photos, ...uploaded]);
    }
  };

  const handleRemove = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Property Photos
      </Typography>
      <Typography variant="body2" color="textSecondary" gutterBottom>
        Upload high-quality images of your property
      </Typography>

      <Box
        sx={{
          border: "2px dashed #ccc",
          borderRadius: 2,
          p: 4,
          textAlign: "center",
          mb: 3,
        }}
        onClick={() => fileInputRef.current?.click()}
      >
        <AddPhotoAlternateIcon sx={{ fontSize: 48, color: "#7b61ff" }} />
        <Typography variant="subtitle1" mt={1}>
          Drag and drop your photos here
        </Typography>
        <Typography variant="body2" color="textSecondary">
          or click to browse from your device
        </Typography>
        <Button variant="contained" sx={{ mt: 2 }}>
          Browse Files
        </Button>
        <Typography variant="caption" display="block" mt={2}>
          Supported formats: JPG, PNG, WEBP. Max size: 10MB per image.
        </Typography>
        <HiddenInput
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleUpload}
        />
      </Box>

      {photos.length > 0 && (
        <Box>
          <Typography variant="subtitle2" gutterBottom>
            Uploaded Photos ({photos.length})
          </Typography>
          <Grid container spacing={2}>
            {photos.map((photo, index) => (
              <Grid size={{ xs: 6, sm: 4, md: 3, lg: 2 }} key={index}>
                <Box
                  sx={{
                    border: "1px solid #ddd",
                    borderRadius: 2,
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  <img
                    src={photo.url}
                    alt={photo.label}
                    style={{ width: "100%", height: 100, objectFit: "cover" }}
                  />
                  <IconButton
                    size="small"
                    onClick={() => handleRemove(index)}
                    sx={{
                      position: "absolute",
                      top: 4,
                      right: 4,
                      backgroundColor: "rgba(255,255,255,0.7)",
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
                <Typography variant="caption" display="block" noWrap>
                  {photo.label}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default PropertyPhotos;
