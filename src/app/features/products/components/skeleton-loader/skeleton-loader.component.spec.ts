import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkeletonLoaderComponent } from './skeleton-loader.component';

describe('SkeletonLoaderComponent', () => {
  let component: SkeletonLoaderComponent;
  let fixture: ComponentFixture<SkeletonLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkeletonLoaderComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(SkeletonLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default 5 rows', () => {
    expect(component.rows).toBe(5);
    expect(component.rowsArray.length).toBe(5);
  });

  it('should render custom number of rows', () => {
    component.rows = 10;
    fixture.detectChanges();

    expect(component.rowsArray.length).toBe(10);
  });

  it('should render skeleton rows in template with default rows', () => {
    fixture.detectChanges();

    const rows = fixture.nativeElement.querySelectorAll('tbody tr');
    expect(rows.length).toBe(5);
  });
});
