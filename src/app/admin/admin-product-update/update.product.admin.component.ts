import { Component, Inject, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from '../../services/category.service';
import { ProductDto, ProductResponse } from '../../models/product.model';
import { CategoryResponse } from '../../models/category.model';
import { ProductImageResponse } from '../../models/product-image.model';
import { environment } from '../../environment/environment';
import { ErrorResponse } from '../../models/response.model';

@Component({
  selector: 'app-detail.product.admin',
  templateUrl: './update.product.admin.component.html',
  styleUrls: ['./update.product.admin.component.scss'],
})
export class UpdateProductAdminComponent implements OnInit {
  productId: number = 0;
  productDto!: ProductDto;
  categories: CategoryResponse[] = [];

  currentImageIndex: number = 0;

  urlImages: string[] = [];
  urlthumbnail: string = '';

  constructor(
    private productService: ProductService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    debugger;
    this.activatedRoute.paramMap.subscribe((params: any) => {
      this.productId = Number(params.get('id'));
      this.getProductDetails();
    });

    this.getCategories(1, 100);
  }

  getCategories(page: number, limit: number) {
    this.categoryService.getCategories(page, limit).subscribe({
      next: (response) => {
        debugger;
        this.categories = response;
      },
      complete: () => {
        debugger;
      },
      error: (error: any) => {
        console.error('Error fetching categories:', error);
      },
    });
  }

  getProductDetails(): void {
    this.productService.getProductByProductId(this.productId).subscribe({
      next: (response) => {
        debugger;
        response.productImagesResponse.forEach(
          (productImage: ProductImageResponse) => {
            productImage.urlImage = `${environment.apiBaseUrl}/products/images/${productImage.imageName}`;
            this.urlImages.push(productImage.urlImage);
          }
        );
        response.urlImage = `${environment.apiBaseUrl}/products/images/${response.thumbnail}`;

        this.urlthumbnail = response.urlImage;
        this.productDto = {
          name: response.name,
          price: response.price,
          description: response.description,
          thumbnail: response.thumbnail,
          categoryId: response.categoryResponse?.id ?? null,
        };
      },
    });
  }

  updateProduct() {
    // Implement your update logic here
    this.productService
      .updateProduct(this.productId, this.productDto!)
      .subscribe({
        next: (response: any) => {
          debugger;
        },
        complete: () => {
          debugger;
          this.router.navigate(['/admin/products']);
        },
        error: (error: any) => {
          debugger;
          console.error('Error fetching products:', error);
        },
      });
  }

  showImage(index: number): void {
    debugger;
    if (this.urlImages && this.urlImages.length > 0) {
      if (index < 0) {
        index = 0;
      } else if (index >= this.urlImages.length) {
        index = this.urlImages.length - 1;
      }
      this.currentImageIndex = index;
    }
  }

  thumbnailClick(index: number) {
    debugger;
    this.currentImageIndex = index;
  }

  nextImage(): void {
    debugger;
    this.showImage(this.currentImageIndex + 1);
  }

  previousImage(): void {
    debugger;
    this.showImage(this.currentImageIndex - 1);
  }

  changeThumbnail(event: any) {
    debugger;
    const input = event.target as HTMLInputElement;
    let thumbnail;
    if (input?.files?.length) {
      thumbnail = input.files[0];
    }

    this.productService.uploadThumbnail(thumbnail!, this.productId).subscribe({
      next: (response) => {
        debugger;
        this.urlthumbnail = `${environment.apiBaseUrl}/products/images/${response.imageName}`;
        this.productDto.thumbnail = response.imageName;
      },
      error: (error: ErrorResponse) => {
        debugger;
        alert(error.errorMessage);
      },
    });
  }

  changeProductImages(event: any) {
    debugger;
    const images = event.target.files;
    // Limit the number of selected files to 5
    if (images.length > 5) {
      alert('Please select a maximum of 5 images.');
      return;
    }
    // Store the selected files in the newProduct object
    this.productService.uploadImages(this.productId, images).subscribe({
      next: (response) => {
        debugger;
        // Reload product details to reflect the new images
        response.imageNames.map((imageName) =>
          this.urlImages.push(
            `${environment.apiBaseUrl}/products/images/${imageName}`
          )
        );
      },
      error: (error: ErrorResponse) => {
        // Handle the error while uploading images
        alert(error.errorMessage);
        console.error('Error uploading images:', error);
      },
    });
  }

  deleteImage(urlImage: string) {
    if (confirm('Are you sure you want to remove this image?')) {
      debugger;
      const length = `${environment.apiBaseUrl}/products/images/`.length;
      const productImageName = urlImage.slice(length);
      // Call the removeImage() method to remove the image
      this.productService.deleteProductImage(productImageName).subscribe({
        next: (response) => {
          const index = this.urlImages.indexOf(
            `${environment.apiBaseUrl}/products/images/${response.imageName}`
          );
          this.urlImages.splice(index, 1);
        },
        error: (error: ErrorResponse) => {
          alert(error.errorMessage);
        },
      });
    }
  }
}
