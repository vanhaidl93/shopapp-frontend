import { Component, Inject, OnInit } from '@angular/core';
import { CategoryDto, CategoryResponse } from '../../models/category.model';
import { CategoryService } from '../../services/category.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-detail.category.admin',
  templateUrl: './update.category.admin.component.html',
  styleUrls: ['./update.category.admin.component.scss'],
})
export class UpdateCategoryAdminComponent implements OnInit {
  categoryId: number = 0;
  categoryDto: CategoryDto = {
    name: '',
  };

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    debugger;
    this.activatedRoute.paramMap.subscribe((params: any) => {
      this.categoryId = Number(params.get('id'));
      this.getCategoryDetails();
    });
  }

  getCategoryDetails(): void {
    debugger;
    this.categoryService.getCategoryById(this.categoryId).subscribe({
      next: (category: CategoryResponse) => {
        this.categoryDto = { ...category };
      },
    });
  }

  updateCategory() {
    debugger;
    const updateCategoryDTO: CategoryDto = {
      name: this.categoryDto.name,
    };
    this.categoryService
      .updateCategory(this.categoryId, updateCategoryDTO)
      .subscribe({
        next: (response: any) => {
          debugger;
        },
        complete: () => {
          debugger;
          this.router.navigate(['/admin/categories']);
        },
        error: (error: any) => {
          debugger;
          console.error('Error fetching categorys:', error);
        },
      });
  }
}
