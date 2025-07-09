// pages/admin/AddProductPage.jsx
import React from 'react';
import ProductForm from '..//components/AddProduct/ProductForm';
import AdminNavbar from '../components/Navbar/AdminNavbar';

const AddProductPage = () => {
  return (
    <div className="">
      <AdminNavbar/>
      {/* <h2 className="text-2xl font-bold mb-4">Add New Product</h2> */}
      <ProductForm />
    </div>
  );
};

export default AddProductPage;
