import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContextMenuComponent } from './context-menu.component';

describe('ContextMenuComponent', () => {
  let component: ContextMenuComponent;
  let fixture: ComponentFixture<ContextMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContextMenuComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ContextMenuComponent);
    component = fixture.componentInstance;
    component.productId = 'test-id';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start with menu closed', () => {
    expect(component.isOpen).toBe(false);
  });

  it('should toggle menu state', () => {
    component.toggle();
    expect(component.isOpen).toBe(true);

    component.toggle();
    expect(component.isOpen).toBe(false);
  });

  it('should emit edit event and close menu', () => {
    const editSpy = jest.spyOn(component.edit, 'emit');

    component.isOpen = true;
    component.onEdit();

    expect(editSpy).toHaveBeenCalledWith('test-id');
    expect(component.isOpen).toBe(false);
  });

  it('should emit delete event and close menu', () => {
    const deleteSpy = jest.spyOn(component.delete, 'emit');

    component.isOpen = true;
    component.onDelete();

    expect(deleteSpy).toHaveBeenCalledWith('test-id');
    expect(component.isOpen).toBe(false);
  });

  it('should close menu when clicking outside', () => {
    component.isOpen = true;

    const outsideEvent = new MouseEvent('click');
    Object.defineProperty(outsideEvent, 'target', { value: document.body });

    component.onDocumentClick(outsideEvent);

    expect(component.isOpen).toBe(false);
  });

  it('should not close menu when clicking inside', () => {
    component.isOpen = true;

    const insideElement = fixture.nativeElement;
    const insideEvent = new MouseEvent('click');
    Object.defineProperty(insideEvent, 'target', { value: insideElement });

    component.onDocumentClick(insideEvent);

    expect(component.isOpen).toBe(true);
  });
});
