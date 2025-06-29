import { useEffect, useState } from 'react';
import { Table, Input, Space, Button, Modal, message, Tag, Dropdown } from 'antd';
import { SearchOutlined, DeleteOutlined, ReloadOutlined, FilterOutlined, SortAscendingOutlined, SortDescendingOutlined } from '@ant-design/icons';
import { getAllUsers, deleteUser } from '../../lib/api';
import AdminNavbar from '../Navbar/AdminNavbar';

function Users() {
  const [users, setUsers] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [deletingUserId, setDeletingUserId] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);
  const [sortField, setSortField] = useState(null);

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await getAllUsers();
      setUsers(response.data);
      setFilteredData(response.data);
      setLoading(false);
    } catch (error) {
      message.error('Failed to fetch users');
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    setSearchText(value);
    const filtered = users.filter((user) =>
      Object.values(user).some((field) =>
        String(field).toLowerCase().includes(value.toLowerCase())
      )
    );
    setFilteredData(filtered);
  };

  const showDeleteConfirm = (userId) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this user?',
      content: 'This action cannot be undone.',
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: () => handleDelete(userId),
    });
  };

  const handleDelete = async (userId) => {
    try {
      setDeletingUserId(userId);
      await deleteUser(userId);
      message.success('User deleted successfully');
      fetchUsers();
    } catch (error) {
      message.error('Failed to delete user');
    } finally {
      setDeletingUserId(null);
    }
  };

  // Sorting logic
  const handleSort = (field) => {
    let order = 'ascend';
    if (sortField === field && sortOrder === 'ascend') {
      order = 'descend';
    }
    setSortField(field);
    setSortOrder(order);

    const sorted = [...filteredData].sort((a, b) => {
      if (!a[field]) return 1;
      if (!b[field]) return -1;
      if (order === 'ascend') {
        return String(a[field]).localeCompare(String(b[field]));
      } else {
        return String(b[field]).localeCompare(String(a[field]));
      }
    });
    setFilteredData(sorted);
  };

  // Filter logic (example: filter by email domain)
  const filterByDomain = (domain) => {
    const filtered = users.filter((user) =>
      user.email && user.email.endsWith(domain)
    );
    setFilteredData(filtered);
  };

  const filterMenu = (
    <div style={{ padding: 8 }}>
      <Button
        size="small"
        style={{ width: '100%', marginBottom: 4 }}
        onClick={() => setFilteredData(users)}
      >
        All
      </Button>
      <Button
        size="small"
        style={{ width: '100%', marginBottom: 4 }}
        onClick={() => filterByDomain('@gmail.com')}
      >
        Gmail
      </Button>
      <Button
        size="small"
        style={{ width: '100%' }}
        onClick={() => filterByDomain('@yahoo.com')}
      >
        Yahoo
      </Button>
    </div>
  );

  const columns = [
    {
      title: (
        <span>
          Full Name
          <Button
            type="link"
            icon={sortField === 'fullName' && sortOrder === 'ascend' ? <SortAscendingOutlined /> : <SortDescendingOutlined />}
            onClick={() => handleSort('fullName')}
            style={{ marginLeft: 4, padding: 0 }}
          />
        </span>
      ),
      dataIndex: 'fullName',
      key: 'fullName',
      sorter: false,
      render: (text) => <span className="font-medium">{text}</span>,
    },
    {
      title: (
        <span>
          Email
          <Dropdown overlay={filterMenu} trigger={['click']}>
            <Button
              type="link"
              icon={<FilterOutlined />}
              style={{ marginLeft: 4, padding: 0 }}
            />
          </Dropdown>
          <Button
            type="link"
            icon={sortField === 'email' && sortOrder === 'ascend' ? <SortAscendingOutlined /> : <SortDescendingOutlined />}
            onClick={() => handleSort('email')}
            style={{ marginLeft: 2, padding: 0 }}
          />
        </span>
      ),
      dataIndex: 'email',
      key: 'email',
      sorter: false,
      render: (text) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: (
        <span>
          Phone Number
          <Button
            type="link"
            icon={sortField === 'phoneNumber' && sortOrder === 'ascend' ? <SortAscendingOutlined /> : <SortDescendingOutlined />}
            onClick={() => handleSort('phoneNumber')}
            style={{ marginLeft: 4, padding: 0 }}
          />
        </span>
      ),
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      sorter: false,
      render: (text) => <span>{text}</span>,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button
          type="primary"
          danger
          icon={<DeleteOutlined />}
          loading={deletingUserId === record._id}
          onClick={() => showDeleteConfirm(record._id)}
        >
          Delete
        </Button>
      ),
    },
  ];

  return (
    <>
      <AdminNavbar />
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
          <h2 className="text-xl font-semibold text-gray-800">User List</h2>
          <Space>
            <Input.Search
              placeholder="Search users..."
              allowClear
              enterButton={<SearchOutlined />}
              value={searchText}
              onChange={(e) => handleSearch(e.target.value)}
              style={{ width: 250 }}
            />
            <Button icon={<ReloadOutlined />} onClick={fetchUsers}>
              Refresh
            </Button>
          </Space>
        </div>

        <div className="overflow-x-auto bg-white rounded-xl border shadow">
          <Table
            columns={columns}
            dataSource={filteredData}
            rowKey="_id"
            loading={loading}
            pagination={{ pageSize: 10 }}
            bordered
            className="modern-table"
          />
        </div>
      </div>
      <style>{`
        .modern-table .ant-table-thead > tr > th {
          background: linear-gradient(90deg, #e0e7ff 0%, #f3e8ff 100%);
          font-weight: bold;
          font-size: 1rem;
        }
        .modern-table .ant-table-tbody > tr > td {
          font-size: 0.98rem;
        }
        .modern-table .ant-table-tbody > tr:hover > td {
          background: #f0f7ff;
        }
      `}</style>
    </>
  );
}

export default Users;
