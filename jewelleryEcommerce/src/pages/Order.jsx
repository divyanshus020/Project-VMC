import React, { useEffect, useState, useMemo } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Typography, Box, Alert, CircularProgress, Chip, Snackbar,
  TextField, InputAdornment, FormControl, InputLabel, Select, MenuItem, TablePagination
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import { getMyEnquiries, ENQUIRY_STATUS_LABELS, decodeToken } from '../lib/api';
import io from 'socket.io-client';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.MuiTableCell-head`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    fontWeight: 'bold',
  },
  [`&.MuiTableCell-body`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const StatusChip = styled(Chip)(({ theme, status }) => ({
  backgroundColor:
    status === 'approved' ? theme.palette.success.light :
    status === 'rejected' ? theme.palette.error.light :
    status === 'cancelled' ? theme.palette.grey[500] :
    theme.palette.warning.light,
  color: theme.palette.getContrastText(
    status === 'approved' ? theme.palette.success.light :
    status === 'rejected' ? theme.palette.error.light :
    status === 'cancelled' ? theme.palette.grey[500] :
    theme.palette.warning.light
  ),
  fontWeight: 'bold',
}));

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

  useEffect(() => {
    // 1. Initial Data Fetching
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
          setOrders(response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
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

    // 2. WebSocket Connection
    if (token) {
      const socket = io('http://localhost:5000');
      socket.on('connect', () => {
        console.log('✅ Connected to WebSocket server with ID:', socket.id);
        const userInfo = decodeToken(token);
        if (userInfo && (userInfo.id || userInfo.userId)) {
          socket.emit('joinUserRoom', userInfo.id || userInfo.userId);
        }
      });

      socket.on('enquiryStatusUpdated', (updatedEnquiry) => {
        console.log('✅ Real-time update received:', updatedEnquiry);
        setOrders(prevOrders =>
          prevOrders.map(order =>
            (order.enquiryID === updatedEnquiry.enquiryID) ? updatedEnquiry : order
          )
        );
        setNotification({
          open: true,
          message: `Order #${String(updatedEnquiry.enquiryID).slice(-6)} is now ${updatedEnquiry.status}!`
        });
      });

      socket.on('disconnect', () => console.log('❌ Disconnected from WebSocket server.'));
      return () => socket.disconnect();
    }
  }, [token]);

  // Memoized filtered and searched orders
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      const searchTermLower = searchTerm.toLowerCase();
      const matchesSearch = !searchTerm ||
        (String(order.enquiryID) || '').toLowerCase().includes(searchTermLower) ||
        (order.productName || order.product?.name || '').toLowerCase().includes(searchTermLower) ||
        (order.category || order.product?.category || '').toLowerCase().includes(searchTermLower);
      return matchesStatus && matchesSearch;
    });
  }, [orders, searchTerm, statusFilter]);

  const handleCloseNotification = () => setNotification({ open: false, message: '' });
  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  const formatValue = (value) => value || 'N/A';
  const getOrderId = (order) => order.enquiryID || 'N/A';

  if (loading) {
    return (
      <Box sx={{ p: 4, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ ml: 2 }}>Loading your orders...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Typography variant="h4" component="h1" gutterBottom>Your Orders</Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {!token && <Alert severity="warning" sx={{ mb: 2 }}>Please log in to view your orders.</Alert>}

      {/* Filter and Search Controls */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2, mb: 3 }}>
        <TextField
          label="Search Orders"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ flexGrow: 1, minWidth: '250px' }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <FormControl variant="outlined" sx={{ minWidth: 180 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            label="Status"
          >
            <MenuItem value="all">All Statuses</MenuItem>
            {Object.entries(ENQUIRY_STATUS_LABELS).map(([key, label]) => (
              <MenuItem key={key} value={key}>{label}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {filteredOrders.length === 0 && !loading ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" color="textSecondary">No matching orders found</Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            Try adjusting your search or filter.
          </Typography>
        </Box>
      ) : (
        <Paper sx={{ mt: 2, overflow: 'hidden' }}>
          <TableContainer>
            <Table sx={{ minWidth: 700 }} aria-label="orders table">
              <TableHead>
                <TableRow>
                  <StyledTableCell>Order ID</StyledTableCell>
                  <StyledTableCell>Product Name</StyledTableCell>
                  <StyledTableCell>Category</StyledTableCell>
                  <StyledTableCell>Die No</StyledTableCell>
                  <StyledTableCell>Weight</StyledTableCell>
                  <StyledTableCell>Quantity</StyledTableCell>
                  <StyledTableCell>Status</StyledTableCell>
                  <StyledTableCell>Created</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(rowsPerPage > 0
                  ? filteredOrders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  : filteredOrders
                ).map((order) => {
                  const orderId = getOrderId(order);
                  return (
                    <StyledTableRow key={orderId}>
                      <StyledTableCell component="th" scope="row">
                        <Typography variant="body2" fontWeight="bold">#{orderId}</Typography>
                      </StyledTableCell>
                      <StyledTableCell>{formatValue(order.productName || order.product?.name)}</StyledTableCell>
                      <StyledTableCell>{formatValue(order.category || order.product?.category)}</StyledTableCell>
                      <StyledTableCell>{formatValue(order.dieNo || order.die?.dieNo)}</StyledTableCell>
                      <StyledTableCell>{formatValue(order.weight || order.size?.weight)}</StyledTableCell>
                      <StyledTableCell>
                        <Typography variant="body2" fontWeight="bold">{formatValue(order.quantity)}</Typography>
                      </StyledTableCell>
                      <StyledTableCell>
                        <StatusChip
                          label={ENQUIRY_STATUS_LABELS[order.status] || order.status || 'Pending'}
                          status={order.status || 'pending'}
                          size="small"
                        />
                      </StyledTableCell>
                      <StyledTableCell>
                        <Typography variant="body2" color="textSecondary">
                          {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                        </Typography>
                      </StyledTableCell>
                    </StyledTableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
            component="div"
            count={filteredOrders.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      )}

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseNotification} severity="success" sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Order;
