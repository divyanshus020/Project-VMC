import React from 'react';
import ProductLayout from '../components/ProductPage/ProductLayout';

const sampleProducts = [
  {
    id: 1,
    title: 'iPhone 15 Pro',
    description: 'A17 Bionic, Titanium Frame, Pro Camera',
    image: 'https://via.placeholder.com/300x200',
    price: '$999',
  },
  {
    id: 2,
    title: 'Samsung Galaxy S23',
    description: 'Snapdragon 8 Gen 2, 120Hz AMOLED',
    image: 'https://via.placeholder.com/300x200',
    price: '$899',
  },
  {
    id: 3,
    title: 'OnePlus 11',
    description: 'Snapdragon 8 Gen 2, 100W Fast Charging',
    image: 'https://via.placeholder.com/300x200',
    price: '$749',
  },
  {
    id: 4,
    title: 'Google Pixel 8',
    description: 'Tensor G3, AI Camera, Pure Android',
    image: 'https://via.placeholder.com/300x200',
    price: '$799',
  },
  {
    id: 5,
    title: 'Google Pixel 8',
    description: 'Tensor G3, AI Camera, Pure Android',
    image: 'https://via.placeholder.com/300x200',
    price: '$799',
  },
  {
    id: 6,
    title: 'Google Pixel 8',
    description: 'Tensor G3, AI Camera, Pure Android',
    image: 'https://via.placeholder.com/300x200',
    price: '$799',
  },
];

const ProductsPage = () => {
  return (
    <div style={{ backgroundColor: '#F5F5F5', minHeight: '100vh', width: '100%' }}>
        <ProductLayout products={sampleProducts} />
    </div>
  );
};

export default ProductsPage;