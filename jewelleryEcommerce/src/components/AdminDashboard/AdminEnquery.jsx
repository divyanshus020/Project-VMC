import React, { useState, useEffect, useMemo } from 'react';
import {
    Table,
    Tag,
    Input,
    Select,
    Button,
    Space,
    Spin,
    Popconfirm,
    message,
    Typography,
    Alert,
} from 'antd';
import { ReloadOutlined, CheckOutlined, CloseOutlined, DeleteOutlined, LoginOutlined } from '@ant-design/icons';
import {
    getAllEnquiries,
    getDetailedEnquiries,
    updateEnquiry,
    deleteEnquiry,
    getProducts,
    getAllUsers,
    getSizes,
    isTokenValid,
    getAuthToken,
} from '../../lib/api';
import AdminNavbar from '../Navbar/AdminNavbar';

const { Search } = Input;
const { Option } = Select;
const { Title } = Typography;

const AdminEnquery = () => {
    const [enquiries, setEnquiries] = useState([]);
    const [products, setProducts] = useState([]);
    const [users, setUsers] = useState([]);
    const [sizes, setSizes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [productFilter, setProductFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [actionLoading, setActionLoading] = useState({});
    const [authError, setAuthError] = useState(false);

    useEffect(() => {
        const checkAuth = () => {
            const token = getAuthToken('admin');
            if (!token || !isTokenValid(token)) {
                setAuthError(true);
                setLoading(false);
                return false;
            }
            setAuthError(false);
            return true;
        };

        if (checkAuth()) {
            fetchAllData();
        }
    }, []);

    const fetchAllData = async () => {
        try {
            setLoading(true);
            const token = getAuthToken('admin');
            if (!token || !isTokenValid(token)) {
                setAuthError(true);
                return;
            }

            const [enquiriesRes, productsRes, usersRes, sizesRes] = await Promise.all([
                getDetailedEnquiries(token),
                getProducts(),
                getAllUsers(),
                getSizes()
            ]);

            setEnquiries(enquiriesRes.success ? enquiriesRes.data : []);
            setProducts(productsRes.success ? productsRes.data : []);
            setUsers(usersRes.success ? usersRes.data : []);
            setSizes(sizesRes.success ? sizesRes.data : []);

            if (!enquiriesRes.success) throw new Error(enquiriesRes.error);

        } catch (err) {
            if (String(err.message).includes('401') || String(err.message).includes('Unauthorized')) {
                setAuthError(true);
            } else {
                message.error('Error fetching data: ' + err.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const enhancedEnquiries = useMemo(() => 
        Array.isArray(enquiries) ? enquiries.map(enquiry => {
            if (!enquiry) return null;
            return {
                ...enquiry,
                user: users.find(u => u.id == enquiry.userID) || { fullName: 'Unknown' },
                product: products.find(p => p.id == enquiry.productID) || { name: 'Unknown' },
                size: sizes.find(s => s.id == enquiry.sizeID) || { dieNo: 'N/A' },
            };
        }).filter(Boolean) : []
    , [enquiries, users, products, sizes]);

    const handleStatusUpdate = async (enquiryID, status) => {
        setActionLoading(prev => ({ ...prev, [enquiryID]: true }));
        try {
            const token = getAuthToken('admin');
            const enquiryToUpdate = enhancedEnquiries.find(e => e.enquiryID === enquiryID);
            const updateData = { ...enquiryToUpdate, status, updatedAt: new Date().toISOString() };
            const res = await updateEnquiry(enquiryID, updateData, token);
            if (res.success) {
                message.success(`Enquiry ${status} successfully`);
                fetchAllData(); // Re-fetch to ensure data consistency
            } else {
                throw new Error(res.error);
            }
        } catch (err) {
            message.error(`Failed to update status: ${err.message}`);
        } finally {
            setActionLoading(prev => ({ ...prev, [enquiryID]: false }));
        }
    };

    const handleDelete = async (enquiryID) => {
        setActionLoading(prev => ({ ...prev, [enquiryID]: true }));
        try {
            const token = getAuthToken('admin');
            const res = await deleteEnquiry(enquiryID, token);
            if (res.success) {
                message.success('Enquiry deleted successfully');
                fetchAllData(); // Re-fetch for data consistency
            } else {
                throw new Error(res.error);
            }
        } catch (err) {
            message.error(`Failed to delete enquiry: ${err.message}`);
        } finally {
            setActionLoading(prev => ({ ...prev, [enquiryID]: false }));
        }
    };

    const filtered = useMemo(() => 
        enhancedEnquiries.filter((e) => {
            if (!e) return false;
            const query = searchTerm.toLowerCase();

            const matchSearch = !query || (
                e.user?.fullName?.toLowerCase().includes(query) ||
                e.product?.name?.toLowerCase().includes(query) ||
                e.user?.phoneNumber?.includes(query) ||
                e.user?.email?.toLowerCase().includes(query) ||
                String(e.size?.dieNo || '').toLowerCase().includes(query) ||
                String(e.size?.ballGauge || '').toLowerCase().includes(query) ||
                String(e.size?.wireGauge || '').toLowerCase().includes(query) ||
                String(e.quantity || '').includes(query) ||
                String(e.tunch || '').includes(query)
            );

            const matchStatus = statusFilter === 'all' || e.status === statusFilter;
            const matchProduct = productFilter === 'all' || String(e.productID) === productFilter;
            return matchSearch && matchStatus && matchProduct;
        })
    , [enhancedEnquiries, searchTerm, statusFilter, productFilter]);
    
    const columns = [
        {
            title: 'User Details',
            dataIndex: 'user',
            width: 200,
            render: (user, record) => (
                <div>
                    <div><strong>{user?.fullName || 'Unknown User'}</strong></div>
                    <div style={{ fontSize: '12px', color: '#888' }}>📧 {user?.email || 'N/A'}</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>📱 {user?.phoneNumber || 'N/A'}</div>
                    <div style={{ fontSize: '10px', color: '#999' }}>Enquiry ID: {record.enquiryID || 'N/A'}</div>
                </div>
            ),
        },
        {
            title: 'Product Details',
            dataIndex: 'product',
            width: 200,
            render: (product, record) => (
                <div>
                    <div><strong>{product?.name || 'Unknown Product'}</strong></div>
                    <div style={{ fontSize: '12px', color: '#666' }}>📂 Category: {product?.category || 'N/A'}</div>
                    <div style={{ fontSize: '10px', color: '#999' }}>Product ID: {record.productID || 'N/A'}</div>
                </div>
            ),
        },
        {
            title: 'Size Specifications',
            dataIndex: 'size',
            width: 220,
            render: (size) => (
                <div>
                    <div style={{ fontSize: '12px', color: '#888' }}><strong>Die No:</strong> {size?.dieNo || 'N/A'}</div>
                    <div style={{ fontSize: '12px', color: '#888' }}><strong>Weight:</strong> {size?.weight ? `${size.weight}g` : 'N/A'}</div>
                    <div style={{ fontSize: '12px', color: '#888' }}><strong>Ball Gauge:</strong> {size?.ballGauge || 'N/A'}</div>
                    <div style={{ fontSize: '12px', color: '#888' }}><strong>Wire Gauge:</strong> {size?.wireGauge || 'N/A'}</div>
                </div>
            ),
        },
        {
            title: 'Order Details',
            width: 150,
            render: (_, record) => (
                <div>
                    <div><strong>Quantity:</strong> {record.quantity || 'N/A'}</div>
                    <div style={{ fontSize: '12px', color: '#888' }}><strong>Tunch:</strong> {record.tunch ? `${record.tunch}%` : 'N/A'}</div>
                    <div style={{ fontSize: '12px', color: '#666' }}><strong>Date:</strong> {record.createdAt ? new Date(record.createdAt).toLocaleDateString() : 'N/A'}</div>
                </div>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            width: 100,
            render: (status) => {
                const colorMap = { approved: 'green', rejected: 'red', pending: 'orange', cancelled: 'gray' };
                return <Tag color={colorMap[status] || 'default'}>{status || 'pending'}</Tag>;
            },
        },
        {
            title: 'Actions',
            width: 200,
            fixed: 'right',
            render: (_, record) => (
                <Space direction="vertical" size="small">
                    {(!record.status || record.status === 'pending') && (
                        <Space>
                            <Button type="primary" icon={<CheckOutlined />} size="small" loading={actionLoading[record.enquiryID]} onClick={() => handleStatusUpdate(record.enquiryID, 'approved')}>Approve</Button>
                            <Button danger icon={<CloseOutlined />} size="small" loading={actionLoading[record.enquiryID]} onClick={() => handleStatusUpdate(record.enquiryID, 'rejected')}>Reject</Button>
                        </Space>
                    )}
                    <Popconfirm title="Are you sure?" onConfirm={() => handleDelete(record.enquiryID)}>
                        <Button type="default" icon={<DeleteOutlined />} danger size="small" loading={actionLoading[record.enquiryID]} block>Delete</Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    if (authError) {
        return (
            <>
                <AdminNavbar />
                <div style={{ padding: 20 }}>
                    <Alert
                        message="Authentication Required"
                        description="Please login as an admin to continue."
                        type="error"
                        showIcon
                        action={<Button type="primary" icon={<LoginOutlined />} onClick={() => window.location.href = '/admin/login'}>Login</Button>}
                    />
                </div>
            </>
        );
    }

    return (
        <>
            <AdminNavbar />
            <div style={{ padding: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <Title level={3}>Customer Enquiries ({filtered.length})</Title>
                    <Button icon={<ReloadOutlined />} onClick={fetchAllData} loading={loading}>Refresh</Button>
                </div>

                <Space style={{ marginBottom: 16 }} wrap>
                    <Search
                        placeholder="Search anything..."
                        onChange={(e) => setSearchTerm(e.target.value)}
                        allowClear
                        style={{ width: 400 }}
                    />
                    <Select value={statusFilter} onChange={setStatusFilter} style={{ width: 150 }}>
                        <Option value="all">All Status</Option>
                        <Option value="pending">Pending</Option>
                        <Option value="approved">Approved</Option>
                        <Option value="rejected">Rejected</Option>
                        <Option value="cancelled">Cancelled</Option>
                    </Select>
                    <Select value={productFilter} onChange={setProductFilter} style={{ width: 200 }} showSearch optionFilterProp="children">
                        <Option value="all">All Products</Option>
                        {products.map(product => (
                            <Option key={product.id} value={String(product.id)}>{product.name}</Option>
                        ))}
                    </Select>
                </Space>

                {/* Data Summary Dashboard */}
                <div style={{ marginBottom: 16, padding: 16, backgroundColor: '#f5f5f5', borderRadius: 8, border: '1px solid #d9d9d9' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'center' }}>
                        <div><strong>Total Enquiries:</strong> <Tag color="blue">{enquiries.length}</Tag></div>
                        <div><strong>Pending:</strong> <Tag color="orange">{enhancedEnquiries.filter(e => e.status === 'pending').length}</Tag></div>
                        <div><strong>Approved:</strong> <Tag color="green">{enhancedEnquiries.filter(e => e.status === 'approved').length}</Tag></div>
                        <div><strong>Rejected:</strong> <Tag color="red">{enhancedEnquiries.filter(e => e.status === 'rejected').length}</Tag></div>
                    </div>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: 50 }}><Spin size="large" /></div>
                ) : (
                    <Table
                        columns={columns}
                        dataSource={filtered}
                        rowKey="enquiryID"
                        pagination={{ current: currentPage, pageSize, total: filtered.length, onChange: setCurrentPage, onShowSizeChange: (c, s) => setPageSize(s) }}
                        scroll={{ x: 1200 }}
                    />
                )}
            </div>
        </>
    );
};

export default AdminEnquery;
