import React, { useState, useEffect, useMemo } from 'react';
import { Table, Input, Space, Button, Modal, message, Tag } from 'antd';
import { SearchOutlined, DeleteOutlined, ReloadOutlined, SortAscendingOutlined, SortDescendingOutlined } from '@ant-design/icons';
import { getAllUsers, deleteUser } from '../../lib/api';
import AdminNavbar from '../Navbar/AdminNavbar';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchText, setSearchText] = useState('');
    
    // State for sorting
    const [sortOrder, setSortOrder] = useState(null);
    const [sortField, setSortField] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getAllUsers();
            if (response.success && Array.isArray(response.data)) {
                setUsers(response.data);
            } else {
                setError(response.error || 'Failed to fetch users');
                message.error(response.error || 'Failed to fetch users');
            }
        } catch (err) {
            setError('An error occurred while fetching users.');
            message.error('An error occurred while fetching users.');
            console.error('Error fetching users:', err);
        } finally {
            setLoading(false);
        }
    };

    const showDeleteConfirm = (user) => {
        Modal.confirm({
            title: `Are you sure you want to delete ${user.fullName}?`,
            content: 'This action cannot be undone.',
            okText: 'Yes, Delete',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk: () => handleDelete(user.id),
        });
    };

    const handleDelete = async (userId) => {
        try {
            // Note: deleteUser might need a token depending on your API setup
            await deleteUser(userId); 
            message.success('User deleted successfully');
            fetchUsers(); // Refresh the user list
        } catch (error) {
            message.error('Failed to delete user. Please try again.');
            console.error('Error deleting user:', error);
        }
    };

    // Combined filtering and sorting logic
    const processedData = useMemo(() => {
        let filtered = [...users];

        // Search filter
        if (searchText) {
            filtered = users.filter(user =>
                Object.values(user).some(value =>
                    String(value).toLowerCase().includes(searchText.toLowerCase())
                )
            );
        }

        // Sorting
        if (sortField && sortOrder) {
            filtered.sort((a, b) => {
                const aValue = a[sortField] || '';
                const bValue = b[sortField] || '';
                if (sortOrder === 'ascend') {
                    return String(aValue).localeCompare(String(bValue));
                }
                return String(bValue).localeCompare(String(aValue));
            });
        }

        return filtered;
    }, [users, searchText, sortField, sortOrder]);


    const handleSort = (field) => {
        const isAsc = sortField === field && sortOrder === 'ascend';
        setSortOrder(isAsc ? 'descend' : 'ascend');
        setSortField(field);
    };

    const columns = [
        {
            title: (
                <div onClick={() => handleSort('fullName')} style={{ cursor: 'pointer' }}>
                    Full Name 
                    {sortField === 'fullName' && (sortOrder === 'ascend' ? <SortAscendingOutlined /> : <SortDescendingOutlined />)}
                </div>
            ),
            dataIndex: 'fullName',
            key: 'fullName',
            render: (text) => <span className="font-medium">{text}</span>,
        },
        {
            title: (
                <div onClick={() => handleSort('email')} style={{ cursor: 'pointer' }}>
                    Email
                    {sortField === 'email' && (sortOrder === 'ascend' ? <SortAscendingOutlined /> : <SortDescendingOutlined />)}
                </div>
            ),
            dataIndex: 'email',
            key: 'email',
            render: (text) => <Tag color="blue">{text}</Tag>,
        },
        {
            title: (
                <div onClick={() => handleSort('phoneNumber')} style={{ cursor: 'pointer' }}>
                    Phone Number
                    {sortField === 'phoneNumber' && (sortOrder === 'ascend' ? <SortAscendingOutlined /> : <SortDescendingOutlined />)}
                </div>
            ),
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
        },
        {
            title: (
                <div onClick={() => handleSort('address')} style={{ cursor: 'pointer' }}>
                    Address
                    {sortField === 'address' && (sortOrder === 'ascend' ? <SortAscendingOutlined /> : <SortDescendingOutlined />)}
                </div>
            ),
            dataIndex: 'address',
            key: 'address',
            width: 300, // Assign a width to the column to help with layout
            render: (text) => (
                // This style allows the text to wrap within the cell
                <div style={{ wordWrap: 'break-word', wordBreak: 'break-word', whiteSpace: 'normal' }}>
                    {text || 'N/A'}
                </div>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            align: 'right',
            render: (_, record) => (
                <Button
                    type="primary"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => showDeleteConfirm(record)}
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
                    <h2 className="text-xl font-semibold text-gray-800">User Management ({processedData.length})</h2>
                    <Space>
                        <Input.Search
                            placeholder="Search users..."
                            allowClear
                            enterButton={<SearchOutlined />}
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            style={{ width: 250 }}
                        />
                        <Button icon={<ReloadOutlined />} onClick={fetchUsers} loading={loading}>
                            Refresh
                        </Button>
                    </Space>
                </div>
                
                {error && <Alert message={error} type="error" showIcon closable style={{ marginBottom: 16 }} />}

                <div className="overflow-x-auto bg-white rounded-xl border shadow">
                    <Table
                        columns={columns}
                        dataSource={processedData}
                        rowKey="id"
                        loading={loading}
                        pagination={{ pageSize: 10, showSizeChanger: true, pageSizeOptions: ['10', '20', '50'] }}
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
};

export default Users;
