import React, { useState, useMemo } from 'react';
import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Chip,
    Box,
    TextField,
    Typography,
    Pagination,
    InputAdornment,
    alpha,
    styled,
    IconButton
} from '@mui/material';
import { Search, Clear } from '@mui/icons-material';

const ITEMS_PER_PAGE = 10;

// --- Styled Components for a Modern Look ---
const StyledFormControl = styled(FormControl)(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
        borderRadius: '12px',
        transition: theme.transitions.create(['border-color', 'box-shadow']),
        '&.Mui-focused': {
            boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.25)}`,
            borderColor: theme.palette.primary.main,
        },
        '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.primary.light,
        },
    },
    '& .MuiInputLabel-root': {
        fontWeight: 500,
    },
}));

const StyledSelect = styled(Select)(({ theme }) => ({
    '.MuiSelect-select .MuiChip-root': {
        backgroundColor: alpha(theme.palette.primary.main, 0.1),
        color: theme.palette.primary.dark,
        fontWeight: 'bold',
    },
}));

const CategoryFilter = ({ selectedCategory = 'All', setSelectedCategory, categories = [] }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);

    const filteredCategories = useMemo(() => {
        // Exclude 'All' from filtering logic, as it's a special option
        const filterableCategories = categories.filter(cat => cat !== 'All');
        return filterableCategories.filter(cat =>
            cat.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [categories, searchTerm]);

    const pageCount = Math.ceil(filteredCategories.length / ITEMS_PER_PAGE);
    const paginatedItems = filteredCategories.slice(
        (page - 1) * ITEMS_PER_PAGE,
        page * ITEMS_PER_PAGE
    );

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    const handleChange = (event) => {
        if (typeof setSelectedCategory === 'function') {
            setSelectedCategory(event.target.value);
        }
    };

    const handleClear = (event) => {
        event.stopPropagation();
        if (typeof setSelectedCategory === 'function') {
            setSelectedCategory('All');
        }
    };

    return (
        <StyledFormControl fullWidth variant="outlined">
            <InputLabel id="category-filter-label">Filter by Category</InputLabel>
            <StyledSelect
                labelId="category-filter-label"
                id="category-filter"
                value={selectedCategory}
                onChange={handleChange}
                label="Filter by Category"
                renderValue={(selected) => (
                    selected === 'All'
                        ? <Typography variant="body2" sx={{ color: 'text.secondary' }}>All Categories</Typography>
                        : (
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                                <Chip size="small" label={selected} />
                                <IconButton
                                    aria-label="clear filter"
                                    size="small"
                                    onClick={handleClear}
                                    onMouseDown={(e) => e.stopPropagation()}
                                    sx={{ visibility: selected === 'All' ? 'hidden' : 'visible', mr: -1 }}
                                >
                                    <Clear fontSize="small" />
                                </IconButton>
                            </Box>
                        )
                )}
                MenuProps={{
                    PaperProps: {
                        sx: {
                            borderRadius: '12px',
                            border: '1px solid rgba(0, 0, 0, 0.05)',
                            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.08)',
                            backdropFilter: 'blur(10px)',
                            backgroundColor: 'rgba(255, 255, 255, 0.8)',
                            maxHeight: 400,
                            width: 280
                        },
                    },
                }}
            >
                <Box p={2} onKeyDown={(e) => e.stopPropagation()}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        size="small"
                        placeholder="Search Category..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setPage(1);
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search color="action" />
                                </InputAdornment>
                            ),
                            sx: { borderRadius: '8px' }
                        }}
                    />
                </Box>

                <MenuItem value="All">
                    <em>All Categories</em>
                </MenuItem>
                {paginatedItems.map((cat) => (
                    <MenuItem
                        key={cat}
                        value={cat}
                        sx={{
                            borderRadius: '8px',
                            mx: 1,
                            '&:hover': { backgroundColor: alpha('#D4AF37', 0.1) },
                            '&.Mui-selected': {
                                fontWeight: 'bold',
                                color: 'primary.dark',
                                backgroundColor: alpha('#D4AF37', 0.2),
                            }
                        }}
                    >
                        {cat}
                    </MenuItem>
                ))}

                {filteredCategories.length === 0 && (
                    <Typography variant="body2" color="textSecondary" align="center" p={2}>
                        No results found.
                    </Typography>
                )}

                {pageCount > 1 && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 1, mt: 1, borderTop: 1, borderColor: 'divider' }}>
                        <Pagination
                            count={pageCount}
                            page={page}
                            onChange={handlePageChange}
                            size="small"
                            color="primary"
                        />
                    </Box>
                )}
            </StyledSelect>
        </StyledFormControl>
    );
};

export default CategoryFilter;
