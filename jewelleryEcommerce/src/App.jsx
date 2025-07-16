import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
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
import AddProduct from './pages/AddProduct.jsx'; // ✅ Fixed typo here
import AdminProductPage from './components/AdminDashboard/AdminProductpage.jsx'; // ✅ Fixed typo here
import AdminEnquery from './components/AdminDashboard/AdminEnquery.jsx'; // ✅ Fixed typo here
import AdminSizesPage from './components/AdminDashboard/AdminSizesPage.jsx'; // ✅ Fixed typo here
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

        {/* Admin Login (public) */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Protected Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute>
              <Users />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/add-product"
          element={
            <ProtectedRoute>
              <AddProduct />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/products"
          element={
            <ProtectedRoute>
              <AdminProductPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/enquiry"
          element={
            <ProtectedRoute>
              <AdminEnquery />
            </ProtectedRoute>
          }
        />
        <Route path="/admin/sizes" element={<AdminSizesPage />} />
      </Routes>
      {!hideLayout && <Footer />}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppWrapper />
    </BrowserRouter>
  );
}

export default App;
