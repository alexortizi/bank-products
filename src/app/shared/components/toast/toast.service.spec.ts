import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ToastService } from './toast.service';

describe('ToastService', () => {
  let service: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToastService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add a toast with show()', () => {
    service.show('Test message', 'info');

    expect(service.toasts().length).toBe(1);
    expect(service.toasts()[0].message).toBe('Test message');
    expect(service.toasts()[0].type).toBe('info');
  });

  it('should add success toast', () => {
    service.success('Success message');

    expect(service.toasts().length).toBe(1);
    expect(service.toasts()[0].type).toBe('success');
  });

  it('should add error toast', () => {
    service.error('Error message');

    expect(service.toasts().length).toBe(1);
    expect(service.toasts()[0].type).toBe('error');
  });

  it('should add info toast', () => {
    service.info('Info message');

    expect(service.toasts().length).toBe(1);
    expect(service.toasts()[0].type).toBe('info');
  });

  it('should add warning toast', () => {
    service.warning('Warning message');

    expect(service.toasts().length).toBe(1);
    expect(service.toasts()[0].type).toBe('warning');
  });

  it('should remove toast by id', () => {
    service.show('Test message', 'info');
    const toastId = service.toasts()[0].id;

    service.remove(toastId);

    expect(service.toasts().length).toBe(0);
  });

  it('should auto-remove toast after duration', fakeAsync(() => {
    service.show('Test message', 'info', 1000);

    expect(service.toasts().length).toBe(1);

    tick(1000);

    expect(service.toasts().length).toBe(0);
  }));

  it('should handle multiple toasts', () => {
    service.success('Message 1');
    service.error('Message 2');
    service.info('Message 3');

    expect(service.toasts().length).toBe(3);
  });

  it('should assign unique ids to toasts', () => {
    service.success('Message 1');
    service.success('Message 2');

    const ids = service.toasts().map(t => t.id);
    expect(ids[0]).not.toBe(ids[1]);
  });
});
