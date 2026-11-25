import { z } from 'zod'

export const emptyProduct = {
  sku: '',
  name: '',
  category: '',
  price: '',
  quantity: '',
}

export const productSchema = z.object({
  sku: z
    .string()
    .trim()
    .min(3, 'SKU must be at least 3 characters')
    .max(30, 'SKU must be 30 characters or fewer')
    .regex(/^[A-Za-z0-9_-]+$/, 'Use letters, numbers, hyphens, or underscores'),
  name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(120, 'Name must be 120 characters or fewer'),
  category: z
    .string()
    .trim()
    .min(2, 'Category must be at least 2 characters')
    .max(60, 'Category must be 60 characters or fewer'),
  price: z
    .string()
    .trim()
    .regex(/^(?:0|[1-9]\d{0,7})(?:\.\d{1,2})?$/, 'Enter a valid price (up to 2 decimals)')
    .refine((value) => Number(value) <= 99999999.99, 'Price is too high'),
  quantity: z
    .string()
    .trim()
    .regex(/^(?:0|[1-9]\d*)$/, 'Quantity must be a whole number')
    .refine((value) => Number(value) <= 1000000, 'Quantity cannot exceed 1,000,000'),
})

export function toProductPayload(values) {
  return {
    sku: values.sku.trim(),
    name: values.name.trim(),
    category: values.category.trim(),
    price: Number(values.price).toFixed(2),
    quantity: Number(values.quantity),
  }
}
