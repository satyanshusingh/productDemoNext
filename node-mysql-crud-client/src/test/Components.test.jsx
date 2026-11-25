import { cleanup, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import DeleteProductDialog from '../components/DeleteProductDialog'
import NotificationSnackbar from '../components/NotificationSnackbar'
import ProductCatalog from '../components/ProductCatalog'
import ProductForm from '../components/ProductForm'
import ProductToolbar from '../components/ProductToolbar'
import ProductsTable from '../components/ProductsTable'

afterEach(cleanup)

const product = {
  id: 12,
  sku: 'MOU-001',
  name: 'Wireless Mouse',
  category: 'Accessories',
  price: '29.99',
  quantity: 4,
}

describe('ProductToolbar', () => {
  it('calls search and refresh handlers', async () => {
    const user = userEvent.setup()
    const onSearchChange = vi.fn()
    const onRefresh = vi.fn()

    render(
      <ProductToolbar
        productCount={1}
        search=""
        loading={false}
        onSearchChange={onSearchChange}
        onRefresh={onRefresh}
      />,
    )

    await user.type(screen.getByRole('textbox', { name: 'Search products' }), 'mouse')
    await user.click(screen.getByRole('button', { name: 'Refresh products' }))

    expect(onSearchChange).toHaveBeenCalled()
    expect(onRefresh).toHaveBeenCalledOnce()
  })
})

describe('ProductsTable', () => {
  it('renders a product and forwards edit and delete actions', async () => {
    const user = userEvent.setup()
    const onEdit = vi.fn()
    const onDelete = vi.fn()

    render(
      <ProductsTable
        products={[product]}
        loading={false}
        search=""
        loadError=""
        onAdd={vi.fn()}
        onEdit={onEdit}
        onDelete={onDelete}
      />,
    )

    expect(screen.getByText('Wireless Mouse')).toBeInTheDocument()
    expect(screen.getByText('MOU-001')).toBeInTheDocument()
    expect(screen.getByText('4 units')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Edit Wireless Mouse' }))
    await user.click(screen.getByRole('button', { name: 'Delete Wireless Mouse' }))

    expect(onEdit).toHaveBeenCalledWith(product)
    expect(onDelete).toHaveBeenCalledWith(product)
  })

  it('shows an empty-state add action', async () => {
    const user = userEvent.setup()
    const onAdd = vi.fn()

    render(
      <ProductsTable
        products={[]}
        loading={false}
        search=""
        loadError=""
        onAdd={onAdd}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Add your first product' }))
    expect(onAdd).toHaveBeenCalledOnce()
  })
})

describe('ProductForm', () => {
  it('does not render when closed', () => {
    const { container } = render(
      <ProductForm open={false} product={null} saving={false} onClose={vi.fn()} onSave={vi.fn()} />,
    )
    expect(container).toBeEmptyDOMElement()
  })

  it('validates required fields and submits a normalized payload', async () => {
    const user = userEvent.setup()
    const onSave = vi.fn()

    render(
      <ProductForm open product={null} saving={false} onClose={vi.fn()} onSave={onSave} />,
    )

    await user.click(screen.getByRole('button', { name: 'Add product' }))
    expect(await screen.findByText('SKU must be at least 3 characters')).toBeInTheDocument()

    await user.type(screen.getByRole('textbox', { name: 'SKU' }), 'KEY-001')
    await user.type(screen.getByRole('textbox', { name: 'Product name' }), 'Mechanical Keyboard')
    await user.type(screen.getByRole('textbox', { name: 'Category' }), 'Accessories')
    await user.type(screen.getByRole('spinbutton', { name: 'Price' }), '89.50')
    await user.type(screen.getByRole('spinbutton', { name: 'Quantity' }), '12')
    await user.click(screen.getByRole('button', { name: 'Add product' }))

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith({
        sku: 'KEY-001',
        name: 'Mechanical Keyboard',
        category: 'Accessories',
        price: '89.50',
        quantity: 12,
      })
    })
  })
})

describe('DeleteProductDialog', () => {
  it('shows the product name and forwards delete actions', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    const onConfirm = vi.fn()

    render(
      <DeleteProductDialog
        product={product}
        deleting={false}
        onClose={onClose}
        onConfirm={onConfirm}
      />,
    )

    expect(screen.getByRole('heading', { name: 'Delete product?' })).toBeInTheDocument()
    expect(screen.getByText('Wireless Mouse')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Cancel' }))
    await user.click(screen.getByRole('button', { name: 'Delete product' }))

    expect(onClose).toHaveBeenCalledOnce()
    expect(onConfirm).toHaveBeenCalledOnce()
  })
})

describe('NotificationSnackbar', () => {
  it('renders the notice and closes it', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()

    render(
      <NotificationSnackbar
        notice={{ message: 'Product added successfully.', severity: 'success' }}
        onClose={onClose}
      />,
    )

    expect(await screen.findByText('Product added successfully.')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Close' }))
    expect(onClose).toHaveBeenCalled()
  })
})

describe('ProductCatalog', () => {
  it('shows filtered footer text and calls pagination handlers', async () => {
    const user = userEvent.setup()
    const onPageChange = vi.fn()

    render(
      <ProductCatalog
        products={[product]}
        meta={{ total: 10, page: 1, limit: 8, pages: 2 }}
        page={1}
        loading={false}
        search=""
        loadError=""
        onSearchChange={vi.fn()}
        onPageChange={onPageChange}
        onRefresh={vi.fn()}
        onAdd={vi.fn()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    )

    expect(screen.getByText('Showing 1-8 of 10 products')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Go to page 2' }))
    expect(onPageChange).toHaveBeenCalledWith(2)
  })
})
