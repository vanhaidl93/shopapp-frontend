import { Component, Inject } from '@angular/core';
import { CategoryDto, CategoryResponse } from '../../models/category.model';
import { CategoryService } from '../../services/category.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-category',
  templateUrl: './admin-category.component.html',
  styleUrl: './admin-category.component.scss',
})
export class AdminCategoryComponent {
  categories: CategoryResponse[] = [];

  constructor(
    private categoryService: CategoryService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getCategories(1, 100);
  }

  getCategories(page: number, limit: number) {
    this.categoryService.getCategories(page, limit).subscribe({
      next: (categories: CategoryResponse[]) => {
        debugger;
        this.categories = categories;
      },
      complete: () => {
        debugger;
      },
      error: (error: any) => {
        console.error('Error fetching categories:', error);
      },
    });
  }

  insertCategory() {
    debugger;
    this.router.navigate(['/admin/categories/insert']);
  }

  updateCategory(categoryId: number) {
    debugger;
    this.router.navigate(['/admin/categories/update', categoryId]);
  }

  deleteCategory(category: CategoryResponse) {
    const confirmation = window.confirm(
      'Are you sure you want to delete this category?'
    );
    if (confirmation) {
      debugger;
      this.categoryService.deleteCategory(category.id).subscribe({
        next: (response: string) => {
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
          console.error('Error fetching categories:', error);
        },
      });
    }
  }
}
