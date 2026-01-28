import { Component, Output, EventEmitter, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, Subscription, debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-search-box',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search-box.component.html',
  styleUrl: './search-box.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchBoxComponent implements OnInit, OnDestroy {
  @Output() searchChange = new EventEmitter<string>();

  searchTerm = '';
  private searchSubject = new Subject<string>();
  private subscription?: Subscription;

  ngOnInit(): void {
    this.subscription = this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(term => {
      this.searchChange.emit(term);
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  onSearch(): void {
    this.searchSubject.next(this.searchTerm);
  }

  onClear(): void {
    this.searchTerm = '';
    this.searchSubject.next('');
  }
}
