import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '@core/models/product.model';
import { DateFormatPipe } from '@shared/pipes/date-format.pipe';
import { HighlightPipe } from '@shared/pipes/highlight.pipe';
import { ContextMenuComponent } from '../context-menu/context-menu.component';

@Component({
  selector: 'app-product-table',
  standalone: true,
  imports: [CommonModule, DateFormatPipe, HighlightPipe, ContextMenuComponent],
  templateUrl: './product-table.component.html',
  styleUrl: './product-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductTableComponent {
  @Input() products: Product[] = [];
  @Input() isLoading = false;
  @Input() skeletonRows = 5;
  @Input() searchTerm = '';
  @Output() edit = new EventEmitter<string>();
  @Output() delete = new EventEmitter<Product>();
  @Output() reload = new EventEmitter<void>();

  private cdr = inject(ChangeDetectorRef);
  failedImages = new Set<string>();

  get skeletonRowsArray(): number[] {
    return Array(this.skeletonRows).fill(0);
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .slice(0, 2)
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase();
  }

  trackByProductId(index: number, product: Product): string {
    return product.id;
  }

  onEdit(productId: string): void {
    this.edit.emit(productId);
  }

  onDelete(productId: string): void {
    const product = this.products.find(p => p.id === productId);
    if (product) {
      this.delete.emit(product);
    }
  }

  onImageError(productId: string): void {
    this.failedImages.add(productId);
    this.cdr.markForCheck();
  }

  showTooltip(event: MouseEvent): void {
    const icon = event.target as HTMLElement;
    const tooltip = icon.nextElementSibling as HTMLElement;
    if (tooltip) {
      const rect = icon.getBoundingClientRect();
      tooltip.style.top = `${rect.top - tooltip.offsetHeight - 8}px`;
      tooltip.style.left = `${rect.left + rect.width / 2 - tooltip.offsetWidth / 2}px`;
    }
  }
}
