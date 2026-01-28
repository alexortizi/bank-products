import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from '@core/models/product.model';
import { environment } from '../../../environments/environment';

interface ApiResponse<T> {
  data: T;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  getProducts(): Observable<Product[]> {
    return this.http.get<ApiResponse<Product[]>>(this.apiUrl).pipe(
      map(response => response.data)
    );
  }

  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  createProduct(product: Product): Observable<Product> {
    return this.http.post<ApiResponse<Product>>(this.apiUrl, product).pipe(
      map(response => response.data)
    );
  }

  updateProduct(id: string, product: Product): Observable<Product> {
    return this.http.put<ApiResponse<Product>>(`${this.apiUrl}/${id}`, product).pipe(
      map(response => response.data)
    );
  }

  deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  verifyId(id: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/verification/${id}`);
  }
}
