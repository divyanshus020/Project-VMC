import React, { useState, useEffect } from 'react';
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
} from 'antd';
import { ReloadOutlined, CheckOutlined, CloseOutlined, DeleteOutlined } from '@ant-design/icons';
import {
    getAllEnquiries,
    getDetailedEnquiries,
    updateEnquiry,
    deleteEnquiry,
    getProducts,
    getAllUsers,
    getSizes
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

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('adminToken');
            if (!token) {
                message.error('Admin authentication required');
                return;
            }

            console.log('Fetching all data...');

            // Fetch all data concurrently
            const [enquiriesRes, productsRes, usersRes, sizesRes] = await Promise.all([
                fetchEnquiriesWithFallback(token),
                fetchProducts(),
                fetchUsers(),
                fetchSizes()
            ]);

            // Handle enquiries
            if (enquiriesRes.success) {
                const enquiriesData = Array.isArray(enquiriesRes.data) ? enquiriesRes.data : [];
                console.log('Enquiries fetched:', enquiriesData.length);
                setEnquiries(enquiriesData);
            } else {
                message.error(enquiriesRes.error || 'Failed to fetch enquiries');
                setEnquiries([]);
            }

            // Handle products
            if (productsRes.success) {
                const productsData = Array.isArray(productsRes.data) ? productsRes.data : [];
                console.log('Products fetched:', productsData.length);
                setProducts(productsData);
            } else {
                console.warn('Failed to fetch products:', productsRes.error);
                setProducts([]);
            }

            // Handle users
            if (usersRes.success) {
                const usersData = Array.isArray(usersRes.data) ? usersRes.data : [];
                console.log('Users fetched:', usersData.length);
                setUsers(usersData);
            } else {
                console.warn('Failed to fetch users:', usersRes.error);
                setUsers([]);
            }

            // Handle sizes
            if (sizesRes.success) {
                const sizesData = Array.isArray(sizesRes.data) ? sizesRes.data : [];
                console.log('Sizes fetched:', sizesData.length);
                setSizes(sizesData);
            } else {
                console.warn('Failed to fetch sizes:', sizesRes.error);
                setSizes([]);
            }

        } catch (err) {
            console.error('Error fetching data:', err);
            message.error('Error fetching data');
            setEnquiries([]);
            setProducts([]);
            setUsers([]);
            setSizes([]);
        } finally {
            setLoading(false);
        }
    };

    // Enhanced fetch functions with better error handling
    const fetchProducts = async () => {
        try {
            const response = await getProducts();
            console.log('Products API response:', response);

            if (response && response.data) {
                return {
                    success: true,
                    data: Array.isArray(response.data) ? response.data : [response.data]
                };
            } else if (Array.isArray(response)) {
                return {
                    success: true,
                    data: response
                };
            }

            return { success: false, error: 'Invalid products response format' };
        } catch (error) {
            console.error('Error fetching products:', error);
            return { success: false, error: error.message };
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await getAllUsers();
            console.log('Users API response:', response);

            if (response && response.data) {
                return {
                    success: true,
                    data: Array.isArray(response.data) ? response.data : [response.data]
                };
            } else if (Array.isArray(response)) {
                return {
                    success: true,
                    data: response
                };
            }

            return { success: false, error: 'Invalid users response format' };
        } catch (error) {
            console.error('Error fetching users:', error);
            return { success: false, error: error.message };
        }
    };

    const fetchSizes = async () => {
        try {
            const response = await getSizes();
            console.log('Sizes API response:', response);

            if (response && response.data) {
                return {
                    success: true,
                    data: Array.isArray(response.data) ? response.data : [response.data]
                };
            } else if (Array.isArray(response)) {
                return {
                    success: true,
                    data: response
                };
            }

            return { success: false, error: 'Invalid sizes response format' };
        } catch (error) {
            console.error('Error fetching sizes:', error);
            return { success: false, error: error.message };
        }
    };

    const fetchEnquiriesWithFallback = async (token) => {
        try {
            // First try to get detailed enquiries
            const detailedResponse = await getDetailedEnquiries(token);
            console.log('Detailed enquiries response:', detailedResponse);

            if (detailedResponse.success && detailedResponse.data) {
                return {
                    success: true,
                    data: Array.isArray(detailedResponse.data) ? detailedResponse.data : [detailedResponse.data]
                };
            }
        } catch (detailedError) {
            console.warn('Detailed enquiries failed, trying basic enquiries:', detailedError.message);
        }

        try {
            // Fallback to basic enquiries
            const basicResponse = await getAllEnquiries(token);
            console.log('Basic enquiries response:', basicResponse);

            if (basicResponse.success && basicResponse.data) {
                return {
                    success: true,
                    data: Array.isArray(basicResponse.data) ? basicResponse.data : [basicResponse.data]
                };
            }
        } catch (basicError) {
            console.error('Basic enquiries also failed:', basicError.message);
        }

        return { success: true, data: [] };
    };

    // Enhanced helper functions with better matching logic
    const getUserById = (userId) => {
        if (!userId || !Array.isArray(users) || users.length === 0) {
            console.log('getUserById: Invalid userId or users array', { userId, usersLength: users.length });
            return null;
        }

        // Try different ID formats
        const user = users.find(user =>
            user.id === userId ||
            user.id === String(userId) ||
            user._id === userId ||
            user._id === String(userId)
        );

        console.log('getUserById result:', { userId, found: !!user, userName: user?.fullName });
        return user || null;
    };

    const getProductById = (productId) => {
        if (!productId || !Array.isArray(products) || products.length === 0) {
            console.log('getProductById: Invalid productId or products array', { productId, productsLength: products.length });
            return null;
        }

        // Try different ID formats
        const product = products.find(product =>
            product.id === productId ||
            product.id === String(productId) ||
            product._id === productId ||
            product._id === String(productId)
        );

        console.log('getProductById result:', { productId, found: !!product, productName: product?.name });
        return product || null;
    };

    const getSizeById = (sizeId) => {
        if (!sizeId || !Array.isArray(sizes) || sizes.length === 0) {
            console.log('getSizeById: Invalid sizeId or sizes array', { sizeId, sizesLength: sizes.length });
            return null;
        }

        // Try different ID formats
        const size = sizes.find(size =>
            size.id === sizeId ||
            size.id === String(sizeId) ||
            size._id === sizeId ||
            size._id === String(sizeId)
        );

        console.log('getSizeById result:', { sizeId, found: !!size, sizeName: size?.name });
        return size || null;
    };

    // Enhanced enquiries with matched data
    const enhancedEnquiries = Array.isArray(enquiries) ? enquiries.map((enquiry, index) => {
        if (!enquiry) {
            console.log(`Enquiry ${index} is null/undefined`);
            return null;
        }

        console.log(`Processing enquiry ${index}:`, {
            enquiryID: enquiry.enquiryID, // Changed from id to enquiryID
            userID: enquiry.userID,
            productID: enquiry.productID,
            sizeID: enquiry.sizeID
        });

        const user = getUserById(enquiry.userID);
        const product = getProductById(enquiry.productID);
        const size = getSizeById(enquiry.sizeID);

        const enhanced = {
            ...enquiry,
            user: user || enquiry.user || { name: 'Unknown User', email: 'N/A', phoneNumber: 'N/A' },
            product: product || enquiry.product || { name: 'Unknown Product', category: 'N/A' },
            size: size || enquiry.size || { name: 'N/A', dieNo: 'N/A', weight: 'N/A', ballGauge: 'N/A', wireGauge: 'N/A' }
        };

        console.log(`Enhanced enquiry ${index}:`, {
            userName: enhanced.user.fullName,
            productName: enhanced.product.name,
            sizeName: enhanced.size.name
        });

        return enhanced;
    }).filter(Boolean) : [];

    // Enhanced handleStatusUpdate function with better error handling
   const handleStatusUpdate = async (enquiryID, status) => {
    try {
        console.log(`Attempting to update enquiry ${enquiryID} to status: ${status}`);

        setActionLoading((prev) => ({ ...prev, [enquiryID]: true }));
        const token = localStorage.getItem('adminToken');

        if (!token) {
            message.error('Authentication token not found. Please login again.');
            return;
        }

        if (!enquiryID) {
            message.error('Enquiry ID is missing');
            return;
        }

        // Ensure clean data object
        const updateData = {
            status: status || null,
            updatedAt: new Date().toISOString()
        };

        // Remove any undefined values
        Object.keys(updateData).forEach(key => {
            if (updateData[key] === undefined) {
                updateData[key] = null;
            }
        });

        console.log('Sending update data:', updateData);

        const res = await updateEnquiry(enquiryID, updateData, token);

        console.log('Update enquiry response:', res);

        if (res.success) {
            setEnquiries((prev) =>
                prev.map((enq) => (enq.enquiryID === enquiryID ? { ...enq, status, updatedAt: updateData.updatedAt } : enq))
            );
            message.success(`Enquiry ${status} successfully`);
        } else {
            console.error('Update failed:', res.error);
            message.error(res.error || `Failed to ${status} enquiry`);
        }
    } catch (err) {
        console.error('Error updating enquiry status:', err);
        message.error(`Error while updating to ${status}: ${err.message}`);
    } finally {
        setActionLoading((prev) => ({ ...prev, [enquiryID]: false }));
    }
};

    // Enhanced handleDelete function with better error handling
    const handleDelete = async (enquiryID) => {
        try {
            console.log(`Attempting to delete enquiry ${enquiryID}`);

            setActionLoading((prev) => ({ ...prev, [enquiryID]: true }));
            const token = localStorage.getItem('adminToken');

            if (!token) {
                message.error('Authentication token not found. Please login again.');
                return;
            }

            if (!enquiryID) {
                message.error('Enquiry ID is missing');
                return;
            }

            const res = await deleteEnquiry(enquiryID, token);

            console.log('Delete enquiry response:', res);

            if (res.success) {
                setEnquiries((prev) => prev.filter((e) => e.enquiryID !== enquiryID)); // Changed from id to enquiryID
                message.success('Enquiry deleted successfully');
            } else {
                console.error('Delete failed:', res.error);
                message.error(res.error || 'Failed to delete enquiry');
            }
        } catch (err) {
            console.error('Error deleting enquiry:', err);
            message.error(`Error deleting enquiry: ${err.message}`);
        } finally {
            setActionLoading((prev) => ({ ...prev, [enquiryID]: false }));
        }
    };

    // Enhanced filtering logic
    const filtered = enhancedEnquiries.filter((e) => {
        if (!e) return false;

        const query = searchTerm.toLowerCase();

        // Search matching with more comprehensive fields
        const matchSearch = !query || (
            e.user?.name?.toLowerCase().includes(query) ||
            e.product?.name?.toLowerCase().includes(query) ||
            e.product?.designName?.toLowerCase().includes(query) ||
            e.user?.phoneNumber?.includes(query) ||
            e.user?.email?.toLowerCase().includes(query) ||
            e.size?.name?.toLowerCase().includes(query) ||
            e.size?.dieNo?.toLowerCase().includes(query) ||
            e.size?.ballGauge?.toLowerCase().includes(query) ||
            e.size?.wireGauge?.toLowerCase().includes(query) ||
            String(e.quantity || '').includes(query) ||
            String(e.tunch || '').includes(query)
        );

        // Status filtering
        const matchStatus = statusFilter === 'all' || e.status === statusFilter;

        // Product filtering
        const matchProduct = productFilter === 'all' || String(e.productID) === productFilter;

        return matchSearch && matchStatus && matchProduct;
    });

    const columns = [
      {
    title: 'User Details',
    dataIndex: 'user',
    width: 200,
    render: (user, record) => (
        <div>
            <div><strong>{user?.fullName || 'Unknown User'}</strong></div>
            <div style={{ fontSize: '12px', color: '#888' }}>
                📧 {user?.email || 'N/A'}
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>
                📱 {user?.phoneNumber || 'N/A'}
            </div>
            <div style={{ fontSize: '10px', color: '#999' }}>
                Enquiry ID: {record.enquiryID || 'N/A'} {/* Changed from userID to enquiryID for clarity */}
            </div>
            <div style={{ fontSize: '10px', color: '#999' }}>
                User ID: {record.userID || 'N/A'}
            </div>
        </div>
    ),
},
        {
            title: 'Product Details',
            dataIndex: 'product',
            width: 200,
            render: (product, record) => (
                <div>
                    <div><strong>{product?.name || 'Unknown Product'}
                    </strong></div>

                    <div style={{ fontSize: '12px', color: '#666' }}>
                        📂 Category: {product?.category || 'N/A'}
                    </div>
                    <div style={{ fontSize: '10px', color: '#999' }}>
                        Product ID: {record.productID || 'N/A'}
                    </div>
                </div>
            ),
        },
        {
            title: 'Size Specifications',
            dataIndex: 'size',
            width: 220,
            render: (size, record) => (
                <div>
                    {/* <div><strong>Size:</strong> {size?.name || 'N/A'}</div> */}
                    <div style={{ fontSize: '12px', color: '#888' }}>
                        <strong>Die No:</strong> {size?.dieNo || 'N/A'}
                    </div>
                    <div style={{ fontSize: '12px', color: '#888' }}>
                        <strong>Weight:</strong> {size?.weight ? `${size.weight}g` : 'N/A'}
                    </div>
                    <div style={{ fontSize: '12px', color: '#888' }}>
                        <strong>Ball Gauge:</strong> {size?.ballGauge || size?.ball_gauge || 'N/A'}
                    </div>
                    <div style={{ fontSize: '12px', color: '#888' }}>
                        <strong>Wire Gauge:</strong> {size?.wireGauge || size?.wire_gauge || 'N/A'}
                    </div>
                    <div style={{ fontSize: '10px', color: '#999' }}>
                        Size ID: {record.sizeID || 'N/A'}
                    </div>
                </div>
            ),
        },
        {
            title: 'Order Details',
            dataIndex: 'orderDetails',
            width: 150,
            render: (_, record) => (
                <div>
                    <div><strong>Quantity:</strong> {record.quantity || 'N/A'}</div>
                    <div style={{ fontSize: '12px', color: '#888' }}>
                        <strong>Tunch:</strong> {record.tunch ? `${record.tunch}%` : 'N/A'}
                    </div>
                    <div style={{ fontSize: '12px', color: '#666' }}>
                        <strong>Date:</strong> {record.createdAt ? new Date(record.createdAt).toLocaleDateString() : 'N/A'}
                    </div>
                </div>
            ),
        },
        {
            title: 'Address',
            dataIndex: ['user', 'address'],
            width: 150,
            render: (address, record) => (
                <div style={{ fontSize: '12px' }}>
                    {address || record.user?.deliveryAddress || 'N/A'}
                </div>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            width: 100,
            render: (status) => {
                const colorMap = {
                    approved: 'green',
                    rejected: 'red',
                    pending: 'orange',
                };
                return <Tag color={colorMap[status] || 'default'}>{status || 'pending'}</Tag>;
            },
        },
        {
            title: 'Actions',
            dataIndex: 'actions',
            width: 200,
            fixed: 'right',
            render: (_, record) => (
                <Space direction="vertical" size="small">
                    {(!record.status || record.status === 'pending') && (
                        <Space>
                            <Button
                                type="primary"
                                icon={<CheckOutlined />}
                                size="small"
                                loading={actionLoading[record.enquiryID]} // Changed from id to enquiryID
                                onClick={() => handleStatusUpdate(record.enquiryID, 'approved')} // Changed from id to enquiryID
                            >
                                Approve
                            </Button>
                            <Button
                                danger
                                icon={<CloseOutlined />}
                                size="small"
                                loading={actionLoading[record.enquiryID]} // Changed from id to enquiryID
                                onClick={() => handleStatusUpdate(record.enquiryID, 'rejected')} // Changed from id to enquiryID
                            >
                                Reject
                            </Button>
                        </Space>
                    )}
                    <Popconfirm
                        title="Are you sure to delete this enquiry?"
                        onConfirm={() => handleDelete(record.enquiryID)} // Changed from id to enquiryID
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button
                            type="default"
                            icon={<DeleteOutlined />}
                            danger
                            size="small"
                            loading={actionLoading[record.enquiryID]} // Changed from id to enquiryID
                            block
                        >
                            Delete
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <>
            <AdminNavbar />
            <div style={{ padding: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <Title level={3}>Customer Enquiries ({filtered.length})</Title>
                    <Button icon={<ReloadOutlined />} onClick={fetchAllData} loading={loading} type="primary">
                        Refresh All Data
                    </Button>
                </div>

                <Space style={{ marginBottom: 16 }} wrap>
                    <Search
                        placeholder="Search by name, product, phone, email, size details..."
                        onChange={(e) => setSearchTerm(e.target.value)}
                        allowClear
                        style={{ width: 400 }}
                    />
                    <Select value={statusFilter} onChange={setStatusFilter} style={{ width: 150 }}>
                        <Option value="all">All Status</Option>
                        <Option value="pending">Pending</Option>
                        <Option value="approved">Approved</Option>
                        <Option value="rejected">Rejected</Option>
                    </Select>
                    <Select value={productFilter} onChange={setProductFilter} style={{ width: 200 }}>
                        <Option value="all">All Products</Option>
                        {products.map(product => (
                            <Option key={product.id || product._id} value={String(product.id || product._id)}>
                                {product.name || product.designName || 'Unnamed Product'}
                            </Option>
                        ))}
                    </Select>
                </Space>

                {/* Enhanced Data Summary */}
                <div style={{
                    marginBottom: 16,
                    padding: 16,
                    backgroundColor: '#f5f5f5',
                    borderRadius: 8,
                    border: '1px solid #d9d9d9'
                }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                        <div>
                            <strong>📋 Total Enquiries:</strong>
                            <span style={{ color: '#1890ff', marginLeft: 8 }}>{enquiries.length}</span>
                        </div>
                        <div>
                            <strong>🛍️ Products:</strong>
                            <span style={{ color: '#52c41a', marginLeft: 8 }}>{products.length}</span>
                        </div>
                        <div>
                            <strong>👥 Users:</strong>
                            <span style={{ color: '#722ed1', marginLeft: 8 }}>{users.length}</span>
                        </div>
                        <div>
                            <strong>📏 Sizes:</strong>
                            <span style={{ color: '#fa8c16', marginLeft: 8 }}>{sizes.length}</span>
                        </div>
                        <div>
                            <strong>🔍 Filtered Results:</strong>
                            <span style={{ color: '#eb2f96', marginLeft: 8 }}>{filtered.length}</span>
                        </div>
                    </div>

                    {/* Status breakdown */}
                    <div style={{ marginTop: 12, display: 'flex', gap: '15px' }}>
                        <span>
                            <Tag color="orange">Pending: {enhancedEnquiries.filter(e => !e.status || e.status === 'pending').length}</Tag>
                        </span>
                        <span>
                            <Tag color="green">Approved: {enhancedEnquiries.filter(e => e.status === 'approved').length}</Tag>
                        </span>
                        <span>
                            <Tag color="red">Rejected: {enhancedEnquiries.filter(e => e.status === 'rejected').length}</Tag>
                        </span>
                    </div>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: 50 }}>
                        <Spin size="large" tip="Loading enquiries and related data..." />
                        <div style={{ marginTop: 16, color: '#666' }}>
                            Fetching users, products, sizes, and enquiries...
                        </div>
                    </div>
                ) : enquiries.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: 50,
                        backgroundColor: '#fafafa',
                        borderRadius: 8,
                        border: '1px dashed #d9d9d9'
                    }}>
                        <div style={{ fontSize: '18px', color: '#666', marginBottom: 16 }}>
                            📭 No enquiries found
                        </div>
                        <div style={{ fontSize: '14px', color: '#999', marginBottom: 20 }}>
                            There are currently no customer enquiries to display.
                        </div>
                        <Button
                            type="primary"
                            icon={<ReloadOutlined />}
                            onClick={fetchAllData}
                            size="large"
                        >
                            Refresh Data
                        </Button>
                    </div>
                ) : (
                    <Table
                        columns={columns}
                        dataSource={filtered}
                        rowKey={(record) => record.enquiryID || record._id} // Changed from id to enquiryID
                        pagination={{
                            current: currentPage,
                            pageSize,
                            total: filtered.length,
                            onChange: setCurrentPage,
                            onShowSizeChange: (current, size) => setPageSize(size),
                            showSizeChanger: true,
                            showQuickJumper: true,
                            showTotal: (total, range) =>
                                `${range[0]}-${range[1]} of ${total} enquiries`,
                            pageSizeOptions: ['10', '20', '50', '100'],
                        }}
                        scroll={{ x: 1200 }}
                        size="middle"
                        bordered
                        rowClassName={(record, index) =>
                            index % 2 === 0 ? 'even-row' : 'odd-row'
                        }
                    />
                )}

            
            </div>

            <style jsx>{`
                .even-row {
                    background-color: #fafafa;
                }
                .odd-row {
                    background-color: #ffffff;
                }
                .ant-table-tbody > tr:hover > td {
                    background-color: #e6f7ff !important;
                }
            `}</style>
        </>
    );
};

export default AdminEnquery;
