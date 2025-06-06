// components/Category.jsx
import React from 'react';
import { Select } from 'antd';

const { Option } = Select;

const Category = ({ selectedCategory, setSelectedCategory, categories }) => {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <Select
        value={selectedCategory}
        onChange={(value) => setSelectedCategory(value)}
        style={{ width: 200 }}
      >
        <Option value="All">All Categories</Option>
        {categories.map((cat) => (
          <Option key={cat} value={cat}>
            {cat}
          </Option>
        ))}
      </Select>
    </div>
  );
};

export default Category;
