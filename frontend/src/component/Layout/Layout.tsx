import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";

const Layout = () => {
  return (
    <>
      <Header />
      {/* <Box height={50} /> */}
      <Box sx={{ display: "flex" }}>
        <Box
          sx={{
            flexGrow: 1,
            m: { xs: 4, md: 10 },
            boxSizing: "border-box",
            width: "65%",
            height: "100%",
            minHeight: "40rem",
          }}
        >
          <Outlet />
        </Box>
      </Box>
      <Footer />
    </>
  );
};

export default Layout;
