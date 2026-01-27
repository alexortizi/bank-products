import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { SearchBoxComponent } from './search-box.component';

describe('SearchBoxComponent', () => {
  let component: SearchBoxComponent;
  let fixture: ComponentFixture<SearchBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchBoxComponent, FormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(SearchBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit search change with debounce', fakeAsync(() => {
    const emitSpy = jest.spyOn(component.searchChange, 'emit');

    component.searchTerm = 'test';
    component.onSearch();
    tick(300);

    expect(emitSpy).toHaveBeenCalledWith('test');
  }));

  it('should not emit for duplicate values', fakeAsync(() => {
    const emitSpy = jest.spyOn(component.searchChange, 'emit');

    component.searchTerm = 'test';
    component.onSearch();
    tick(300);

    component.onSearch();
    tick(300);

    expect(emitSpy).toHaveBeenCalledTimes(1);
  }));

  it('should emit for different values', fakeAsync(() => {
    const emitSpy = jest.spyOn(component.searchChange, 'emit');

    component.searchTerm = 'test1';
    component.onSearch();
    tick(300);

    component.searchTerm = 'test2';
    component.onSearch();
    tick(300);

    expect(emitSpy).toHaveBeenCalledTimes(2);
    expect(emitSpy).toHaveBeenLastCalledWith('test2');
  }));

  it('should unsubscribe on destroy', () => {
    const unsubscribeSpy = jest.spyOn(component['subscription']!, 'unsubscribe');

    component.ngOnDestroy();

    expect(unsubscribeSpy).toHaveBeenCalled();
  });
});
