import { Component, OnInit, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '@core/services/product.service';
import { Product } from '@core/models/product.model';
import { SearchBoxComponent } from '../../components/search-box/search-box.component';
import { ProductTableComponent } from '../../components/product-table/product-table.component';
import { SkeletonLoaderComponent } from '../../components/skeleton-loader/skeleton-loader.component';
import { ConfirmationModalComponent } from '../../components/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SearchBoxComponent,
    ProductTableComponent,
    SkeletonLoaderComponent,
    ConfirmationModalComponent
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListComponent implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly router = inject(Router);

  products = signal<Product[]>([]);
  isLoading = signal(true);
  searchTerm = signal('');
  pageSize = signal(5);
  errorMessage = signal<string | null>(null);

  productToDelete = signal<Product | null>(null);
  isModalOpen = signal(false);

  filteredProducts = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const allProducts = this.products();

    if (!term) {
      return allProducts;
    }

    return allProducts.filter(product =>
      product.name.toLowerCase().includes(term) ||
      product.description.toLowerCase().includes(term)
    );
  });

  paginatedProducts = computed(() => {
    return this.filteredProducts().slice(0, this.pageSize());
  });

  totalResults = computed(() => this.filteredProducts().length);

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products.set(products);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.errorMessage.set(error.message);
        this.isLoading.set(false);
      }
    });
  }

  onSearchChange(term: string): void {
    this.searchTerm.set(term);
  }

  onPageSizeChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.pageSize.set(Number(select.value));
  }

  onAddProduct(): void {
    this.router.navigate(['/products/new']);
  }

  onEditProduct(productId: string): void {
    this.router.navigate(['/products/edit', productId]);
  }

  onDeleteProduct(product: Product): void {
    this.productToDelete.set(product);
    this.isModalOpen.set(true);
  }

  onConfirmDelete(): void {
    const product = this.productToDelete();
    if (!product) return;

    this.productService.deleteProduct(product.id).subscribe({
      next: () => {
        this.products.update(products =>
          products.filter(p => p.id !== product.id)
        );
        this.closeModal();
      },
      error: (error) => {
        this.errorMessage.set(error.message);
        this.closeModal();
      }
    });
  }

  onCancelDelete(): void {
    this.closeModal();
  }

  private closeModal(): void {
    this.isModalOpen.set(false);
    this.productToDelete.set(null);
  }
}
