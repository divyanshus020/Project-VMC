// components/SortButton.js
import React from 'react';
import { Select } from 'antd';

const { Option } = Select;

const SortButton = ({ sortOption, setSortOption }) => {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <Select
        value={sortOption}
        onChange={(value) => setSortOption(value)}
        style={{ width: 200 }}
      >
        <Option value="default">Sort By</Option>
        <Option value="priceLowHigh">Price: Low to High</Option>
        <Option value="priceHighLow">Price: High to Low</Option>
        <Option value="nameAZ">Name: A-Z</Option>
        <Option value="nameZA">Name: Z-A</Option>
      </Select>
    </div>
  );
};

export default SortButton;
