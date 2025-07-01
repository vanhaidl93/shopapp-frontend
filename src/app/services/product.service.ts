import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../environment/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import {
  ProductDto,
  ProductResponse,
  ProductsResponsePage,
} from '../models/product.model';
import {
  ImageNameResponse,
  ImageNamesResponse,
} from '../models/image.model copy';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiProducts = `${environment.apiBaseUrl}/products`;

  constructor(private httpClient: HttpClient) {}

  getProducts(
    keyword: string,
    categoryId: number,
    pageNumber: number,
    pageSize: number
  ): Observable<ProductsResponsePage> {
    const params = new HttpParams()
      .set('keyword', keyword.toString())
      .set('categoryId', categoryId.toString())
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    return this.httpClient.get<ProductsResponsePage>(`${this.apiProducts}`, {
      params,
    });
  }

  getProductByProductId(productId: number): Observable<ProductResponse> {
    return this.httpClient.get<ProductResponse>(
      this.apiProducts + `/${productId}`
    );
  }

  getProductsByCartProductIds(
    cartProductIds: number[]
  ): Observable<ProductResponse[]> {
    const params = new HttpParams().set(
      'cartProductIds',
      cartProductIds.join(',')
    );
    return this.httpClient.get<ProductResponse[]>(
      `${this.apiProducts}/cartProductIds`,
      {
        params,
      }
    );
  }

  deleteProduct(productId: number): Observable<string> {
    debugger;
    return this.httpClient.delete<string>(`${this.apiProducts}/${productId}`);
  }

  updateProduct(productId: number, productDto: ProductDto): Observable<any> {
    return this.httpClient.put<any>(
      `${this.apiProducts}/${productId}`,
      productDto
    );
  }

  insertProduct(productDTO: ProductDto): Observable<ProductResponse> {
    return this.httpClient.post<ProductResponse>(
      `${this.apiProducts}`,
      productDTO
    );
  }

  uploadImages(
    productId: number,
    files: File[]
  ): Observable<ImageNamesResponse> {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }
    // Upload images for the specified product id
    return this.httpClient.post<ImageNamesResponse>(
      `${this.apiProducts}/uploads/${productId}`,
      formData
    );
  }

  uploadThumbnail(
    file: File,
    productId: number
  ): Observable<ImageNameResponse> {
    debugger;
    const formData = new FormData();
    formData.append('file', file);

    return this.httpClient.post<ImageNameResponse>(
      `${this.apiProducts}/uploads/thumbnail/${productId}`,
      formData
    );
  }

  deleteProductImage(productImageName: string): Observable<ImageNameResponse> {
    debugger;
    return this.httpClient.delete<ImageNameResponse>(
      `${environment.apiBaseUrl}/productImages/${productImageName}`
    );
  }
}
