import React, { JSX, useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItemText,
  Avatar,
  Box,
  useMediaQuery,
  useTheme,
  ListItemButton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import ListIcon from "@mui/icons-material/List";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import BusinessIcon from "@mui/icons-material/Business";
import { useNavigate, useLocation } from "react-router-dom";
import TableRowsIcon from "@mui/icons-material/TableRows";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { getDetails } from "../../store/AuthSlice";
import Loading from "../Loading/Loading";

const Header: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const role = localStorage.getItem("userRole");
  const dispatch = useDispatch<AppDispatch>();
  const { loading, user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(getDetails());
  }, []);
  const menuItems: {
    label: string;
    icon: JSX.Element;
    path: string;
    roles: string[];
  }[] = [
    {
      label: "Properties",
      icon: <HomeIcon />,
      path: "/",
      roles: ["tenant", "owner", "admin"],
    },
    {
      label: "Property Listing",
      icon: <ListIcon />,
      path: "/add",
      roles: ["owner"],
    },
    {
      label: "Booked Rooms",
      icon: <CalendarTodayIcon />,
      path: "/booked",
      roles: ["tenant"],
    },
    {
      label: "Listed Properties",
      icon: <BusinessIcon />,
      path: "/listedProperty",
      roles: ["owner"],
    },
    {
      label: "Table",
      icon: <TableRowsIcon />,
      path: "/adminTable",
      roles: ["admin"],
    },
  ];

  const filteredMenu = menuItems.filter((item) =>
    item.roles.includes(role || "")
  );

  const handleProfileClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const renderMenuItems = () =>
    filteredMenu.map((item) => (
      <Box
        key={item.label}
        onClick={() => navigate(item.path)}
        sx={{
          display: "flex",
          alignItems: "center",
          mx: 2,
          cursor: "pointer",
          color: location.pathname === item.path ? "primary.main" : "inherit",
          fontWeight: location.pathname === item.path ? "bold" : "normal",
        }}
      >
        {item.icon}
        <Typography sx={{ ml: 1 }}>{item.label}</Typography>
      </Box>
    ));

  return (
    <>
      {loading && <Loading />}

      <AppBar position="static" color="inherit" elevation={1}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          {/* Logo */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
            }}
            onClick={() => navigate("/")}
          >
            <Box
              sx={{
                backgroundColor: "black",
                borderRadius: 2,
                p: 1,
                mr: 1,
              }}
            >
              <HomeIcon sx={{ color: "white" }} />
            </Box>
            <Box>
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", lineHeight: 1 }}
              >
                StayEase
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Your Home Away From Home
              </Typography>
            </Box>
          </Box>

          {/* Desktop Menu */}
          {!isMobile && (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {renderMenuItems()}
              <IconButton onClick={handleProfileClick} sx={{ ml: 2 }}>
                <Avatar src={user?.profilePicture || "/profile.jpg"} />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={() => navigate("/profile")}>
                  Profile
                </MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </Box>
          )}

          {/* Mobile Menu */}
          {isMobile && (
            <>
              <IconButton onClick={() => setDrawerOpen(true)}>
                <MenuIcon />
              </IconButton>
              <Drawer
                anchor="left"
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
              >
                <Box
                  sx={{ width: 250 }}
                  role="presentation"
                  onClick={() => setDrawerOpen(false)}
                >
                  <List>
                    {filteredMenu.map((item) => (
                      <ListItemButton
                        key={item.label}
                        onClick={() => navigate(item.path)}
                        selected={location.pathname === item.path}
                      >
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <item.icon.type sx={{ mr: 1 }} />
                          <ListItemText primary={item.label} />
                        </Box>
                      </ListItemButton>
                    ))}
                    <ListItemButton
                      onClick={() => navigate("/profile")}
                      selected={location.pathname === "/profile"}
                    >
                      <ListItemText primary="Profile" />
                    </ListItemButton>
                    <ListItemButton onClick={handleLogout}>
                      <ListItemText primary="Logout" />
                    </ListItemButton>
                  </List>
                </Box>
              </Drawer>
            </>
          )}
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Header;
