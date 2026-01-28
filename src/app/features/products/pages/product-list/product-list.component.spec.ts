import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ProductListComponent } from './product-list.component';
import { ProductService } from '@core/services/product.service';
import { Product } from '@core/models/product.model';
import { ToastService } from '@shared/components/toast/toast.service';

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let mockProductService: jest.Mocked<ProductService>;
  let mockRouter: jest.Mocked<Router>;
  let mockToastService: jest.Mocked<ToastService>;

  const mockProducts: Product[] = [
    {
      id: 'prod-1',
      name: 'Product 1',
      description: 'Description 1',
      logo: 'https://example.com/logo1.png',
      date_release: '2024-01-01',
      date_revision: '2025-01-01'
    },
    {
      id: 'prod-2',
      name: 'Product 2',
      description: 'Description 2',
      logo: 'https://example.com/logo2.png',
      date_release: '2024-02-01',
      date_revision: '2025-02-01'
    }
  ];

  beforeEach(async () => {
    mockProductService = {
      getProducts: jest.fn().mockReturnValue(of(mockProducts)),
      deleteProduct: jest.fn().mockReturnValue(of(undefined))
    } as unknown as jest.Mocked<ProductService>;

    mockRouter = {
      navigate: jest.fn()
    } as unknown as jest.Mocked<Router>;

    mockToastService = {
      success: jest.fn(),
      error: jest.fn(),
      info: jest.fn(),
      warning: jest.fn()
    } as unknown as jest.Mocked<ToastService>;

    await TestBed.configureTestingModule({
      imports: [ProductListComponent],
      providers: [
        { provide: ProductService, useValue: mockProductService },
        { provide: Router, useValue: mockRouter },
        { provide: ToastService, useValue: mockToastService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load products on init', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    expect(mockProductService.getProducts).toHaveBeenCalled();
    // Los productos se invierten para mostrar los más recientes primero
    expect(component.products()).toEqual([...mockProducts].reverse());
    expect(component.isLoading()).toBe(false);
  }));

  it('should handle error when loading products', fakeAsync(() => {
    mockProductService.getProducts.mockReturnValue(throwError(() => new Error('Network error')));

    fixture.detectChanges();
    tick();

    expect(component.errorMessage()).toBe('Network error');
    expect(component.isLoading()).toBe(false);
  }));

  it('should filter products by search term', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    component.onSearchChange('Product 1');

    expect(component.filteredProducts().length).toBe(1);
    expect(component.filteredProducts()[0].name).toBe('Product 1');
  }));

  it('should return all products when search term is empty', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    component.onSearchChange('');

    expect(component.filteredProducts().length).toBe(2);
  }));

  it('should paginate products correctly', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    component.pageSize.set(1);

    expect(component.paginatedProducts().length).toBe(1);
  }));

  it('should change page size', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    const event = { target: { value: '10' } } as unknown as Event;
    component.onPageSizeChange(event);

    expect(component.pageSize()).toBe(10);
  }));

  it('should navigate to add product page', () => {
    component.onAddProduct();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/products/new']);
  });

  it('should navigate to edit product page', () => {
    component.onEditProduct('prod-1');

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/products/edit', 'prod-1']);
  });

  it('should open delete confirmation modal', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    const product = mockProducts[0];
    component.onDeleteProduct(product);

    expect(component.isModalOpen()).toBe(true);
    expect(component.productToDelete()).toEqual(product);
  }));

  it('should close modal on cancel', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    component.onDeleteProduct(mockProducts[0]);
    component.onCancelDelete();

    expect(component.isModalOpen()).toBe(false);
    expect(component.productToDelete()).toBeNull();
  }));

  it('should delete product on confirm', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    const product = mockProducts[0];
    component.onDeleteProduct(product);
    component.onConfirmDelete();
    tick();

    expect(mockProductService.deleteProduct).toHaveBeenCalledWith('prod-1');
    expect(mockToastService.success).toHaveBeenCalledWith(`Producto "${product.name}" eliminado exitosamente`);
    expect(mockProductService.getProducts).toHaveBeenCalledTimes(2); // Initial load + reload after delete
    expect(component.isModalOpen()).toBe(false);
  }));

  it('should handle error when deleting product', fakeAsync(() => {
    mockProductService.deleteProduct.mockReturnValue(throwError(() => new Error('Delete error')));

    fixture.detectChanges();
    tick();

    component.onDeleteProduct(mockProducts[0]);
    component.onConfirmDelete();
    tick();

    expect(mockToastService.error).toHaveBeenCalledWith('Delete error');
    expect(component.isModalOpen()).toBe(false);
  }));

  it('should refresh products when onRefresh is called', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    component.onRefresh();
    tick();

    expect(mockProductService.getProducts).toHaveBeenCalledTimes(2);
  }));

  it('should compute total results correctly', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    expect(component.totalResults()).toBe(2);

    component.onSearchChange('Product 1');
    expect(component.totalResults()).toBe(1);
  }));
});
