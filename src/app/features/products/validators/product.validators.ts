import { AbstractControl, AsyncValidatorFn, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, catchError, debounceTime, switchMap, first } from 'rxjs/operators';
import { ProductService } from '@core/services/product.service';

export function minDateValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const inputDate = new Date(control.value + 'T00:00:00');
    return inputDate < today ? { minDate: true } : null;
  };
}

export function uniqueIdValidator(productService: ProductService, currentId?: string): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (!control.value || control.value.length < 3) {
      return of(null);
    }

    if (currentId && control.value === currentId) {
      return of(null);
    }

    return of(control.value).pipe(
      debounceTime(300),
      switchMap(id => productService.verifyId(id)),
      map(exists => (exists ? { idExists: true } : null)),
      catchError(() => of(null)),
      first()
    );
  };
}
