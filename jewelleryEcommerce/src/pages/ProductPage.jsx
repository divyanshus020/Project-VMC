// ✅ src/pages/ProductsPage.jsx

import React, { useEffect, useState } from 'react';
import { getProducts } from '../lib/api';
import ProductLayout from '../components/ProductPage/ProductLayout';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getProducts();
        console.log('Fetched products:', data); // Debug log
        setProducts(data);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Add error handling
  if (error) {
    return <div>Error loading products: {error}</div>;
  }

  return (
    <div style={{ backgroundColor: '#F5F5F5', minHeight: '100vh', width: '100%' }}>
      <ProductLayout products={products} loading={loading} />
    </div>
  );
};

export default ProductsPage;
