import { Alert, Box, Button, Pagination, Paper, Typography } from '@mui/material'
import ProductToolbar from './ProductToolbar'
import ProductsTable from './ProductsTable'

export default function ProductCatalog({
  products,
  meta,
  page,
  loading,
  search,
  loadError,
  onSearchChange,
  onPageChange,
  onRefresh,
  onAdd,
  onEdit,
  onDelete,
}) {
  return (
    <Paper className="catalog-card" elevation={0}>
      <ProductToolbar
        productCount={meta.total}
        search={search}
        loading={loading}
        onSearchChange={onSearchChange}
        onRefresh={onRefresh}
      />

      {loadError && (
        <Alert
          severity="error"
          className="load-alert"
          action={
            <Button color="inherit" size="small" onClick={onRefresh}>
              Try again
            </Button>
          }
        >
          Could not load products: {loadError}
        </Alert>
      )}

      <ProductsTable
        products={products}
        loading={loading}
        search={search}
        loadError={loadError}
        onAdd={onAdd}
        onEdit={onEdit}
        onDelete={onDelete}
      />

      <Box className="table-footer">
        <Typography variant="caption" color="text.secondary">
          {meta.total === 0
            ? 'Showing 0 products'
            : `Showing ${(page - 1) * meta.limit + 1}-${Math.min(page * meta.limit, meta.total)} of ${meta.total} products`}
        </Typography>
        {meta.pages > 1 && (
          <Pagination
            count={meta.pages}
            page={page}
            onChange={(_, selectedPage) => onPageChange(selectedPage)}
            disabled={loading}
            size="small"
            color="primary"
            aria-label="Product pages"
          />
        )}
      </Box>
    </Paper>
  )
}
