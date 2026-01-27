import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-context-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './context-menu.component.html',
  styleUrl: './context-menu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContextMenuComponent {
  @Input() productId!: string;
  @Output() edit = new EventEmitter<string>();
  @Output() delete = new EventEmitter<string>();

  isOpen = false;

  constructor(private elementRef: ElementRef) {}

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
    }
  }

  toggle(): void {
    this.isOpen = !this.isOpen;
  }

  onEdit(): void {
    this.edit.emit(this.productId);
    this.isOpen = false;
  }

  onDelete(): void {
    this.delete.emit(this.productId);
    this.isOpen = false;
  }
}
