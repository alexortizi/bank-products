import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmationModalComponent } from './confirmation-modal.component';

describe('ConfirmationModalComponent', () => {
  let component: ConfirmationModalComponent;
  let fixture: ComponentFixture<ConfirmationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmationModalComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not show modal when isOpen is false', () => {
    fixture.componentRef.setInput('isOpen', false);
    fixture.detectChanges();

    const modal = fixture.nativeElement.querySelector('.modal-backdrop');
    expect(modal).toBeNull();
  });

  it('should show modal when isOpen is true', () => {
    fixture.componentRef.setInput('isOpen', true);
    fixture.detectChanges();

    const modal = fixture.nativeElement.querySelector('.modal-backdrop');
    expect(modal).toBeTruthy();
  });

  it('should display product name in message', () => {
    fixture.componentRef.setInput('isOpen', true);
    fixture.componentRef.setInput('productName', 'Test Product');
    fixture.detectChanges();

    const message = fixture.nativeElement.querySelector('.modal__message');
    expect(message.textContent).toContain('Test Product');
  });

  it('should emit confirm event on confirm click', () => {
    const confirmSpy = jest.spyOn(component.confirm, 'emit');

    component.onConfirm();

    expect(confirmSpy).toHaveBeenCalled();
  });

  it('should emit cancel event on cancel click', () => {
    const cancelSpy = jest.spyOn(component.cancel, 'emit');

    component.onCancel();

    expect(cancelSpy).toHaveBeenCalled();
  });

  it('should emit cancel event on backdrop click', () => {
    const cancelSpy = jest.spyOn(component.cancel, 'emit');

    const event = {
      target: 'backdrop',
      currentTarget: 'backdrop'
    } as unknown as Event;

    component.onBackdropClick(event);

    expect(cancelSpy).toHaveBeenCalled();
  });

  it('should not emit cancel when clicking inside modal', () => {
    const cancelSpy = jest.spyOn(component.cancel, 'emit');

    const event = {
      target: 'modal',
      currentTarget: 'backdrop'
    } as unknown as Event;

    component.onBackdropClick(event);

    expect(cancelSpy).not.toHaveBeenCalled();
  });
});
