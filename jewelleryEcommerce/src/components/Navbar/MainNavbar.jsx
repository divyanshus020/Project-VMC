import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Logo from "../../assets/catalogue/vmc.png";
import LogoutConfirmation from "../AuthPage/ConfirmLogoutDialog";
import SearchBar from "./SearchBar"; // Import the new SearchBar component
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Container,
  useMediaQuery,
  Typography,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import {
  FavoriteBorder,
  ShoppingCartOutlined,
  PersonOutline,
  Menu as MenuIcon,
  AccountCircle,
  ListAlt,
  Logout,
} from "@mui/icons-material";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

// Navigation links data
const navLinks = [
  { label: "Home", href: "/" },
  { label: "Product", href: "/products" },
  { label: "About us", href: "/about" },
  { label: "Contact us", href: "/contact" },
];

const MainNavbar = ({ onMobileMenuToggle, onLogout, user }) => {
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("lg"));

  useEffect(() => {
    const checkAuthStatus = () => {
      const token =
        localStorage.getItem("token") || localStorage.getItem("authToken");
      setIsLoggedIn(!!token);
    };
    checkAuthStatus();
    window.addEventListener("storage", checkAuthStatus);
    return () => {
      window.removeEventListener("storage", checkAuthStatus);
    };
  }, []);

  const userMenuItems = isLoggedIn
    ? [
        {
          icon: <PersonOutline />,
          label: "My Profile",
          key: "profile",
          href: "/profile",
        },
        {
          icon: <ListAlt />,
          label: "My Orders",
          key: "orders",
          href: "/orders",
        },
      ]
    : [
        {
          icon: <AccountCircle />,
          label: "Login / Register",
          key: "login",
          href: "/login",
        },
      ];

  const handleUserMenuOpen = (event) => setUserMenuAnchor(event.currentTarget);
  const handleUserMenuClose = () => setUserMenuAnchor(null);
  const handleLogoutClick = () => setShowLogoutConfirmation(true);

  const handleLogoutConfirm = () => {
    setShowLogoutConfirmation(false);
    localStorage.removeItem("token");
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    if (onLogout) onLogout();
    navigate("/");
  };

  return (
    <>
      <AppBar
        position="sticky"
        sx={{
          backgroundColor: "white",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          borderBottom: "1px solid #e0e0e0",
        }}
        elevation={0}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ px: { xs: 1, sm: 2 }, minHeight: "64px !important" }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                mr: { xs: 1, lg: "auto" },
              }}
            >
              <Button component={Link} to="/">
                <img
                  src={Logo}
                  alt="VMC Logo"
                  style={{ width: "100%", maxWidth: 130, height: "auto" }}
                />
              </Button>
            </Box>

            <Box
              sx={{
                display: { xs: "none", lg: "flex" },
                gap: 4,
                mx: "auto",
                alignItems: "center",
              }}
            >
              {navLinks.map((link) => (
                <Button
                  key={link.label}
                  component={Link}
                  to={link.href}
                  sx={{
                    color:
                      location.pathname === link.href ? "#D4AF37" : "#666666",
                    fontWeight: 500,
                    textTransform: "none",
                    fontSize: "1rem",
                    position: "relative",
                    "&:hover": {
                      backgroundColor: "transparent",
                      color: "#D4AF37",
                    },
                    "&::after":
                      location.pathname === link.href
                        ? {
                            content: '""',
                            position: "absolute",
                            bottom: 0,
                            left: "50%",
                            transform: "translateX(-50%)",
                            width: "100%",
                            height: "2px",
                            backgroundColor: "#D4AF37",
                          }
                        : {},
                  }}
                >
                  {link.label}
                </Button>
              ))}
            </Box>

            {/* Replace old search bar with the new component */}
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                justifyContent: "center",
              }}
            >
              <SearchBar />
            </Box>

            <Box
              sx={{ display: "flex", alignItems: "center", gap: 1, ml: "auto" }}
            >
              {isLoggedIn ? (
                <>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      color: "#333",
                      fontWeight: 500,
                      mr: 1,
                      display: { xs: "none", sm: "block" },
                    }}
                    onClick={handleUserMenuOpen}
                  >
                    {user && (
                      <div className="bg-yellow-200 cursor-pointer text-yellow-800 px-3 py-1 rounded-full shadow-sm">
                        👤 {user.fullName}
                      </div>
                    )}
                  </Typography>

                  <IconButton
                    component={Link}
                    to="/cart"
                    sx={{ color: "#666666", "&:hover": { color: "#D4AF37" } }}
                  >
                    <Badge
                      color="primary"
                      sx={{
                        "& .MuiBadge-badge": { backgroundColor: "#D4AF37" },
                      }}
                    >
                      <ShoppingCartOutlined />
                    </Badge>
                  </IconButton>
                  <IconButton
                    onClick={handleLogoutClick}
                    sx={{ color: "#666666", "&:hover": { color: "#f44336" } }}
                  >
                    <Logout />
                  </IconButton>
                </>
              ) : (
                <>
                  <Button
                    component={Link}
                    to="/login"
                    variant="outlined"
                    sx={{
                      color: "#D4AF37",
                      borderColor: "#D4AF37",
                      "&:hover": { backgroundColor: "#D4AF37", color: "white" },
                      display: { xs: "none", sm: "flex" },
                    }}
                  >
                    Login / Register
                  </Button>
                  <Button
                    component={Link}
                    to="/Admin/Login"
                    variant="outlined"
                    startIcon={<AdminPanelSettingsIcon />}
                    sx={{
                      color: "#1976d2",
                      borderColor: "#1976d2",
                      "&:hover": { backgroundColor: "#1976d2", color: "white" },
                      display: { xs: "none", sm: "flex" },
                    }}
                  >
                    Admin
                  </Button>
                </>
              )}
              <IconButton
                onClick={onMobileMenuToggle}
                sx={{ color: "#666666", display: { lg: "none" } }}
              >
                <MenuIcon />
              </IconButton>
            </Box>
          </Toolbar>

          {/* Mobile Search Bar */}
          <Box sx={{ display: { xs: "block", md: "none" }, pb: 2, px: 2 }}>
            <SearchBar />
          </Box>
        </Container>
      </AppBar>

      {isLoggedIn && (
        <Menu
          anchorEl={userMenuAnchor}
          open={Boolean(userMenuAnchor)}
          onClose={handleUserMenuClose}
          PaperProps={{
            sx: {
              mt: 1.5,
              boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
              borderRadius: "8px",
              minWidth: "200px",
            },
          }}
        >
          {userMenuItems.map((item) => (
            <MenuItem
              key={item.key}
              component={Link}
              to={item.href}
              onClick={handleUserMenuClose}
            >
              <ListItemIcon sx={{ minWidth: "36px", color: "#666666" }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </MenuItem>
          ))}
        </Menu>
      )}

      <LogoutConfirmation
        open={showLogoutConfirmation}
        onConfirm={handleLogoutConfirm}
        onCancel={() => setShowLogoutConfirmation(false)}
      />
    </>
  );
};

export default MainNavbar;
