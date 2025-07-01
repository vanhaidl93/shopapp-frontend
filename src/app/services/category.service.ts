import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../environment/environment';
import { CategoryDto, CategoryResponse } from '../models/category.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private apiBaseUrlCategories = `${environment.apiBaseUrl}/categories`;

  constructor(private httpClient: HttpClient) {}

  getCategories(
    pageNumer: number,
    pageSize: number
  ): Observable<CategoryResponse[]> {
    const params = new HttpParams()
      .set('pageNumber', pageNumer.toString())
      .set('pageSize', pageSize.toString());
    return this.httpClient.get<CategoryResponse[]>(
      `${environment.apiBaseUrl}/categories`,
      {
        params,
      }
    );
  }

  getCategoryById(id: number): Observable<CategoryResponse> {
    debugger;
    return this.httpClient.get<CategoryResponse>(
      `${this.apiBaseUrlCategories}/${id}`
    );
  }

  deleteCategory(id: number): Observable<any> {
    debugger;
    return this.httpClient.delete(`${this.apiBaseUrlCategories}/${id}`);
  }

  updateCategory(
    id: number,
    categoryDto: CategoryDto
  ): Observable<CategoryResponse> {
    return this.httpClient.put<CategoryResponse>(
      `${this.apiBaseUrlCategories}/${id}`,
      categoryDto
    );
  }

  insertCategory(categoryDto: CategoryDto): Observable<any> {
    return this.httpClient.post(`${this.apiBaseUrlCategories}`, categoryDto);
  }
}
