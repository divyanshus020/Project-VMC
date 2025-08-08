import React, { useEffect, useState, useMemo } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Typography, Box, Alert, CircularProgress, Chip, Snackbar,
  TextField, InputAdornment, FormControl, InputLabel, Select, MenuItem, 
  TablePagination, Collapse, IconButton, Card, CardContent, Divider,
  Stack, Badge, Tooltip
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CategoryIcon from '@mui/icons-material/Category';
import InventoryIcon from '@mui/icons-material/Inventory';
import { getMyEnquiries, ENQUIRY_STATUS_LABELS, decodeToken } from '../lib/api';
import io from 'socket.io-client';

// Enhanced styled components with modern classic design
const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
  overflow: 'hidden',
  background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
  border: `1px solid ${alpha(theme.palette.primary.main, 0.08)}`,
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.MuiTableCell-head`]: {
    background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
    color: theme.palette.common.white,
    fontWeight: 600,
    fontSize: '0.875rem',
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
    borderBottom: 'none',
    padding: theme.spacing(2, 3),
  },
  [`&.MuiTableCell-body`]: {
    fontSize: '0.875rem',
    padding: theme.spacing(2, 3),
    borderBottom: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
    transition: 'all 0.2s ease',
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.04),
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
  },
  '&:nth-of-type(even)': {
    backgroundColor: alpha(theme.palette.action.hover, 0.3),
  },
  '& > *': {
    borderBottom: 'unset',
  },
}));

const StatusChip = styled(Chip)(({ theme, status }) => {
  const getStatusColors = (status) => {
    switch (status) {
      case 'approved':
        return { bg: theme.palette.success.light, color: theme.palette.success.dark };
      case 'rejected':
        return { bg: theme.palette.error.light, color: theme.palette.error.dark };
      case 'cancelled':
        return { bg: theme.palette.grey[300], color: theme.palette.grey[700] };
      default:
        return { bg: theme.palette.warning.light, color: theme.palette.warning.dark };
    }
  };

  const colors = getStatusColors(status);
  
  return {
    backgroundColor: colors.bg,
    color: colors.color,
    fontWeight: 600,
    fontSize: '0.75rem',
    textTransform: 'capitalize',
    borderRadius: theme.spacing(1),
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  };
});

const EnquiryIdChip = styled(Chip)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.primary.main, 0.1),
  color: theme.palette.primary.dark,
  fontWeight: 600,
  fontSize: '0.75rem',
  fontFamily: 'monospace',
  borderRadius: theme.spacing(1),
  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.15),
    cursor: 'pointer',
  },
}));

const HeaderCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  marginBottom: theme.spacing(3),
  borderRadius: theme.spacing(2),
  boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
}));

const FilterContainer = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)',
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  marginBottom: theme.spacing(3),
  border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
  boxShadow: '0 2px 16px rgba(0, 0, 0, 0.04)',
}));

// Helper function to format enquiry ID
const formatEnquiryId = (enquiryId) => {
  if (!enquiryId) return 'N/A';
  const idStr = String(enquiryId);
  return `#${idStr.slice(-6).padStart(6, '0')}`;
};

// Enhanced OrderRow component
const OrderRow = ({ row }) => {
  const [open, setOpen] = useState(false);

  if (!row.isGroup) {
    const order = row;
    return (
      <StyledTableRow>
        <StyledTableCell>
          <Tooltip title={`Full ID: ${order.enquiryID}`}>
            <EnquiryIdChip 
              label={formatEnquiryId(order.enquiryID)}
              icon={<ReceiptLongIcon fontSize="small" />}
              size="small"
            />
          </Tooltip>
        </StyledTableCell>
        <StyledTableCell>
          <Box display="flex" alignItems="center" gap={1}>
            <InventoryIcon fontSize="small" color="action" />
            <Typography variant="body2" fontWeight="medium">
              {order.productName}
            </Typography>
          </Box>
        </StyledTableCell>
        <StyledTableCell>
          <Box display="flex" alignItems="center" gap={1}>
            <CategoryIcon fontSize="small" color="action" />
            {order.category}
          </Box>
        </StyledTableCell>
        <StyledTableCell>{order.dieNo}</StyledTableCell>
        <StyledTableCell>
          <Badge badgeContent={order.quantity} color="primary" max={9999}>
            <Box width={20} height={20} />
          </Badge>
        </StyledTableCell>
        <StyledTableCell>
          <StatusChip label={order.status} status={order.status} size="small" />
        </StyledTableCell>
        <StyledTableCell>
          <Box display="flex" alignItems="center" gap={1}>
            <CalendarTodayIcon fontSize="small" color="action" />
            <Typography variant="body2">
              {new Date(order.createdAt).toLocaleString()}
            </Typography>
          </Box>
        </StyledTableCell>
      </StyledTableRow>
    );
  }

  // Enhanced group row rendering
  return (
    <>
      <StyledTableRow onClick={() => setOpen(!open)}>
        <StyledTableCell>
          <Stack direction="row" spacing={1} alignItems="center">
            <IconButton size="small" sx={{ color: 'primary.main' }}>
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
            <Tooltip title="Multiple items in this order">
              <EnquiryIdChip 
                label={`Group #${String(row.items[0]?.cartId || '').slice(-6)}`}
                icon={<ReceiptLongIcon fontSize="small" />}
                size="small"
              />
            </Tooltip>
          </Stack>
        </StyledTableCell>
        <StyledTableCell colSpan={2}>
          <Box display="flex" alignItems="center" gap={1}>
            <InventoryIcon color="primary" />
            <Typography variant="body1" fontWeight="600" color="primary.main">
              Multi-item Order ({row.items.length} items)
            </Typography>
          </Box>
        </StyledTableCell>
        <StyledTableCell>-</StyledTableCell>
        <StyledTableCell>
          <Badge badgeContent={row.items.reduce((sum, item) => sum + (item.quantity || 0), 0)} 
                 color="primary" max={9999}>
            <Box width={20} height={20} />
          </Badge>
        </StyledTableCell>
        <StyledTableCell>
          <StatusChip 
            label={row.overallStatus} 
            status={row.overallStatus} 
            size="small" 
          />
        </StyledTableCell>
        <StyledTableCell>
          <Box display="flex" alignItems="center" gap={1}>
            <CalendarTodayIcon fontSize="small" color="action" />
            {new Date(row.createdAt).toLocaleString()}
          </Box>
        </StyledTableCell>
      </StyledTableRow>
      
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={2}>
              <Typography variant="h6" gutterBottom component="div" color="primary">
                Items in this Order
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Enquiry ID</StyledTableCell>
                    <StyledTableCell>Product Name</StyledTableCell>
                    <StyledTableCell>Size Specs</StyledTableCell>
                    <StyledTableCell>Status</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.items.map((item) => (
                    <TableRow key={item.enquiryID}>
                      <TableCell>
                        <EnquiryIdChip 
                          label={formatEnquiryId(item.enquiryID)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">
                          {item.productName}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          Die: {item.dieNo}, Qty: {item.quantity}, Tunch: {item.tunch}%
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <StatusChip 
                          label={item.status} 
                          status={item.status} 
                          size="small" 
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

const Order = () => {
  const token = localStorage.getItem('userToken') || localStorage.getItem('token');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({ open: false, message: '' });
  
  // State for Filtering, Searching, and Pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Same useEffect logic as before...
  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        setError("Please log in to view your orders.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await getMyEnquiries(token);
        if (response.success && Array.isArray(response.data)) {
          setOrders(response.data);
          setError(null);
        } else {
          setError(response.error || "Failed to fetch orders.");
          setOrders([]);
        }
      } catch (err) {
        setError("An error occurred while fetching your orders.");
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // WebSocket Connection (same as before)
    if (token) {
      const socket = io('http://localhost:5000');
      socket.on('connect', () => {
        const userInfo = decodeToken(token);
        if (userInfo && (userInfo.id || userInfo.userId)) {
          socket.emit('joinUserRoom', userInfo.id || userInfo.userId);
        }
      });

      socket.on('enquiryStatusUpdated', (updatedEnquiry) => {
        setOrders(prevOrders =>
          prevOrders.map(order =>
            (order.enquiryID === updatedEnquiry.enquiryID) ? { ...order, ...updatedEnquiry } : order
          )
        );
        setNotification({
          open: true,
          message: `Order ${formatEnquiryId(updatedEnquiry.enquiryID)} is now ${updatedEnquiry.status}!`
        });
      });

      socket.on('disconnect', () => console.log('❌ Disconnected from WebSocket server.'));
      return () => socket.disconnect();
    }
  }, [token]);

  // Same grouping logic as before...
  const groupedOrders = useMemo(() => {
    const cartGroups = new Map();
    const singleOrders = [];

    orders.forEach(order => {
      if (order.cartId) {
        if (!cartGroups.has(order.cartId)) {
          cartGroups.set(order.cartId, {
            key: order.cartId,
            createdAt: order.createdAt,
            items: [],
            isGroup: true,
          });
        }
        cartGroups.get(order.cartId).items.push(order);
      } else {
        singleOrders.push({
          ...order,
          key: order.enquiryID,
          isGroup: false,
        });
      }
    });

    const processedGroups = Array.from(cartGroups.values()).map(group => {
      const statuses = new Set(group.items.map(i => i.status));
      let overallStatus = 'pending';
      if (statuses.size === 1) {
        overallStatus = statuses.values().next().value;
      } else {
        overallStatus = 'mixed';
      }
      return { ...group, overallStatus };
    });

    const combined = [...processedGroups, ...singleOrders];
    return combined.sort((a, b) => 
      new Date(b.createdAt || b.items[0].createdAt) - new Date(a.createdAt || a.items[0].createdAt)
    );
  }, [orders]);

  // Same filtering logic as before...
  const filteredOrders = useMemo(() => {
    return groupedOrders.filter(order => {
      const itemsToSearch = order.isGroup ? order.items : [order];
      const matchesStatus = statusFilter === 'all' || itemsToSearch.some(item => item.status === statusFilter);
      const searchTermLower = searchTerm.toLowerCase();
      const matchesSearch = !searchTerm || itemsToSearch.some(item =>
        (item.productName || '').toLowerCase().includes(searchTermLower) ||
        (item.category || '').toLowerCase().includes(searchTermLower) ||
        formatEnquiryId(item.enquiryID).toLowerCase().includes(searchTermLower)
      );
      return matchesStatus && matchesSearch;
    });
  }, [groupedOrders, searchTerm, statusFilter]);

  const handleCloseNotification = () => setNotification({ open: false, message: '' });
  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ ml: 2 }}>Loading your orders...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: '100%', margin: '0 auto' }}>
      {/* Enhanced Header */}
      <HeaderCard elevation={0}>
        <CardContent>
          <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
            📋 Your Orders
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9 }}>
            Track and manage your enquiries with our enhanced order management system
          </Typography>
        </CardContent>
      </HeaderCard>

      {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}
      {!token && <Alert severity="warning" sx={{ mb: 3, borderRadius: 2 }}>Please log in to view your orders.</Alert>}

      {/* Enhanced Filter Controls */}
      <FilterContainer>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
          <TextField
            placeholder="Search by product, category, or enquiry ID..."
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ 
              flexGrow: 1, 
              minWidth: '300px',
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
          
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>Filter by Status</InputLabel>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              label="Filter by Status"
              sx={{ borderRadius: 2 }}
            >
              <MenuItem value="all">All Statuses</MenuItem>
              {Object.entries(ENQUIRY_STATUS_LABELS).map(([key, label]) => (
                <MenuItem key={key} value={key}>{label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </FilterContainer>

      {filteredOrders.length === 0 && !loading ? (
        <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 2 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No matching orders found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your search or filter criteria.
          </Typography>
        </Paper>
      ) : (
        <StyledTableContainer component={Paper}>
          <Table sx={{ minWidth: 750 }}>
            <TableHead>
              <TableRow>
                <StyledTableCell>Enquiry ID</StyledTableCell>
                <StyledTableCell>Product</StyledTableCell>
                <StyledTableCell>Category</StyledTableCell>
                <StyledTableCell>Die No</StyledTableCell>
                <StyledTableCell>Quantity</StyledTableCell>
                <StyledTableCell>Status</StyledTableCell>
                <StyledTableCell>Date & Time</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(rowsPerPage > 0
                ? filteredOrders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                : filteredOrders
              ).map((row) => (
                <OrderRow key={row.key} row={row} />
              ))}
            </TableBody>
          </Table>
          
          <Divider />
          
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
            component="div"
            count={filteredOrders.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{
              borderTop: `1px solid ${alpha('#000', 0.05)}`,
              '& .MuiTablePagination-toolbar': {
                paddingLeft: 3,
                paddingRight: 2,
              }
            }}
          />
        </StyledTableContainer>
      )}

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        message={notification.message}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      />
    </Box>
  );
};

export default Order;
