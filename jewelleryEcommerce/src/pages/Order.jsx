import React, { useEffect } from 'react';
import { Table, Tag } from 'antd';
import { getMyEnquiries } from '../lib/api';

const columns = [
  {
    title: 'Product Name',
    dataIndex: 'productName',
    key: 'productName',
  },
  {
    title: 'Category',
    dataIndex: 'category',
    key: 'category',
  },
  {
    title: 'Die No',
    dataIndex: 'dieNo',
    key: 'dieNo',
  },
  {
    title: 'Diameter',
    dataIndex: 'diameter',
    key: 'diameter',
  },
  {
    title: 'Ball Gauge',
    dataIndex: 'ballGauge',
    key: 'ballGauge',
  },
  {
    title: 'Wire Gauge',
    dataIndex: 'wireGauge',
    key: 'wireGauge',
  },
  {
    title: 'Weight',
    dataIndex: 'weight',
    key: 'weight',
  },
  {
    title: 'Tunch',
    dataIndex: 'tunch',
    key: 'tunch',
  },
  {
    title: 'Quantity',
    dataIndex: 'quantity',
    key: 'quantity',
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (status) => {
      let color = 'default';
      if (status === 'Delivered') color = 'green';
      else if (status === 'Pending') color = 'orange';
      else if (status === 'Cancelled') color = 'red';

      return <Tag color={color}>{status}</Tag>;
    },
  },
];

const Order = () => {
    const token = localStorage.getItem('token'); // For user
   useEffect(() => {
  const fetchData = async () => {
    try {
      const data = await getMyEnquiries(token);
      console.log(data);
    } catch (err) {
      console.error("Error fetching enquiries:", err);
    }
  };

  fetchData();
}, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Your Orders</h2>
      <Table columns={columns} dataSource={[]} pagination={{ pageSize: 5 }} />
    </div>
  );
};

export default Order;