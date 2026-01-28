import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { delay, of } from 'rxjs';
import { MOCK_PRODUCTS } from './product.mock';
import { Product } from '@core/models/product.model';
import { environment } from '../../../environments/environment';

let mockProducts = [...MOCK_PRODUCTS];

export const mockInterceptor: HttpInterceptorFn = (req, next) => {
  if (!environment.useMocks) {
    return next(req);
  }

  const url = req.url;
  const method = req.method;

  // Simulate network delay
  const mockDelay = 500;

  // GET /bp/products - List all products
  if (url.endsWith('/bp/products') && method === 'GET') {
    return of(new HttpResponse({
      status: 200,
      body: [...mockProducts]
    })).pipe(delay(mockDelay));
  }

  // GET /bp/products/verification/:id - Check if ID exists
  if (url.includes('/bp/products/verification/') && method === 'GET') {
    const id = url.split('/').pop();
    const exists = mockProducts.some(p => p.id === id);
    return of(new HttpResponse({
      status: 200,
      body: exists
    })).pipe(delay(mockDelay));
  }

  // GET /bp/products/:id - Get product by ID
  if (url.match(/\/bp\/products\/[^/]+$/) && method === 'GET') {
    const id = url.split('/').pop();
    const product = mockProducts.find(p => p.id === id);

    if (product) {
      return of(new HttpResponse({
        status: 200,
        body: { ...product }
      })).pipe(delay(mockDelay));
    } else {
      return of(new HttpResponse({
        status: 404,
        body: { message: 'Producto no encontrado' }
      })).pipe(delay(mockDelay));
    }
  }

  // POST /bp/products - Create product
  if (url.endsWith('/bp/products') && method === 'POST') {
    const newProduct = req.body as Product;

    // Check if ID already exists
    if (mockProducts.some(p => p.id === newProduct.id)) {
      return of(new HttpResponse({
        status: 400,
        body: { message: 'El ID del producto ya existe' }
      })).pipe(delay(mockDelay));
    }

    mockProducts.push({ ...newProduct });

    return of(new HttpResponse({
      status: 201,
      body: { ...newProduct }
    })).pipe(delay(mockDelay));
  }

  // PUT /bp/products/:id - Update product
  if (url.match(/\/bp\/products\/[^/]+$/) && method === 'PUT') {
    const id = url.split('/').pop();
    const updatedProduct = req.body as Product;
    const index = mockProducts.findIndex(p => p.id === id);

    if (index !== -1) {
      mockProducts[index] = { ...updatedProduct, id: id! };
      return of(new HttpResponse({
        status: 200,
        body: { ...mockProducts[index] }
      })).pipe(delay(mockDelay));
    } else {
      return of(new HttpResponse({
        status: 404,
        body: { message: 'Producto no encontrado' }
      })).pipe(delay(mockDelay));
    }
  }

  // DELETE /bp/products/:id - Delete product
  if (url.match(/\/bp\/products\/[^/]+$/) && method === 'DELETE') {
    const id = url.split('/').pop();
    const index = mockProducts.findIndex(p => p.id === id);

    if (index !== -1) {
      mockProducts.splice(index, 1);
      return of(new HttpResponse({
        status: 200,
        body: { message: 'Producto eliminado exitosamente' }
      })).pipe(delay(mockDelay));
    } else {
      return of(new HttpResponse({
        status: 404,
        body: { message: 'Producto no encontrado' }
      })).pipe(delay(mockDelay));
    }
  }

  // If no mock matches, pass through to actual backend
  return next(req);
};

// Helper function to reset mocks (useful for testing)
export function resetMockProducts(): void {
  mockProducts = [...MOCK_PRODUCTS];
}
