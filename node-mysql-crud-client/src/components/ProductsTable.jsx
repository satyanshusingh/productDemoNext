import {
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined'
import { formatCurrency, formatNumber } from '../utils/formatters'

function ProductRow({ product, onEdit, onDelete }) {
  const outOfStock = Number(product.quantity) === 0

  return (
    <TableRow hover>
      <TableCell>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Avatar className="product-avatar">
            <CategoryOutlinedIcon fontSize="small" />
          </Avatar>
          <Box>
            <Typography className="product-name">{product.name}</Typography>
            <Typography variant="caption" color="text.secondary">
              ID {product.id}
            </Typography>
          </Box>
        </Stack>
      </TableCell>
      <TableCell>
        <Typography className="sku-label">{product.sku}</Typography>
      </TableCell>
      <TableCell>{product.category}</TableCell>
      <TableCell align="right" className="price-cell">
        {formatCurrency(product.price)}
      </TableCell>
      <TableCell align="right">
        <Chip
          size="small"
          label={`${formatNumber(product.quantity)} units`}
          className={outOfStock ? 'stock-chip out-of-stock' : 'stock-chip'}
        />
      </TableCell>
      <TableCell align="right">
        <Stack direction="row" justifyContent="flex-end" spacing={0.5}>
          <IconButton
            aria-label={`Edit ${product.name}`}
            size="small"
            onClick={() => onEdit(product)}
          >
            <EditOutlinedIcon fontSize="small" />
          </IconButton>
          <IconButton
            aria-label={`Delete ${product.name}`}
            size="small"
            color="error"
            onClick={() => onDelete(product)}
          >
            <DeleteOutlineRoundedIcon fontSize="small" />
          </IconButton>
        </Stack>
      </TableCell>
    </TableRow>
  )
}

function TableState({ loading, search, loadError, onAdd }) {
  if (loading) {
    return (
      <TableRow>
        <TableCell colSpan={6} className="state-cell">
          <CircularProgress size={28} />
          <Typography color="text.secondary">Loading products…</Typography>
        </TableCell>
      </TableRow>
    )
  }

  const title = search
    ? 'No matching products'
    : loadError
      ? 'Products are unavailable'
      : 'Your catalog is empty'
  const description = search
    ? 'Try another product name or SKU.'
    : loadError
      ? 'Check that the backend is running, then try again.'
      : 'Add a product to get your inventory started.'

  return (
    <TableRow>
      <TableCell colSpan={6} className="state-cell empty-state">
        <Avatar className="empty-icon">
          <CategoryOutlinedIcon />
        </Avatar>
        <Typography className="empty-title">{title}</Typography>
        <Typography color="text.secondary" variant="body2">
          {description}
        </Typography>
        {!search && !loadError && (
          <Button startIcon={<AddRoundedIcon />} onClick={onAdd}>
            Add your first product
          </Button>
        )}
      </TableCell>
    </TableRow>
  )
}

export default function ProductsTable({
  products,
  loading,
  search,
  loadError,
  onAdd,
  onEdit,
  onDelete,
}) {
  return (
    <TableContainer className="table-scroll">
      <Table aria-label="Products">
        <TableHead>
          <TableRow>
            <TableCell>PRODUCT</TableCell>
            <TableCell>SKU</TableCell>
            <TableCell>CATEGORY</TableCell>
            <TableCell align="right">PRICE</TableCell>
            <TableCell align="right">IN STOCK</TableCell>
            <TableCell align="right">ACTIONS</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.length ? (
            products.map((product) => (
              <ProductRow
                key={product.id}
                product={product}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))
          ) : (
            <TableState
              loading={loading}
              search={search}
              loadError={loadError}
              onAdd={onAdd}
            />
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
