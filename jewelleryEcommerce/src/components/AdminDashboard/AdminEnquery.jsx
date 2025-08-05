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
    Divider,
} from 'antd';
import { ReloadOutlined, CheckOutlined, CloseOutlined, DeleteOutlined, LoginOutlined } from '@ant-design/icons';
import {
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
const { Title, Text } = Typography;

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
            if (!token) { setAuthError(true); return; }

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

    // This hook now creates a mixed list of single items and multi-item "cart" groups.
    const tableDataSource = useMemo(() => {
        const transactionGroups = new Map();

        // Group enquiries by a composite key of userID and the exact creation timestamp.
        enhancedEnquiries.forEach(enquiry => {
            const groupKey = `${enquiry.userID}-${enquiry.createdAt}`;

            if (!transactionGroups.has(groupKey)) {
                transactionGroups.set(groupKey, {
                    key: groupKey,
                    user: enquiry.user,
                    items: [],
                    lastActivity: enquiry.createdAt,
                });
            }
            transactionGroups.get(groupKey).items.push(enquiry);
        });

        const processedData = [];
        transactionGroups.forEach(group => {
            // If a group only has one item, treat it as a single enquiry.
            if (group.items.length === 1) {
                const singleItem = group.items[0];
                processedData.push({
                    ...singleItem,
                    key: singleItem.enquiryID, // Use the unique enquiryID as the key
                    isGroup: false,
                });
            } else {
                // Otherwise, it's a multi-item cart that should be expandable.
                processedData.push({
                    ...group,
                    isGroup: true,
                });
            }
        });
        
        return processedData.sort((a, b) => new Date(b.lastActivity) - new Date(a.lastActivity));

    }, [enhancedEnquiries]);

    const handleStatusUpdate = async (enquiryID, status) => {
        setActionLoading(prev => ({ ...prev, [enquiryID]: true }));
        try {
            const token = getAuthToken('admin');
            const res = await updateEnquiry(enquiryID, { status }, token);
            if (res.success) {
                message.success(`Enquiry item status updated to ${status}.`);
                fetchAllData();
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
                message.success('Enquiry item deleted successfully');
                fetchAllData();
            } else {
                throw new Error(res.error);
            }
        } catch (err) {
            message.error(`Failed to delete enquiry: ${err.message}`);
        } finally {
            setActionLoading(prev => ({ ...prev, [enquiryID]: false }));
        }
    };
    
    // Filtering logic now works on the mixed data source.
    const filteredData = useMemo(() => 
        tableDataSource.filter((record) => {
            const query = searchTerm.toLowerCase();
            
            const itemsToSearch = record.isGroup ? record.items : [record];

            const matchSearch = !query ||
                record.user?.fullName?.toLowerCase().includes(query) ||
                record.user?.email?.toLowerCase().includes(query) ||
                record.user?.phoneNumber?.includes(query) ||
                itemsToSearch.some(item => 
                    item.product?.name?.toLowerCase().includes(query) ||
                    String(item.size?.dieNo || '').toLowerCase().includes(query)
                );

            // A record is included if it matches the search term AND has at least one item
            // that satisfies all other active filters (status and product).
            const hasMatchingItem = itemsToSearch.some(item => {
                const matchStatus = statusFilter === 'all' || item.status === statusFilter;
                const matchProduct = productFilter === 'all' || String(item.productID) === productFilter;
                return matchStatus && matchProduct;
            });
            
            return matchSearch && hasMatchingItem;
        })
    , [tableDataSource, searchTerm, statusFilter, productFilter]);
    
    const getStatusTag = (status) => {
      const colorMap = { approved: 'green', rejected: 'red', pending: 'orange', cancelled: 'gray', mixed: 'geekblue' };
      return <Tag color={colorMap[status] || 'default'}>{status || 'pending'}</Tag>;
    };

    // Columns for the nested table (for multi-item carts)
    const nestedColumns = [
        {
            title: 'Product Details',
            render: (_, item) => (
                <div>
                    <Text strong>{item.product?.name}</Text>
                    <br />
                    <Text type="secondary" copyable style={{ fontSize: 10 }}>ID: {item.enquiryID}</Text>
                </div>
            )
        },
        {
            title: 'Size & Specs',
            render: (_, item) => (
                <div style={{fontSize: 12}}>
                    <Text type="secondary"><strong>Die:</strong> {item.size?.dieNo || 'N/A'}, <strong>Qty:</strong> {item.quantity}</Text><br/>
                    <Text type="secondary"><strong>Weight:</strong> {item.size?.weight || 'N/A'}g</Text><br/>
                    <Text type="secondary"><strong>Ball:</strong> {item.size?.ballGauge || 'N/A'}</Text><br/>
                    <Text type="secondary"><strong>Wire:</strong> {item.size?.wireGauge || 'N/A'}</Text><br/>
                    <Text type="secondary"><strong>Tunch:</strong> {item.tunch || 'N/A'}%</Text>
                </div>
            )
        },
        {
            title: 'Status',
            dataIndex: 'status',
            render: (status) => getStatusTag(status),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, item) => (
                <Space>
                    {item.status === 'pending' ? (
                        <>
                            <Button title="Approve" size="small" type="primary" icon={<CheckOutlined />} onClick={() => handleStatusUpdate(item.enquiryID, 'approved')} loading={actionLoading[item.enquiryID]} />
                            <Button title="Reject" size="small" danger icon={<CloseOutlined />} onClick={() => handleStatusUpdate(item.enquiryID, 'rejected')} loading={actionLoading[item.enquiryID]} />
                        </>
                    ) : (
                        <Button title="Revert to Pending" size="small" onClick={() => handleStatusUpdate(item.enquiryID, 'pending')} loading={actionLoading[item.enquiryID]}>Revert</Button>
                    )}
                    <Popconfirm title="Delete this item?" onConfirm={() => handleDelete(item.enquiryID)}>
                        <Button title="Delete" size="small" type="text" danger icon={<DeleteOutlined />} loading={actionLoading[item.enquiryID]} />
                    </Popconfirm>
                </Space>
            )
        }
    ];

    // Main columns now render differently for groups vs. single items.
    const mainColumns = [
        {
            title: 'Customer',
            dataIndex: 'user',
            render: (user) => (
                <div>
                    <Text strong>{user?.fullName || 'Unknown User'}</Text>
                    <br />
                    <Text type="secondary">{user?.email || 'N/A'}</Text>
                    <br />
                    <Text type="secondary">📱 {user?.phoneNumber || 'N/A'}</Text>
                </div>
            ),
        },
        {
            title: 'Enquiry Details',
            render: (_, record) => {
                if (record.isGroup) {
                    return <Tag color="blue">{record.items.length} items in cart</Tag>;
                }
                // Render details directly for single items
                return (
                     <div>
                        <Text strong>{record.product?.name}</Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: 12 }}>
                            Die: {record.size?.dieNo}, Qty: {record.quantity}, Tunch: {record.tunch}%
                        </Text>
                        <br/>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                            Weight: {record.size?.weight}g, Ball: {record.size?.ballGauge}, Wire: {record.size?.wireGauge}
                        </Text>
                    </div>
                );
            }
        },
        {
            title: 'Status',
            render: (_, record) => {
                let status;
                if (record.isGroup) {
                    const statuses = new Set(record.items.map(i => i.status));
                    if (statuses.size === 1) {
                        status = statuses.values().next().value;
                    } else {
                        status = 'mixed';
                    }
                } else {
                    status = record.status;
                }
                return getStatusTag(status);
            }
        },
        {
            title: 'Date & Time',
            dataIndex: 'lastActivity',
            render: (date) => (
                <div>
                    <Text>{new Date(date).toLocaleDateString()}</Text>
                    <br />
                    <Text type="secondary">{new Date(date).toLocaleTimeString()}</Text>
                </div>
            ),
            sorter: (a, b) => new Date(a.lastActivity) - new Date(b.lastActivity),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => {
                // Only show actions here for single items. Group actions are in the dropdown.
                if (record.isGroup) {
                    return <Text type="secondary">Expand for actions</Text>; 
                }
                const item = record;
                return (
                    <Space>
                        {item.status === 'pending' ? (
                            <>
                                <Button title="Approve" size="small" type="primary" icon={<CheckOutlined />} onClick={() => handleStatusUpdate(item.enquiryID, 'approved')} loading={actionLoading[item.enquiryID]} />
                                <Button title="Reject" size="small" danger icon={<CloseOutlined />} onClick={() => handleStatusUpdate(item.enquiryID, 'rejected')} loading={actionLoading[item.enquiryID]} />
                            </>
                        ) : (
                            <Button title="Revert to Pending" size="small" onClick={() => handleStatusUpdate(item.enquiryID, 'pending')} loading={actionLoading[item.enquiryID]}>Revert</Button>
                        )}
                        <Popconfirm title="Delete this item?" onConfirm={() => handleDelete(item.enquiryID)}>
                            <Button title="Delete" size="small" type="text" danger icon={<DeleteOutlined />} loading={actionLoading[item.enquiryID]} />
                        </Popconfirm>
                    </Space>
                );
            }
        }
    ];

    if (authError) {
        return (
            <>
                <AdminNavbar />
                <div style={{ padding: 20 }}>
                    <Alert message="Authentication Required" description="Please login as an admin to continue." type="error" showIcon action={<Button type="primary" icon={<LoginOutlined />} onClick={() => window.location.href = '/admin/login'}>Login</Button>} />
                </div>
            </>
        );
    }

    return (
        <>
            <AdminNavbar />
            <div style={{ padding: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <Title level={3}>Customer Enquiries ({filteredData.length} Events)</Title>
                    <Button icon={<ReloadOutlined />} onClick={fetchAllData} loading={loading}>Refresh</Button>
                </div>

                <Space style={{ marginBottom: 16 }} wrap>
                    <Search placeholder="Search customer or product..." onChange={(e) => setSearchTerm(e.target.value)} allowClear style={{ width: 400 }} />
                    <Select value={statusFilter} onChange={setStatusFilter} style={{ width: 150 }}>
                        <Option value="all">All Status</Option>
                        <Option value="pending">Pending</Option>
                        <Option value="approved">Approved</Option>
                        <Option value="rejected">Rejected</Option>
                    </Select>
                    <Select value={productFilter} onChange={setProductFilter} style={{ width: 200 }} showSearch optionFilterProp="children" placeholder="Filter by product">
                        <Option value="all">All Products</Option>
                        {products.map(product => (<Option key={product.id} value={String(product.id)}>{product.name}</Option>))}
                    </Select>
                </Space>
                
                {loading ? (
                    <div style={{ textAlign: 'center', padding: 50 }}><Spin size="large" /></div>
                ) : (
                    <Table
                        columns={mainColumns}
                        dataSource={filteredData}
                        rowKey="key"
                        expandable={{
                            expandedRowRender: record => (
                                <Table 
                                    columns={nestedColumns} 
                                    dataSource={record.items} 
                                    pagination={false} 
                                    rowKey="enquiryID" 
                                    size="small" 
                                />
                            ),
                            // Only show the expand icon for actual groups (multi-item carts).
                            rowExpandable: record => record.isGroup,
                        }}
                        pagination={{ 
                            current: currentPage, 
                            pageSize, 
                            total: filteredData.length, 
                            onChange: setCurrentPage, 
                            onShowSizeChange: (c, s) => setPageSize(s),
                            showSizeChanger: true,
                        }}
                        scroll={{ x: 1000 }}
                    />
                )}
            </div>
        </>
    );
};

export default AdminEnquery;
