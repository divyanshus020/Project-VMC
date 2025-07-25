import React, { useState, useEffect, useMemo } from 'react';
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
    CircularProgress,
    InputAdornment,
    alpha,
    styled,
    IconButton
} from '@mui/material';
import { Search, Clear } from '@mui/icons-material';
import { getSizes } from '../../lib/api';

const ITEMS_PER_PAGE = 10; // Number of items to show per page

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

const DieNoFilter = ({ selectedDieNo = 'All', setSelectedDieNo }) => {
    const [allDieNos, setAllDieNos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);

    useEffect(() => {
        const fetchAllDieNos = async () => {
            try {
                setLoading(true);
                const response = await getSizes();
                if (response.success && Array.isArray(response.data)) {
                    const uniqueDieNos = [...new Set(response.data.map(size => size.dieNo).filter(Boolean))];
                    uniqueDieNos.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
                    setAllDieNos(uniqueDieNos);
                }
            } catch (error) {
                console.error("Failed to fetch Die Numbers:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAllDieNos();
    }, []);

    const filteredDieNos = useMemo(() => {
        return allDieNos.filter(dieNo =>
            dieNo.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [allDieNos, searchTerm]);

    const pageCount = Math.ceil(filteredDieNos.length / ITEMS_PER_PAGE);
    const paginatedItems = filteredDieNos.slice(
        (page - 1) * ITEMS_PER_PAGE,
        page * ITEMS_PER_PAGE
    );

    const handlePageChange = (event, value) => {
        setPage(value);
    };
    
    const handleChange = (event) => {
        if (typeof setSelectedDieNo === 'function') {
            setSelectedDieNo(event.target.value);
        }
    };

    // Handles clearing the selection
    const handleClear = (event) => {
        event.stopPropagation(); // Prevent the dropdown from opening
        if (typeof setSelectedDieNo === 'function') {
            setSelectedDieNo('All');
        }
    };

    return (
        <StyledFormControl fullWidth variant="outlined">
            <InputLabel id="die-no-filter-label">Filter by Die No</InputLabel>
            <StyledSelect
                labelId="die-no-filter-label"
                id="die-no-filter"
                value={selectedDieNo}
                onChange={handleChange}
                label="Filter by Die No"
                disabled={loading}
                renderValue={(selected) => (
                    selected === 'All' 
                        ? <Typography variant="body2" sx={{ color: 'text.secondary' }}>All Die Nos</Typography>
                        : (
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                                <Chip size="small" label={selected} />
                                <IconButton
                                    aria-label="clear filter"
                                    size="small"
                                    onClick={handleClear}
                                    onMouseDown={(e) => e.stopPropagation()} // Prevents dropdown from opening
                                    sx={{
                                        visibility: selected === 'All' ? 'hidden' : 'visible',
                                        mr: -1,
                                    }}
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
                        placeholder="Search Die No..."
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

                {loading && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                        <CircularProgress size={24} />
                    </Box>
                )}

                <MenuItem value="All">
                    <em>All Die Nos</em>
                </MenuItem>
                {paginatedItems.map((dieNo) => (
                    <MenuItem 
                        key={dieNo} 
                        value={dieNo}
                        sx={{
                            borderRadius: '8px',
                            mx: 1,
                            '&:hover': {
                                backgroundColor: alpha('#D4AF37', 0.1),
                            },
                            '&.Mui-selected': {
                                fontWeight: 'bold',
                                color: 'primary.dark',
                                backgroundColor: alpha('#D4AF37', 0.2),
                            }
                        }}
                    >
                        {dieNo}
                    </MenuItem>
                ))}

                {!loading && filteredDieNos.length === 0 && (
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

export default DieNoFilter;
