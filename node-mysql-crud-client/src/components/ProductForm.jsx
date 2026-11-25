import { useEffect } from 'react'
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { emptyProduct, productSchema, toProductPayload } from '../schemas/productSchema'

export default function ProductForm({ open, product, saving, onClose, onSave }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: emptyProduct,
  })

  useEffect(() => {
    if (!open) return

    reset(
      product
        ? {
            sku: product.sku,
            name: product.name,
            category: product.category,
            price: String(product.price),
            quantity: String(product.quantity),
          }
        : emptyProduct,
    )
  }, [product, reset, open])

  if (!open) return null

  const submit = (values) => onSave(toProductPayload(values))

  return (
    <Paper component="section" className="product-form-panel" elevation={0}>
      <Box component="form" onSubmit={handleSubmit(submit)} noValidate>
        <Box className="product-form-header">
          <Box>
            <Typography component="h2" className="product-form-title">
              {product ? 'Edit product' : 'Add a product'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {product ? 'Update the details below.' : 'Enter the details for your new product.'}
            </Typography>
          </Box>
          <IconButton
            aria-label="Close form"
            onClick={onClose}
            disabled={saving}
            size="small"
          >
            <CloseRoundedIcon fontSize="small" />
          </IconButton>
        </Box>

        <Box className="product-form-fields">
          <TextField
            {...register('name')}
            label="Product name"
            placeholder="e.g. Wireless Mouse"
            autoFocus
            fullWidth
            error={Boolean(errors.name)}
            helperText={errors.name?.message || ' '}
          />
          <TextField
            {...register('sku')}
            label="SKU"
            placeholder="e.g. MOU-001"
            fullWidth
            error={Boolean(errors.sku)}
            helperText={errors.sku?.message || ' '}
          />
          <TextField
            {...register('category')}
            label="Category"
            placeholder="e.g. Accessories"
            fullWidth
            error={Boolean(errors.category)}
            helperText={errors.category?.message || ' '}
          />
          <TextField
            {...register('price')}
            label="Price"
            placeholder="0.00"
            type="number"
            inputProps={{ min: 0, step: '0.01' }}
            fullWidth
            error={Boolean(errors.price)}
            helperText={errors.price?.message || ' '}
          />
          <TextField
            {...register('quantity')}
            label="Quantity"
            type="number"
            inputProps={{ min: 0, max: 1000000, step: 1 }}
            fullWidth
            error={Boolean(errors.quantity)}
            helperText={errors.quantity?.message || ' '}
          />
        </Box>

        <Stack direction="row" justifyContent="flex-end" spacing={1} className="product-form-actions">
          <Button onClick={onClose} color="inherit" disabled={saving}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={saving}
            startIcon={
              saving ? <CircularProgress size={16} color="inherit" /> : null
            }
          >
            {saving ? 'Saving…' : product ? 'Save changes' : 'Add product'}
          </Button>
        </Stack>
      </Box>
    </Paper>
  )
}
