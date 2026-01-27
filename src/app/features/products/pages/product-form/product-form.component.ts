import { Component, OnInit, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '@core/services/product.service';
import { Product } from '@core/models/product.model';
import { minDateValidator, uniqueIdValidator } from '../../validators/product.validators';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly productService = inject(ProductService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  form!: FormGroup;
  isEditMode = signal(false);
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  private productId: string | null = null;

  ngOnInit(): void {
    this.initForm();
    this.checkEditMode();
  }

  private initForm(): void {
    this.form = this.fb.group({
      id: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(10)
      ]],
      name: ['', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(100)
      ]],
      description: ['', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(200)
      ]],
      logo: ['', Validators.required],
      date_release: ['', [Validators.required, minDateValidator()]],
      date_revision: [{ value: '', disabled: true }, Validators.required]
    });

    this.form.get('date_release')?.valueChanges.subscribe(value => {
      if (value) {
        const releaseDate = new Date(value + 'T00:00:00');
        releaseDate.setFullYear(releaseDate.getFullYear() + 1);
        const revisionDate = releaseDate.toISOString().split('T')[0];
        this.form.get('date_revision')?.setValue(revisionDate);
      }
    });
  }

  private checkEditMode(): void {
    this.productId = this.route.snapshot.paramMap.get('id');

    if (this.productId) {
      this.isEditMode.set(true);
      this.loadProduct(this.productId);
      this.form.get('id')?.disable();
    } else {
      this.form.get('id')?.setAsyncValidators(
        uniqueIdValidator(this.productService)
      );
    }
  }

  private loadProduct(id: string): void {
    this.isLoading.set(true);

    this.productService.getProductById(id).subscribe({
      next: (product) => {
        this.form.patchValue({
          id: product.id,
          name: product.name,
          description: product.description,
          logo: product.logo,
          date_release: product.date_release,
          date_revision: product.date_revision
        });
        this.isLoading.set(false);
      },
      error: (error) => {
        this.errorMessage.set(error.message);
        this.isLoading.set(false);
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const formValue = this.form.getRawValue();
    const product: Product = {
      id: formValue.id,
      name: formValue.name,
      description: formValue.description,
      logo: formValue.logo,
      date_release: formValue.date_release,
      date_revision: formValue.date_revision
    };

    const operation = this.isEditMode()
      ? this.productService.updateProduct(product.id, product)
      : this.productService.createProduct(product);

    operation.subscribe({
      next: () => {
        this.router.navigate(['/products']);
      },
      error: (error) => {
        this.errorMessage.set(error.message);
        this.isLoading.set(false);
      }
    });
  }

  onReset(): void {
    if (this.isEditMode() && this.productId) {
      this.loadProduct(this.productId);
    } else {
      this.form.reset();
    }
  }

  onCancel(): void {
    this.router.navigate(['/products']);
  }

  hasError(fieldName: string, errorType: string): boolean {
    const control = this.form.get(fieldName);
    return control ? control.hasError(errorType) && control.touched : false;
  }

  isFieldInvalid(fieldName: string): boolean {
    const control = this.form.get(fieldName);
    return control ? control.invalid && control.touched : false;
  }
}
