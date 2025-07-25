import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    TextField,
    Paper,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Avatar,
    Typography,
    CircularProgress,
    InputAdornment,
    alpha,
    MenuItem,
} from '@mui/material';
import { Search } from '@mui/icons-material';
import { getProducts } from '../../lib/api';

const SearchBar = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const navigate = useNavigate();
    const searchContainerRef = useRef(null);

    // Fetch all products once when the component mounts
    useEffect(() => {
        const fetchAllProducts = async () => {
            setLoading(true);
            try {
                const response = await getProducts();
                if (response.success && Array.isArray(response.data)) {
                    setProducts(response.data);
                }
            } catch (error) {
                console.error("Failed to fetch products for search:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAllProducts();
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Filter products based on search term
    const filteredProducts = useMemo(() => {
        if (!searchTerm) {
            return [];
        }
        const lowercasedTerm = searchTerm.toLowerCase();
        return products.filter(product =>
            product.name.toLowerCase().includes(lowercasedTerm) ||
            product.category.toLowerCase().includes(lowercasedTerm) ||
            product.sizes?.some(size => size.dieNo?.toLowerCase().includes(lowercasedTerm))
        ).slice(0, 5); // Limit to top 5 results
    }, [searchTerm, products]);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        setIsDropdownOpen(!!event.target.value);
    };

    const handleResultClick = (productId) => {
        setSearchTerm('');
        setIsDropdownOpen(false);
        navigate(`/products/${productId}`);
    };

    return (
        <Box 
            ref={searchContainerRef}
            sx={{ 
                position: 'relative', 
                width: { xs: '100%', md: 350 },
                mx: 2
            }}
        >
            <TextField
                fullWidth
                variant="outlined"
                size="small"
                placeholder="Search products, categories, or Die No..."
                value={searchTerm}
                onChange={handleSearchChange}
                onFocus={() => setIsDropdownOpen(!!searchTerm)}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <Search color="action" />
                        </InputAdornment>
                    ),
                    sx: {
                        borderRadius: '50px',
                        backgroundColor: '#f5f5f5',
                        '& .MuiOutlinedInput-notchedOutline': {
                            border: 'none',
                        },
                        '&.Mui-focused': {
                            boxShadow: `0 0 0 2px ${alpha('#D4AF37', 0.5)}`,
                        },
                    },
                }}
            />
            {isDropdownOpen && (
                <Paper
                    elevation={4}
                    sx={{
                        position: 'absolute',
                        top: '110%',
                        left: 0,
                        right: 0,
                        zIndex: 1300,
                        borderRadius: '12px',
                        overflow: 'hidden',
                        backdropFilter: 'blur(10px)',
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    }}
                >
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                            <CircularProgress size={24} />
                        </Box>
                    ) : filteredProducts.length > 0 ? (
                        <List disablePadding>
                            {filteredProducts.map((product) => (
                                <MenuItem 
                                    key={product.id} 
                                    onClick={() => handleResultClick(product.id)}
                                    sx={{ '&:hover': { backgroundColor: alpha('#D4AF37', 0.1) }}}
                                >
                                    <ListItemAvatar>
                                        <Avatar 
                                            variant="rounded"
                                            src={product.imageUrl || 'https://placehold.co/40x40/e2e8f0/e2e8f0?text=.'} 
                                            alt={product.name} 
                                        />
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={product.name}
                                        secondary={`Category: ${product.category}`}
                                    />
                                </MenuItem>
                            ))}
                        </List>
                    ) : (
                        <Typography variant="body2" color="textSecondary" align="center" p={3}>
                            No products found for "{searchTerm}"
                        </Typography>
                    )}
                </Paper>
            )}
        </Box>
    );
};

export default SearchBar;
