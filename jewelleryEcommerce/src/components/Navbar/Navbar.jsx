import React, { useState, useEffect } from 'react';
import TopHeaderBar from './TopHeaderBar';
import MainNavbar from './MainNavbar';
import MobileDrawerMenu from './MobileDrawerMenu';

const Navbar = () => {
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check login status on component mount
  useEffect(() => {
    // Check if user is logged in (you can replace this with your actual auth logic)
    const checkLoginStatus = () => {
      // Example: Check localStorage, cookie, or call an API
      const authToken = localStorage.getItem('authToken');
      const userSession = localStorage.getItem('userSession');
      
      if (authToken && userSession) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    };

    checkLoginStatus();

    // Optional: Listen for storage changes to sync login state across tabs
    const handleStorageChange = (e) => {
      if (e.key === 'authToken' || e.key === 'userSession') {
        checkLoginStatus();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleMobileMenuToggle = () => {
    setMobileMenuVisible(!mobileMenuVisible);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuVisible(false);
  };

  const handleLogout = () => {
    // Clear user session data
    localStorage.removeItem('authToken');
    localStorage.removeItem('userSession');
    localStorage.removeItem('userData');
    
    // Clear any other user-related data
    // sessionStorage.clear(); // if you're using sessionStorage
    
    // Update login state
    setIsLoggedIn(false);
    
    // Optional: Redirect to home page or login page
    // navigate('/'); // if using react-router navigate hook
    
    // Optional: Show success message
    console.log('User logged out successfully');
    
    // Optional: Call API to invalidate token on server
    // logoutApi();
  };

  const handleLogin = (userData, token) => {
    // This function can be called when user successfully logs in
    localStorage.setItem('authToken', token);
    localStorage.setItem('userSession', 'active');
    localStorage.setItem('userData', JSON.stringify(userData));
    
    setIsLoggedIn(true);
    
    console.log('User logged in successfully');
  };

  return (
    <>
      <TopHeaderBar />
      <MainNavbar 
        onMobileMenuToggle={handleMobileMenuToggle}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
      />
      <MobileDrawerMenu 
        isOpen={mobileMenuVisible}
        onClose={handleMobileMenuClose}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
      />
    </>
  );
};

export default Navbar;