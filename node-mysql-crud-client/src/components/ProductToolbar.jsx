import {
  Box,
  CircularProgress,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'

export default function ProductToolbar({ productCount, search, loading, onSearchChange, onRefresh }) {
  return (
    <Box className="catalog-toolbar">
      <Box>
        <Typography variant="h6" className="section-title">
          Product list
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {productCount} {productCount === 1 ? 'product' : 'products'} in your catalog
        </Typography>
      </Box>
      <Stack direction="row" spacing={1.25} className="toolbar-actions">
        <TextField
          size="small"
          placeholder="Search name or SKU..."
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          className="search-field"
          slotProps={{
            htmlInput: { 'aria-label': 'Search products' },
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRoundedIcon fontSize="small" />
                </InputAdornment>
              ),
            },
          }}
        />
        <IconButton aria-label="Refresh products" onClick={onRefresh} disabled={loading}>
          {loading ? <CircularProgress size={20} /> : <RefreshRoundedIcon />}
        </IconButton>
      </Stack>
    </Box>
  )
}
