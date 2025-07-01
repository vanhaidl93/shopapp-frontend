import { Component, Inject, OnInit } from '@angular/core';
import { ProductDto, ProductResponse } from '../../models/product.model';
import { CategoryResponse } from '../../models/category.model';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from '../../services/category.service';
import { ProductService } from '../../services/product.service';
import { FormsModule } from '@angular/forms';
import { environment } from '../../environment/environment';
import { ErrorResponse } from '../../models/response.model';
import { take } from 'rxjs';

@Component({
  selector: 'app-insert.product.admin',
  templateUrl: './insert.product.admin.component.html',
  styleUrls: ['./insert.product.admin.component.scss'],
})
export class InsertProductAdminComponent implements OnInit {
  productId?: number;
  productDTO: ProductDto = {
    name: '',
    price: 0,
    description: '',
    categoryId: 0,
    thumbnail: '',
  };
  categories: CategoryResponse[] = [];

  thumbnail?: File;
  urlThumbnailReview: string = '';
  urlThumbnail: string = '';

  images: File[] = [];
  urlImagesReview: string[] = [];
  urlImages: string[] = [];

  constructor(
    private categoryService: CategoryService,
    private productService: ProductService
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
      error: (error) => {
        console.error('Error fetching categories:', error);
      },
    });
  }

  insertThumbnail(event: any) {
    debugger;
    const input = event.target as HTMLInputElement;

    if (input.files && input.files[0]) {
      this.thumbnail = event.target.files[0];

      // review an image using FileReader
      const reader = new FileReader();
      reader.onload = () => {
        this.urlThumbnailReview = reader.result as string; // base64 data URL
      };
      reader.readAsDataURL(this.thumbnail!); // convert to base64
    }
  }

  insertProductImages(event: any) {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) return;
    if (input.files.length > 5) {
      alert('Images exceeded 5!');
      return;
    }

    this.images = [];
    this.urlImagesReview = [];

    // review multiple images using FileReader
    Array.from(input.files).forEach((file: File) => {
      if (!file.type.startsWith('image/')) return;
      this.images.push(file);
      const reader = new FileReader();
      reader.onload = () => {
        this.urlImagesReview.push(reader.result as string);
      };
      reader.readAsDataURL(file);
    });
  }

  insertProduct() {
    debugger;
    this.productService.insertProduct(this.productDTO).subscribe({
      next: (response: ProductResponse) => {
        debugger;
        this.productId = response.id;

        // update productImages
        debugger;
        if (this.images.length > 0) {
          this.productService
            .uploadImages(this.productId, this.images)
            .subscribe({
              next: (response) => {
                debugger;
                this.urlImages = response.imageNames.map(
                  (imageName) =>
                    `${environment.apiBaseUrl}/products/images/${imageName}`
                );
              },
              error: (error: ErrorResponse) => {
                debugger;
                alert(error.errorMessage);
              },
            });
        }

        // update thumbnail
        debugger;
        if (this.thumbnail) {
          this.productService
            .uploadThumbnail(this.thumbnail!, this.productId)
            .subscribe({
              next: (response) => {
                debugger;
                this.urlThumbnail = `${environment.apiBaseUrl}/products/images/${response.imageName}`;
              },
            });
        }
      },
      complete: () => {
        alert(`Insert Product successfully - productId: ${this.productId}.`);
      },
      error: (error: ErrorResponse) => {
        debugger;
        alert(error.errorMessage);
      },
    });
  }
}
