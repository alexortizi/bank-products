import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, Toast } from './toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      @for (toast of toastService.toasts(); track toast.id) {
        <div class="toast toast--{{ toast.type }}" (click)="toastService.remove(toast.id)">
          <span class="toast__icon">
            @switch (toast.type) {
              @case ('success') { ✓ }
              @case ('error') { ✕ }
              @case ('warning') { ⚠ }
              @case ('info') { ℹ }
            }
          </span>
          <span class="toast__message">{{ toast.message }}</span>
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      top: 80px;
      right: 20px;
      z-index: 1000;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .toast {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 14px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      cursor: pointer;
      animation: slideIn 0.3s ease;
      min-width: 280px;
      max-width: 400px;
    }

    .toast--success {
      background-color: #d4edda;
      border: 1px solid #28a745;
      color: #155724;
    }

    .toast--error {
      background-color: #f8d7da;
      border: 1px solid #dc3545;
      color: #721c24;
    }

    .toast--info {
      background-color: #d1ecf1;
      border: 1px solid #17a2b8;
      color: #0c5460;
    }

    .toast--warning {
      background-color: #fff3cd;
      border: 1px solid #ffc107;
      color: #856404;
    }

    .toast__icon {
      font-size: 18px;
      font-weight: bold;
    }

    .toast__message {
      font-size: 14px;
      flex: 1;
    }

    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToastComponent {
  readonly toastService = inject(ToastService);
}
