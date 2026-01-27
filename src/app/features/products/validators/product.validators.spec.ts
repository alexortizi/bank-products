import { FormControl } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { minDateValidator, uniqueIdValidator } from './product.validators';
import { ProductService } from '@core/services/product.service';

describe('Product Validators', () => {
  describe('minDateValidator', () => {
    it('should return null for empty value', () => {
      const control = new FormControl('');
      const validator = minDateValidator();
      expect(validator(control)).toBeNull();
    });

    it('should return null for date equal to today', () => {
      const today = new Date().toISOString().split('T')[0];
      const control = new FormControl(today);
      const validator = minDateValidator();
      expect(validator(control)).toBeNull();
    });

    it('should return null for future date', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 10);
      const control = new FormControl(futureDate.toISOString().split('T')[0]);
      const validator = minDateValidator();
      expect(validator(control)).toBeNull();
    });

    it('should return error for past date', () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);
      const control = new FormControl(pastDate.toISOString().split('T')[0]);
      const validator = minDateValidator();
      expect(validator(control)).toEqual({ minDate: true });
    });
  });

  describe('uniqueIdValidator', () => {
    let mockProductService: jest.Mocked<ProductService>;

    beforeEach(() => {
      mockProductService = {
        verifyId: jest.fn()
      } as unknown as jest.Mocked<ProductService>;
    });

    it('should return null for empty value', (done) => {
      const control = new FormControl('');
      const validator = uniqueIdValidator(mockProductService);

      validator(control).subscribe(result => {
        expect(result).toBeNull();
        done();
      });
    });

    it('should return null for value less than 3 characters', (done) => {
      const control = new FormControl('ab');
      const validator = uniqueIdValidator(mockProductService);

      validator(control).subscribe(result => {
        expect(result).toBeNull();
        done();
      });
    });

    it('should return null when id matches currentId', (done) => {
      const control = new FormControl('test-id');
      const validator = uniqueIdValidator(mockProductService, 'test-id');

      validator(control).subscribe(result => {
        expect(result).toBeNull();
        done();
      });
    });

    it('should return idExists error when id exists', (done) => {
      mockProductService.verifyId.mockReturnValue(of(true));
      const control = new FormControl('existing-id');
      const validator = uniqueIdValidator(mockProductService);

      validator(control).subscribe(result => {
        expect(result).toEqual({ idExists: true });
        done();
      });
    });

    it('should return null when id does not exist', (done) => {
      mockProductService.verifyId.mockReturnValue(of(false));
      const control = new FormControl('new-id');
      const validator = uniqueIdValidator(mockProductService);

      validator(control).subscribe(result => {
        expect(result).toBeNull();
        done();
      });
    });

    it('should return null on error', (done) => {
      mockProductService.verifyId.mockReturnValue(throwError(() => new Error('Network error')));
      const control = new FormControl('test-id');
      const validator = uniqueIdValidator(mockProductService);

      validator(control).subscribe(result => {
        expect(result).toBeNull();
        done();
      });
    });
  });
});
