import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private nextId = 0;
  readonly toasts = signal<Toast[]>([]);

  show(message: string, type: ToastType = 'info', duration = 2000): void {
    const id = this.nextId++;
    const toast: Toast = { id, message, type };

    this.toasts.update(toasts => [...toasts, toast]);

    setTimeout(() => this.remove(id), duration);
  }

  success(message: string, duration = 2000): void {
    this.show(message, 'success', duration);
  }

  error(message: string, duration = 2000): void {
    this.show(message, 'error', duration);
  }

  info(message: string, duration = 2000): void {
    this.show(message, 'info', duration);
  }

  warning(message: string, duration = 2000): void {
    this.show(message, 'warning', duration);
  }

  remove(id: number): void {
    this.toasts.update(toasts => toasts.filter(t => t.id !== id));
  }
}
