const PRODUCTS_ENDPOINT = '/api/products'

async function request(path = '', options) {
  const response = await fetch(`${PRODUCTS_ENDPOINT}${path}`, {
    ...options,
    headers: {
      ...(options?.body ? { 'Content-Type': 'application/json' } : {}),
      ...options?.headers,
    },
  })

  const responseBody = await response.text()
  const data = responseBody ? JSON.parse(responseBody) : null

  if (!response.ok) {
    throw new Error(data?.message || 'The request could not be completed.')
  }

  return data
}

export function getProducts({ page = 1, limit = 8, search = '' } = {}) {
  const query = new URLSearchParams({ page, limit, search })
  return request(`?${query}`)
}

export function createProduct(product) {
  return request('', {
    method: 'POST',
    body: JSON.stringify(product),
  })
}

export function updateProduct(id, product) {
  return request(`/${id}`, {
    method: 'PUT',
    body: JSON.stringify(product),
  })
}

export function deleteProduct(id) {
  return request(`/${id}`, { method: 'DELETE' })
}
