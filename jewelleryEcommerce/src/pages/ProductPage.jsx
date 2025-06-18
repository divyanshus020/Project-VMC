// ✅ src/pages/ProductsPage.jsx

import React, { useEffect, useState } from 'react';
import ProductLayout from '../components/ProductPage/ProductLayout';
import { getProducts } from '../lib/api'; // ✅ use your API file

const ProductsPage = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Fetch products from backend
    getProducts()
      .then(res => setProducts(res.data))
      .catch(err => console.error('Error fetching products:', err));
  }, []);

  return (
    <div style={{ backgroundColor: '#F5F5F5', minHeight: '100vh', width: '100%' }}>
      <ProductLayout products={products} />
    </div>
  );
};

export default ProductsPage;
