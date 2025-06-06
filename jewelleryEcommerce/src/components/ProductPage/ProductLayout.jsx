// components/ProductLayout.js
import React, { useState } from 'react';
import { Row, Col } from 'antd';
import ProductCard from './ProductCard';
import SortButton from '../Basic/Shorting';
import Category from '../Basic/Cataogry';

const ProductLayout = ({ products }) => {
  const [sortOption, setSortOption] = useState('default');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = Array.from(new Set(products.map((p) => p.category)));

  const filteredProducts =
    selectedCategory === 'All'
      ? products
      : products.filter((p) => p.category === selectedCategory);

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const getPrice = (price) =>
      typeof price === 'string'
        ? parseFloat(price.replace(/[^0-9.]/g, ''))
        : price;

    switch (sortOption) {
      case 'priceLowHigh':
        return getPrice(a.price) - getPrice(b.price);
      case 'priceHighLow':
        return getPrice(b.price) - getPrice(a.price);
      case 'nameAZ':
        return a.title.localeCompare(b.title);
      case 'nameZA':
        return b.title.localeCompare(a.title);
      default:
        return 0;
    }
  });

  return (
    <div
      className="px-4 py-6"
      style={{
        maxWidth: 1100,
        margin: '0 auto',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      <div className="flex flex-wrap gap-4 mb-4">
        <Category
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          categories={categories}
        />
        <SortButton sortOption={sortOption} setSortOption={setSortOption} />
      </div>

      <Row gutter={[20, 20]}>
        {sortedProducts.map((product) => (
          <Col key={product.id} xs={24} sm={12} md={8} lg={8}>
            <ProductCard product={product} />
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default ProductLayout;
