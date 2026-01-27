import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductTableComponent } from './product-table.component';
import { Product } from '@core/models/product.model';

describe('ProductTableComponent', () => {
  let component: ProductTableComponent;
  let fixture: ComponentFixture<ProductTableComponent>;

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
    await TestBed.configureTestingModule({
      imports: [ProductTableComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductTableComponent);
    component = fixture.componentInstance;
    component.products = mockProducts;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display products in table', () => {
    const rows = fixture.nativeElement.querySelectorAll('tbody tr');
    expect(rows.length).toBe(2);
  });

  it('should display empty message when no products', () => {
    fixture.componentRef.setInput('products', []);
    fixture.detectChanges();

    const emptyMessage = fixture.nativeElement.querySelector('.empty-message');
    expect(emptyMessage).toBeTruthy();
    expect(emptyMessage.textContent).toContain('No se encontraron productos');
  });

  it('should track by product id', () => {
    const trackResult = component.trackByProductId(0, mockProducts[0]);
    expect(trackResult).toBe('prod-1');
  });

  it('should emit edit event with product id', () => {
    const editSpy = jest.spyOn(component.edit, 'emit');

    component.onEdit('prod-1');

    expect(editSpy).toHaveBeenCalledWith('prod-1');
  });

  it('should emit delete event with product', () => {
    const deleteSpy = jest.spyOn(component.delete, 'emit');

    component.onDelete('prod-1');

    expect(deleteSpy).toHaveBeenCalledWith(mockProducts[0]);
  });

  it('should not emit delete if product not found', () => {
    const deleteSpy = jest.spyOn(component.delete, 'emit');

    component.onDelete('non-existent');

    expect(deleteSpy).not.toHaveBeenCalled();
  });

  it('should handle image error by setting fallback', () => {
    const img = document.createElement('img');
    const event = { target: img } as unknown as Event;

    component.onImageError(event);

    expect(img.src).toContain('data:image/svg+xml');
  });
});
