const API_URL = ''; // Internal calls from SPA to Express stay on the same domain

export async function fetchProducts() {
  const response = await fetch(`${API_URL}/api/products`);
  if (!response.ok) throw new Error('Failed to fetch products');
  return response.json();
}

export async function fetchProductById(id: string | number) {
  const response = await fetch(`${API_URL}/api/products/${id}`);
  if (!response.ok) throw new Error('Product not found');
  return response.json();
}

export async function fetchCategories() {
  const response = await fetch(`${API_URL}/api/categories`);
  if (!response.ok) throw new Error('Failed to fetch categories');
  return response.json();
}
