import React, { useState, useEffect } from 'react';
import TopHeaderBar from './TopHeaderBar';
import MainNavbar from './MainNavbar';
import MobileDrawerMenu from './MobileDrawerMenu';

const Navbar = () => {
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check login status on component mount
  useEffect(() => {
    // Check if user is logged in (replace with your actual auth logic)
    const checkLoginStatus = () => {
      // Use sessionStorage instead of localStorage
      const authToken = sessionStorage.getItem('authToken');
      const userSession = sessionStorage.getItem('userSession');
      
      if (authToken && userSession) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    };

    checkLoginStatus();

    // Listen for storage changes to sync login state across tabs
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
    // Clear user session data from sessionStorage
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('userSession');
    sessionStorage.removeItem('userData');
    
    // Update login state
    setIsLoggedIn(false);
    
    // Optional: Redirect to home page or login page
    // navigate('/'); // if using react-router navigate hook
    
    // Optional: Show success message
    console.log('User logged out successfully');
  };

  const handleLogin = (userData, token) => {
    // This function can be called when user successfully logs in
    sessionStorage.setItem('authToken', token);
    sessionStorage.setItem('userSession', 'active');
    sessionStorage.setItem('userData', JSON.stringify(userData));
    
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