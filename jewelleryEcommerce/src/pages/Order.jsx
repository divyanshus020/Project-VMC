import React, { useEffect, useState, useMemo } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Typography, Box, Alert, CircularProgress, Chip, Snackbar,
  TextField, InputAdornment, FormControl, InputLabel, Select, MenuItem, TablePagination,
  Collapse, IconButton
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
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
  // Hide the last border
  '& > *': {
    borderBottom: 'unset',
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

// A component for a single row, which can be a group or a single item
const OrderRow = ({ row }) => {
    const [open, setOpen] = useState(false);

    if (!row.isGroup) {
        // Render a simple row for single-item enquiries
        const order = row;
        return (
            <StyledTableRow>
                <StyledTableCell />
                <StyledTableCell component="th" scope="row">
                    <Typography variant="body2" fontWeight="bold">{order.productName}</Typography>
                </StyledTableCell>
                <StyledTableCell>{order.category}</StyledTableCell>
                <StyledTableCell>{order.dieNo}</StyledTableCell>
                <StyledTableCell>{order.quantity}</StyledTableCell>
                <StyledTableCell>
                    <StatusChip
                        label={ENQUIRY_STATUS_LABELS[order.status] || order.status}
                        status={order.status}
                        size="small"
                    />
                </StyledTableCell>
                <StyledTableCell>{new Date(order.createdAt).toLocaleString()}</StyledTableCell>
            </StyledTableRow>
        );
    }
    
    // Render an expandable row for multi-item enquiries
    return (
        <React.Fragment>
            <StyledTableRow>
                <TableCell>
                    <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <StyledTableCell component="th" scope="row">
                     <Typography variant="body2" fontWeight="bold">Multi-item Order</Typography>
                </StyledTableCell>
                <StyledTableCell colSpan={3}>
                    <Chip label={`${row.items.length} items`} size="small" />
                </StyledTableCell>
                 <StyledTableCell>
                    <StatusChip
                        label={ENQUIRY_STATUS_LABELS[row.overallStatus] || row.overallStatus}
                        status={row.overallStatus}
                        size="small"
                    />
                </StyledTableCell>
                <StyledTableCell>{new Date(row.createdAt).toLocaleString()}</StyledTableCell>
            </StyledTableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Typography variant="h6" gutterBottom component="div">
                                Items in this Order
                            </Typography>
                            <Table size="small" aria-label="purchases">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Product Name</TableCell>
                                        <TableCell>Size Specs</TableCell>
                                        <TableCell align="right">Status</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {row.items.map((item) => (
                                        <TableRow key={item.enquiryID}>
                                            <TableCell component="th" scope="row">{item.productName}</TableCell>
                                            <TableCell>
                                                Die: {item.dieNo}, Qty: {item.quantity}, Tunch: {item.tunch}%
                                            </TableCell>
                                            <TableCell align="right">
                                                <StatusChip
                                                    label={ENQUIRY_STATUS_LABELS[item.status] || item.status}
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
        </React.Fragment>
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
          message: `Order #${String(updatedEnquiry.enquiryID).slice(-6)} is now ${updatedEnquiry.status}!`
        });
      });

      socket.on('disconnect', () => console.log('❌ Disconnected from WebSocket server.'));
      return () => socket.disconnect();
    }
  }, [token]);

  // Group orders by cartId or createdAt timestamp
  const groupedOrders = useMemo(() => {
    const groups = new Map();
    orders.forEach(order => {
        const key = order.cartId || order.createdAt;
        if (!groups.has(key)) {
            groups.set(key, {
                key: key,
                createdAt: order.createdAt,
                items: [],
            });
        }
        groups.get(key).items.push(order);
    });
    
    return Array.from(groups.values()).map(group => {
        if (group.items.length === 1) {
            return { ...group.items[0], isGroup: false };
        } else {
            const statuses = new Set(group.items.map(i => i.status));
            let overallStatus = 'pending';
            if (statuses.size === 1) {
                overallStatus = statuses.values().next().value;
            } else {
                overallStatus = 'mixed';
            }
            return { ...group, isGroup: true, overallStatus };
        }
    }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [orders]);


  // Memoized filtered and searched orders
  const filteredOrders = useMemo(() => {
    return groupedOrders.filter(order => {
      const itemsToSearch = order.isGroup ? order.items : [order];
      
      const matchesStatus = statusFilter === 'all' || itemsToSearch.some(item => item.status === statusFilter);
      
      const searchTermLower = searchTerm.toLowerCase();
      const matchesSearch = !searchTerm || itemsToSearch.some(item => 
        (item.productName || '').toLowerCase().includes(searchTermLower) ||
        (item.category || '').toLowerCase().includes(searchTermLower)
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
            <Table aria-label="collapsible orders table">
              <TableHead>
                <TableRow>
                  <StyledTableCell />
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
