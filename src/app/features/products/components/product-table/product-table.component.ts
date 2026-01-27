import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '@core/models/product.model';
import { DateFormatPipe } from '@shared/pipes/date-format.pipe';
import { ContextMenuComponent } from '../context-menu/context-menu.component';

@Component({
  selector: 'app-product-table',
  standalone: true,
  imports: [CommonModule, DateFormatPipe, ContextMenuComponent],
  templateUrl: './product-table.component.html',
  styleUrl: './product-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductTableComponent {
  @Input() products: Product[] = [];
  @Output() edit = new EventEmitter<string>();
  @Output() delete = new EventEmitter<Product>();

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

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40"%3E%3Crect fill="%23e0e0e0" width="40" height="40"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%23999" font-size="12"%3EImg%3C/text%3E%3C/svg%3E';
  }
}
