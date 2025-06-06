import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react'
import { Button } from 'antd';
import './App.css'
import Navbar from './components/Basic/Navbar.jsx';
import Footer from './components/Basic/Footer.jsx';
import Home from './pages/Home.jsx';
import ProductPage from './pages/ProductPage.jsx';
import About from './pages/About.jsx';
import Contact from './pages/Contact.jsx';

function App() {

  return (
    <BrowserRouter>
    <Navbar/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<ProductPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        {/* Add more routes as needed */}
      </Routes>
      <Footer/> 
    </BrowserRouter>
  )
}

export default App
