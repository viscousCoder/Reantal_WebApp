import { Box, CircularProgress } from "@mui/material";

/**
 *
 * @returns loading spinner
 */
const Loading = () => {
  return (
    <Box
      sx={{
        display: "flex",
        background: "#000000a3",
        justifyContent: "center",
        top: 0,
        left: 0,
        zIndex: 9999,
        height: "100%",
        position: "fixed",
        width: " 100%",
        alignItems: "center",
      }}
    >
      <CircularProgress />
    </Box>
  );
};

export default Loading;
