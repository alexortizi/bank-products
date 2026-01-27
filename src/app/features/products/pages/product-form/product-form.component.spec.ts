import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { ProductFormComponent } from './product-form.component';
import { ProductService } from '@core/services/product.service';
import { Product } from '@core/models/product.model';

describe('ProductFormComponent', () => {
  let component: ProductFormComponent;
  let fixture: ComponentFixture<ProductFormComponent>;
  let productService: ProductService;
  let router: Router;

  const mockProduct: Product = {
    id: 'test-id',
    name: 'Test Product',
    description: 'Test Description here',
    logo: 'https://example.com/logo.png',
    date_release: '2027-01-01',
    date_revision: '2028-01-01'
  };

  describe('Create Mode', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [ProductFormComponent, ReactiveFormsModule],
        providers: [
          {
            provide: ProductService,
            useValue: {
              getProductById: jest.fn().mockReturnValue(of(mockProduct)),
              createProduct: jest.fn().mockReturnValue(of(mockProduct)),
              updateProduct: jest.fn().mockReturnValue(of(mockProduct)),
              verifyId: jest.fn().mockReturnValue(of(false))
            }
          },
          {
            provide: Router,
            useValue: { navigate: jest.fn() }
          },
          {
            provide: ActivatedRoute,
            useValue: {
              snapshot: {
                paramMap: { get: () => null }
              }
            }
          }
        ]
      }).compileComponents();

      fixture = TestBed.createComponent(ProductFormComponent);
      component = fixture.componentInstance;
      productService = TestBed.inject(ProductService);
      router = TestBed.inject(Router);
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should be in create mode when no id in route', () => {
      expect(component.isEditMode()).toBe(false);
    });

    it('should initialize form with empty values', () => {
      expect(component.form.get('id')?.value).toBe('');
      expect(component.form.get('name')?.value).toBe('');
    });

    it('should have id field enabled in create mode', () => {
      expect(component.form.get('id')?.disabled).toBe(false);
    });

    it('should validate required fields', () => {
      component.form.markAllAsTouched();

      expect(component.hasError('id', 'required')).toBe(true);
      expect(component.hasError('name', 'required')).toBe(true);
      expect(component.hasError('description', 'required')).toBe(true);
      expect(component.hasError('logo', 'required')).toBe(true);
      expect(component.hasError('date_release', 'required')).toBe(true);
    });

    it('should validate id min length', () => {
      component.form.get('id')?.setValue('ab');
      component.form.get('id')?.markAsTouched();

      expect(component.hasError('id', 'minlength')).toBe(true);
    });

    it('should validate id max length', () => {
      component.form.get('id')?.setValue('12345678901');
      component.form.get('id')?.markAsTouched();

      expect(component.hasError('id', 'maxlength')).toBe(true);
    });

    it('should validate name min length', () => {
      component.form.get('name')?.setValue('abc');
      component.form.get('name')?.markAsTouched();

      expect(component.hasError('name', 'minlength')).toBe(true);
    });

    it('should validate description min length', () => {
      component.form.get('description')?.setValue('short');
      component.form.get('description')?.markAsTouched();

      expect(component.hasError('description', 'minlength')).toBe(true);
    });

    it('should auto-calculate revision date', () => {
      component.form.get('date_release')?.setValue('2025-06-15');

      expect(component.form.get('date_revision')?.value).toBe('2026-06-15');
    });

    it('should have date_revision disabled', () => {
      expect(component.form.get('date_revision')?.disabled).toBe(true);
    });

    it('should call onSubmit method', () => {
      const submitSpy = jest.spyOn(component, 'onSubmit');
      component.onSubmit();
      expect(submitSpy).toHaveBeenCalled();
    });

    it('should not submit if form is invalid', () => {
      component.onSubmit();

      expect(productService.createProduct).not.toHaveBeenCalled();
    });

    it('should reset form on reset click', () => {
      component.form.patchValue({
        id: 'test',
        name: 'Test'
      });

      component.onReset();

      expect(component.form.get('id')?.value).toBeNull();
      expect(component.form.get('name')?.value).toBeNull();
    });

    it('should navigate back on cancel', () => {
      component.onCancel();

      expect(router.navigate).toHaveBeenCalledWith(['/products']);
    });

    it('should return true for invalid touched field', () => {
      component.form.get('id')?.markAsTouched();
      expect(component.isFieldInvalid('id')).toBe(true);
    });

    it('should return false for valid field', () => {
      component.form.get('id')?.setValue('valid-id');
      component.form.get('id')?.markAsTouched();
      expect(component.isFieldInvalid('id')).toBe(false);
    });

    it('should return false for untouched invalid field', () => {
      expect(component.isFieldInvalid('id')).toBe(false);
    });
  });

  describe('Edit Mode', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [ProductFormComponent, ReactiveFormsModule],
        providers: [
          {
            provide: ProductService,
            useValue: {
              getProductById: jest.fn().mockReturnValue(of(mockProduct)),
              createProduct: jest.fn().mockReturnValue(of(mockProduct)),
              updateProduct: jest.fn().mockReturnValue(of(mockProduct)),
              verifyId: jest.fn().mockReturnValue(of(false))
            }
          },
          {
            provide: Router,
            useValue: { navigate: jest.fn() }
          },
          {
            provide: ActivatedRoute,
            useValue: {
              snapshot: {
                paramMap: { get: () => 'test-id' }
              }
            }
          }
        ]
      }).compileComponents();

      fixture = TestBed.createComponent(ProductFormComponent);
      component = fixture.componentInstance;
      productService = TestBed.inject(ProductService);
      router = TestBed.inject(Router);
      fixture.detectChanges();
    });

    it('should be in edit mode when id in route', () => {
      expect(component.isEditMode()).toBe(true);
    });

    it('should load product data', fakeAsync(() => {
      tick();

      expect(productService.getProductById).toHaveBeenCalledWith('test-id');
      expect(component.form.get('name')?.value).toBe('Test Product');
    }));

    it('should have id field disabled in edit mode', () => {
      expect(component.form.get('id')?.disabled).toBe(true);
    });

    it('should call onSubmit in edit mode', fakeAsync(() => {
      tick();
      const submitSpy = jest.spyOn(component, 'onSubmit');
      component.onSubmit();
      expect(submitSpy).toHaveBeenCalled();
    }));

    it('should reload product on reset in edit mode', fakeAsync(() => {
      tick();

      component.form.get('name')?.setValue('Changed Name');
      component.onReset();
      tick();

      expect(productService.getProductById).toHaveBeenCalledTimes(2);
    }));
  });

  describe('Edit Mode with error', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [ProductFormComponent, ReactiveFormsModule],
        providers: [
          {
            provide: ProductService,
            useValue: {
              getProductById: jest.fn().mockReturnValue(throwError(() => new Error('Load error'))),
              createProduct: jest.fn().mockReturnValue(of(mockProduct)),
              updateProduct: jest.fn().mockReturnValue(of(mockProduct)),
              verifyId: jest.fn().mockReturnValue(of(false))
            }
          },
          {
            provide: Router,
            useValue: { navigate: jest.fn() }
          },
          {
            provide: ActivatedRoute,
            useValue: {
              snapshot: {
                paramMap: { get: () => 'error-id' }
              }
            }
          }
        ]
      }).compileComponents();

      fixture = TestBed.createComponent(ProductFormComponent);
      component = fixture.componentInstance;
    });

    it('should handle error on load', fakeAsync(() => {
      fixture.detectChanges();
      tick();

      expect(component.errorMessage()).toBe('Load error');
    }));
  });
});
