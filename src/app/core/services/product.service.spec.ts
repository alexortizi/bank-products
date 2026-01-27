import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductService } from './product.service';
import { Product } from '@core/models/product.model';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;
  const baseUrl = 'http://localhost:3002/bp/products';

  const mockProduct: Product = {
    id: 'test-id',
    name: 'Test Product',
    description: 'Test Description',
    logo: 'https://example.com/logo.png',
    date_release: '2024-01-01',
    date_revision: '2025-01-01'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService]
    });
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getProducts', () => {
    it('should return an array of products', () => {
      const mockProducts: Product[] = [mockProduct];

      service.getProducts().subscribe(products => {
        expect(products).toEqual(mockProducts);
        expect(products.length).toBe(1);
      });

      const req = httpMock.expectOne(baseUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockProducts);
    });
  });

  describe('getProductById', () => {
    it('should return a single product', () => {
      service.getProductById('test-id').subscribe(product => {
        expect(product).toEqual(mockProduct);
      });

      const req = httpMock.expectOne(`${baseUrl}/test-id`);
      expect(req.request.method).toBe('GET');
      req.flush(mockProduct);
    });
  });

  describe('createProduct', () => {
    it('should create a new product', () => {
      service.createProduct(mockProduct).subscribe(product => {
        expect(product).toEqual(mockProduct);
      });

      const req = httpMock.expectOne(baseUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockProduct);
      req.flush(mockProduct);
    });
  });

  describe('updateProduct', () => {
    it('should update an existing product', () => {
      const updatedProduct = { ...mockProduct, name: 'Updated Name' };

      service.updateProduct('test-id', updatedProduct).subscribe(product => {
        expect(product).toEqual(updatedProduct);
      });

      const req = httpMock.expectOne(`${baseUrl}/test-id`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updatedProduct);
      req.flush(updatedProduct);
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product', () => {
      service.deleteProduct('test-id').subscribe(response => {
        expect(response).toBeUndefined();
      });

      const req = httpMock.expectOne(`${baseUrl}/test-id`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });

  describe('verifyId', () => {
    it('should return true if id exists', () => {
      service.verifyId('existing-id').subscribe(exists => {
        expect(exists).toBe(true);
      });

      const req = httpMock.expectOne(`${baseUrl}/verification/existing-id`);
      expect(req.request.method).toBe('GET');
      req.flush(true);
    });

    it('should return false if id does not exist', () => {
      service.verifyId('new-id').subscribe(exists => {
        expect(exists).toBe(false);
      });

      const req = httpMock.expectOne(`${baseUrl}/verification/new-id`);
      expect(req.request.method).toBe('GET');
      req.flush(false);
    });
  });
});
