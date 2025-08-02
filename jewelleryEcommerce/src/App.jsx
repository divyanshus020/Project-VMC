import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// FIX: Import ThemeProvider, createTheme, and CssBaseline from Material-UI
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import Navbar from './components/Navbar/Navbar.jsx';
import Footer from './components/Basic/Footer.jsx';
import Home from './pages/Home.jsx';
import ProductPage from './pages/ProductPage.jsx';
import About from './pages/About.jsx';
import Contact from './pages/Contact.jsx';
import AuthPage from './pages/Authpage.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import Account from './pages/Account.jsx';
import AdminLogin from './pages/AdminLogin.jsx';
import Users from './components/AdminDashboard/Users.jsx';
import ProtectedRoute from './components/Routes/ProtectedRoute.jsx';
import ProductDetail from './pages/ProductDetail.jsx';
import Cart from './pages/Cart.jsx';
import AddProduct from './pages/AddProduct.jsx';
import AdminProductPage from './components/AdminDashboard/AdminProductpage.jsx';
import AdminEnquery from './components/AdminDashboard/AdminEnquery.jsx';
import AdminSizesPage from './components/AdminDashboard/AdminSizesPage.jsx';
import Order from './pages/Order.jsx';
import AdminData from './components/AdminDashboard/AdminData.jsx';
import ForgotPassword from './components/Basic/ForgotPassword.jsx';
import ResetPassword from './components/Basic/ResetPassword.jsx';

// Create a theme to provide to the application
const theme = createTheme({
  palette: {
    primary: {
      main: '#D4AF37', // Your primary gold color
    },
    secondary: {
      main: '#333333', // A dark gray for secondary elements
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
});

function AppWrapper() {
  const location = useLocation();

  // Hide Navbar and Footer for any /admin/* route
  const hideLayout = location.pathname.toLowerCase().startsWith('/admin');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <>
      {!hideLayout && <Navbar />}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<ProductPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/profile" element={<Account />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path='/orders' element={<Order />} />

        {/* Admin Login (public) */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Protected Admin Routes */}
        <Route path="/admin/dashboard" element={<ProtectedRoute> <AdminDashboard /> </ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute> <Users /> </ProtectedRoute>} />
        <Route path="/admin/add-product" element={<ProtectedRoute> <AddProduct /> </ProtectedRoute>} />
        <Route path="/admin/products" element={<ProtectedRoute> <AdminProductPage /> </ProtectedRoute>} />
        <Route path="/admin/admins" element={<ProtectedRoute> <AdminData /> </ProtectedRoute>} />
        <Route path="/admin/enquiry" element={<ProtectedRoute> <AdminEnquery /> </ProtectedRoute>} />
        <Route path="/admin/sizes" element={<ProtectedRoute> <AdminSizesPage /> </ProtectedRoute>} />
        <Route path="/admin/forgot-password" element={<ForgotPassword />} />
        <Route path="/admin/reset-password" element={<ResetPassword />} />
      </Routes>
      {!hideLayout && <Footer />}

      {/* Toast Container - Global notification system */}
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}

function App() {
  return (
    // Wrap the entire application in the ThemeProvider
    <ThemeProvider theme={theme}>
      {/* FIX: Add CssBaseline to normalize styles across browsers */}
      <CssBaseline />
      <BrowserRouter>
        <AppWrapper />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
