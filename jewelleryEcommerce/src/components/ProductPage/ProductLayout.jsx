import React from 'react';
import { Row, Col } from 'antd';
import ProductCard from './ProductCard';

const ProductLayout = ({ products }) => {
  return (
    <div
      className="px-4 py-6"
      style={{
        maxWidth: 1000,
        margin: '0 auto',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      <Row gutter={[16, 16]}>
        {products.map((product) => (
          <Col key={product.id} xs={24} sm={12} md={8} lg={6}>
            <ProductCard product={product} />
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default ProductLayout;