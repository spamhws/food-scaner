import type { Product } from '@/types/product';

export async function getProductByBarcode(barcode: string): Promise<Product> {
  const response = await fetch(`/api/products/${barcode}`);
  if (!response.ok) {
    throw new Error('Product not found');
  }
  return response.json();
}
