import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Typography, Box, Alert, CircularProgress, Chip, Snackbar
} from '@mui/material';
import { styled } from '@mui/material/styles';
// Make sure decodeToken is exported from your api.js file
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

      socket.on('disconnect', () => {
        console.log('❌ Disconnected from WebSocket server.');
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [token]);

  const handleCloseNotification = () => {
    setNotification({ open: false, message: '' });
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

      {orders.length === 0 && !loading && !error ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" color="textSecondary">No orders found</Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>You haven't placed any orders yet.</Typography>
        </Box>
      ) : (
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table sx={{ minWidth: 700 }} aria-label="orders table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Order ID</StyledTableCell>
                <StyledTableCell>Product Name</StyledTableCell>
                <StyledTableCell>Category</StyledTableCell>
                <StyledTableCell>Die No</StyledTableCell>
                <StyledTableCell>Diameter</StyledTableCell>
                <StyledTableCell>Ball Gauge</StyledTableCell>
                <StyledTableCell>Wire Gauge</StyledTableCell>
                <StyledTableCell>Weight</StyledTableCell>
                <StyledTableCell>Tunch</StyledTableCell>
                <StyledTableCell>Quantity</StyledTableCell>
                <StyledTableCell>Status</StyledTableCell>
                <StyledTableCell>Created</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => {
                const orderId = getOrderId(order);
                return (
                  <StyledTableRow key={orderId}>
                    <StyledTableCell component="th" scope="row">
                      <Typography variant="body2" fontWeight="bold">#{orderId}</Typography>
                    </StyledTableCell>
                    <StyledTableCell>{formatValue(order.productName || order.product?.name)}</StyledTableCell>
                    <StyledTableCell>{formatValue(order.category || order.product?.category)}</StyledTableCell>
                    <StyledTableCell>{formatValue(order.dieNo || order.die?.dieNo)}</StyledTableCell>
                    <StyledTableCell>{formatValue(order.diameter || order.size?.diameter)}</StyledTableCell>
                    <StyledTableCell>{formatValue(order.ballGauge || order.size?.ballGauge)}</StyledTableCell>
                    <StyledTableCell>{formatValue(order.wireGauge || order.size?.wireGauge)}</StyledTableCell>
                    <StyledTableCell>{formatValue(order.weight || order.size?.weight)}</StyledTableCell>
                    <StyledTableCell>{formatValue(order.tunch)}</StyledTableCell>
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
