import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToastComponent } from './toast.component';
import { ToastService } from './toast.service';

describe('ToastComponent', () => {
  let component: ToastComponent;
  let fixture: ComponentFixture<ToastComponent>;
  let toastService: ToastService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToastComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ToastComponent);
    component = fixture.componentInstance;
    toastService = TestBed.inject(ToastService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display toasts from service', () => {
    toastService.success('Test toast');
    fixture.detectChanges();

    const toastElement = fixture.nativeElement.querySelector('.toast');
    expect(toastElement).toBeTruthy();
    expect(toastElement.textContent).toContain('Test toast');
  });

  it('should apply correct class for success toast', () => {
    toastService.success('Success');
    fixture.detectChanges();

    const toastElement = fixture.nativeElement.querySelector('.toast--success');
    expect(toastElement).toBeTruthy();
  });

  it('should apply correct class for error toast', () => {
    toastService.error('Error');
    fixture.detectChanges();

    const toastElement = fixture.nativeElement.querySelector('.toast--error');
    expect(toastElement).toBeTruthy();
  });

  it('should apply correct class for info toast', () => {
    toastService.info('Info');
    fixture.detectChanges();

    const toastElement = fixture.nativeElement.querySelector('.toast--info');
    expect(toastElement).toBeTruthy();
  });

  it('should apply correct class for warning toast', () => {
    toastService.warning('Warning');
    fixture.detectChanges();

    const toastElement = fixture.nativeElement.querySelector('.toast--warning');
    expect(toastElement).toBeTruthy();
  });

  it('should remove toast when clicked', () => {
    toastService.success('Clickable toast');
    fixture.detectChanges();

    const toastElement = fixture.nativeElement.querySelector('.toast');
    toastElement.click();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.toast')).toBeNull();
  });

  it('should display multiple toasts', () => {
    toastService.success('Toast 1');
    toastService.error('Toast 2');
    fixture.detectChanges();

    const toasts = fixture.nativeElement.querySelectorAll('.toast');
    expect(toasts.length).toBe(2);
  });
});
