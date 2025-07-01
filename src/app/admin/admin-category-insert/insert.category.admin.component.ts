import { Component, Inject, OnInit } from '@angular/core';
import { CategoryDto, CategoryResponse } from '../../models/category.model';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from '../../services/category.service';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-insert.category.admin',
  templateUrl: './insert.category.admin.component.html',
  styleUrls: ['./insert.category.admin.component.scss'],
})
export class InsertCategoryAdminComponent implements OnInit {
  categoryDTO: CategoryDto = {
    name: '',
  };
  categories: CategoryResponse[] = [];

  constructor(
    private categoryService: CategoryService,
    private router: Router
  ) {}

  ngOnInit() {}

  insertCategory() {
    this.categoryService.insertCategory(this.categoryDTO).subscribe({
      next: () => {
        debugger;
        this.router.navigate(['/admin/categories']);
      },
      error: (error: any) => {
        debugger;
        // Handle error while inserting the category
        console.error('Error inserting category:', error);
      },
    });
  }
}
