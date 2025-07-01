import { Component, Inject } from '@angular/core';
import {
  ProductResponse,
  ProductsResponsePage,
} from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { Router } from '@angular/router';
import { environment } from '../../environment/environment';

@Component({
  selector: 'app-admin-product',
  templateUrl: './admin-product.component.html',
  styleUrl: './admin-product.component.scss',
})
export class AdminProductComponent {
  products: ProductResponse[] = [];
  categoryId: number = 0;
  pageNumber: number = 0;
  pageSize: number = 5;
  pages: number[] = [];
  totalPages: number = 0;
  visiblePages: number[] = [];
  keyword: string = '';

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit() {
    this.pageNumber =
      Number(localStorage.getItem('currentProductAdminPage')) || 1;

    this.getProducts(
      this.keyword,
      this.categoryId,
      this.pageNumber,
      this.pageSize
    );
  }

  searchProducts() {
    this.pageNumber = 1;
    this.pageSize = 5;

    debugger;
    this.getProducts(
      this.keyword.trim(),
      this.categoryId,
      this.pageNumber,
      this.pageSize
    );
  }

  getProducts(
    keyword: string,
    categoryId: number,
    pageNumber: number,
    pageSize: number
  ) {
    debugger;
    this.productService
      .getProducts(keyword, categoryId, pageNumber, pageSize)
      .subscribe({
        next: (response) => {
          debugger;
          response.productsResponse.forEach((product: ProductResponse) => {
            if (product) {
              product.urlImage = `${environment.apiBaseUrl}/products/images/${product.thumbnail}`;
            }
          });
          this.products = response.productsResponse;
          this.totalPages = response.totalPages;

          this.visiblePages = this.generateVisiblePageArray(
            this.pageNumber,
            this.totalPages
          );
        },
        complete: () => {
          debugger;
        },
        error: (error: any) => {
          debugger;
          console.error('Error fetching products:', error);
        },
      });
  }

  onPageChange(pageNumber: number) {
    debugger;
    this.pageNumber = pageNumber;
    localStorage.setItem('currentProductAdminPage', String(this.pageNumber));
    this.getProducts(
      this.keyword,
      this.categoryId,
      this.pageNumber,
      this.pageSize
    );
  }

  generateVisiblePageArray(pageNumber: number, totalPages: number): number[] {
    debugger;
    const maxVisiblePages = 5;
    const halfVisiblePages = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(pageNumber - halfVisiblePages, 1);
    let endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);

    // in the end of visible page, reach out totablPages = endPage.
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(endPage - maxVisiblePages + 1, 1);
    }

    return new Array(endPage - startPage + 1)
      .fill(0)
      .map((_, index) => startPage + index);
  }

  insertProduct() {
    debugger;
    this.router.navigate(['/admin/products/insert']);
  }

  updateProduct(productId: number) {
    debugger;
    this.router.navigate(['/admin/products/update', productId]);
  }

  deleteProduct(product: ProductResponse) {
    const confirmation = window.confirm(
      'Are you sure you want to delete this product?'
    );
    if (confirmation) {
      debugger;
      this.productService.deleteProduct(product.id).subscribe({
        next: (response: any) => {
          debugger;
          alert('Xóa thành công');
          location.reload();
        },
        complete: () => {
          debugger;
        },
        error: (error: any) => {
          debugger;
          alert(error.error);
          console.error('Error fetching products:', error);
        },
      });
    }
  }
}
