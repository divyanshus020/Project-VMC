import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react'
// import { Button } from 'antd'; 
// import './App.css'
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
function App() {

  return (
    <BrowserRouter>
    <Navbar/>
      <Routes>
        <Route path="/" element={<Home />} />                       
        <Route path="/products" element={<ProductPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/Login" element={<AuthPage />} />
        <Route path="/Admin" element={<AdminDashboard />} />
        <Route path="/profile" element={<Account />} />
        <Route path="/AdminLogin" element={<AdminLogin />} />
      </Routes>
      <Footer/> 
    </BrowserRouter>
  )
}

export default App
