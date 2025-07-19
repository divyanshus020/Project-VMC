import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Chip,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { getMyEnquiries, ENQUIRY_STATUS_LABELS } from '../lib/api';

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
    status === 'pending' ? theme.palette.warning.light :
    status === 'approved' ? theme.palette.success.light :
    status === 'rejected' ? theme.palette.error.light :
    theme.palette.grey[300],
  color: 
    status === 'pending' ? theme.palette.warning.contrastText :
    status === 'approved' ? theme.palette.success.contrastText :
    status === 'rejected' ? theme.palette.error.contrastText :
    theme.palette.text.primary,
}));

const Order = () => {
  // Use userToken instead of token for consistency with api.js
  const token = localStorage.getItem('userToken') || localStorage.getItem('token');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  console.log("Fetching orders with token:", token ? 'Token present' : 'No token');

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        setError("Please log in to view your orders.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log("🔄 Fetching user enquiries...");
        
        const response = await getMyEnquiries(token);
        console.log("📋 My Enquiries API response:", response);

        if (response.success && Array.isArray(response.data)) {
          console.log("✅ Enquiry Data:", response.data);
          setOrders(response.data);
          setError(null);
        } else if (Array.isArray(response.data)) {
          // Handle direct array response
          console.log("✅ Direct array response:", response.data);
          setOrders(response.data);
          setError(null);
        } else {
          console.error("❌ Error fetching enquiries:", response.error);
          setError(response.error || "Failed to fetch orders.");
          setOrders([]);
        }
      } catch (err) {
        console.error("💥 Exception fetching enquiries:", err);
        setError("Failed to fetch orders. Please try again.");
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const formatValue = (value) => {
    return value || 'N/A';
  };

  const getOrderId = (order) => {
    return order._id || order.enquiryID || 'N/A';
  };

  if (loading) {
    return (
      <Box sx={{ p: 4, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ ml: 2 }}>
          Loading your orders...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Your Orders
      </Typography>

      {successMessage && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {successMessage}
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {!token && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Please log in to view your orders.
        </Alert>
      )}

      {orders.length === 0 && !loading && !error ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" color="textSecondary">
            No orders found
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            You haven't placed any orders yet.
          </Typography>
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
                      <Typography variant="body2" fontWeight="bold">
                        #{orderId}
                      </Typography>
                    </StyledTableCell>
                    <StyledTableCell>
                      {formatValue(order.productName || order.product?.name)}
                    </StyledTableCell>
                    <StyledTableCell>
                      {formatValue(order.category || order.product?.category)}
                    </StyledTableCell>
                    <StyledTableCell>
                      {formatValue(order.dieNo || order.die?.dieNo)}
                    </StyledTableCell>
                    <StyledTableCell>
                      {formatValue(order.diameter || order.size?.diameter)}
                    </StyledTableCell>
                    <StyledTableCell>
                      {formatValue(order.ballGauge || order.size?.ballGauge)}
                    </StyledTableCell>
                    <StyledTableCell>
                      {formatValue(order.wireGauge || order.size?.wireGauge)}
                    </StyledTableCell>
                    <StyledTableCell>
                      {formatValue(order.weight || order.size?.weight)}
                    </StyledTableCell>
                    <StyledTableCell>
                      {formatValue(order.tunch)}
                    </StyledTableCell>
                    <StyledTableCell>
                      <Typography variant="body2" fontWeight="bold">
                        {formatValue(order.quantity)}
                      </Typography>
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
    </Box>
  );
};

export default Order;
