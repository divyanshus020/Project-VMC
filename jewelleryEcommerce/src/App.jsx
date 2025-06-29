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
import ProductDetail from './components/ProductDetailPage/ProductDetail.jsx';
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
        <Route path="/product/:id" element={<ProductDetail />} />
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
