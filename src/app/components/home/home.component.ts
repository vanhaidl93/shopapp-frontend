import { AfterContentChecked, Component, inject, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { environment } from '../../environment/environment';

import { CategoryService } from '../../services/category.service';
import { ProductResponse } from '../../models/product.model';
import { CategoryResponse } from '../../models/category.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  products: ProductResponse[] = [];
  pageNumber: number = 1;
  pageSize = 9;
  pages: number[] = [];
  totalPages: number = 0;
  visiblePages: number[] = [];
  keywordSearch: string = '';
  selectedCategoryId: number = 0;
  categories: CategoryResponse[] = [];

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getProducts(
      this.keywordSearch,
      this.selectedCategoryId,
      this.pageNumber,
      this.pageSize
    );
    this.getCategory();
  }

  searchProcduct() {
    // set default visible page.
    this.pageNumber = 1;
    this.pageSize = 9;

    this.getProducts(
      this.keywordSearch,
      this.selectedCategoryId,
      this.pageNumber,
      this.pageSize
    );
  }

  getCategory() {
    this.categoryService
      .getCategories(this.pageNumber, this.pageSize)
      .subscribe({
        next: (response) => {
          debugger;
          this.categories = response;
        },
        complete: () => {
          debugger;
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  getProducts(
    keywordSearch: string,
    selectedCategoryId: number,
    pageNumber: number,
    pageSize: number
  ) {
    debugger;
    this.productService
      .getProducts(keywordSearch, selectedCategoryId, pageNumber, pageSize)
      .subscribe({
        next: (response) => {
          debugger;
          response.productsResponse.forEach((productResponse) => {
            productResponse.urlImage = `${environment.apiBaseUrl}/products/images/${productResponse.thumbnail}`;
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
        error: (error) => {
          debugger;
          console.error(error);
        },
      });
  }

  onPageChange(pageNumber: number) {
    // debugger;
    this.pageNumber = pageNumber;
    this.getProducts(
      this.keywordSearch,
      this.selectedCategoryId,
      this.pageNumber,
      this.pageSize
    );
  }

  generateVisiblePageArray(pageNumer: number, totalPages: number): number[] {
    const maxVisiblePages = 5;
    const halfVisiblePages = Math.floor(maxVisiblePages / 2); // 2

    // total: 10
    // pageNumber: 1,2,3; start: 1 -> end: 5

    // pageNumber: 4 ; start: 2 -> end: 6

    let startPage = Math.max(pageNumer - halfVisiblePages, 1);
    let endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);

    if (endPage - startPage + 1 < maxVisiblePages) {
      // pageNumber: 9, start: 7 -> end: 10
      // --> start: 10 - 5 + 1, 1 = 6 -> end: 10
      startPage = Math.max(endPage - maxVisiblePages + 1, 1);
    }

    return new Array(endPage - startPage + 1) //5
      .fill(0)
      .map((_, index) => startPage + index);
  }

  chooseProduct(productId: number) {
    this.router.navigate(['/products', productId]);
  }

  getBuy() {
    this.router.navigate(['/order']);
  }
}
