import { Component, inject, OnInit } from '@angular/core';

import { ProductService } from '../../services/product.service';
import { environment } from '../../environment/environment';
import { CartService } from '../../services/cart.service';
import { ProductResponse } from '../../models/product.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-detail-product',
  templateUrl: './detail-product.component.html',
  styleUrl: './detail-product.component.scss',
})
export class DetailProductComponent implements OnInit {
  productResponse?: ProductResponse;
  productId: number = 0;
  currentImageIndex: number = 0;
  quantity: number = 1;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    debugger;
    const idParam = this.activatedRoute.snapshot.paramMap.get('id');
    debugger;
    if (idParam !== null) {
      this.productId = +idParam;
    }

    if (!isNaN(this.productId)) {
      this.productService.getProductByProductId(this.productId).subscribe({
        next: (productResponse) => {
          debugger;
          if (
            productResponse.productImagesResponse &&
            productResponse.productImagesResponse.length > 0
          ) {
            productResponse.productImagesResponse.forEach(
              (productImageResponse) => {
                productImageResponse.urlImage = `${environment.apiBaseUrl}/products/images/${productImageResponse.imageName}`;
              }
            );
          }
          debugger;
          this.productResponse = productResponse;
          this.showImage(0); // show slide image
        },
        complete: () => {
          debugger;
        },
        error: (error) => {
          debugger;
          console.error('Error fetching detail: ', error);
        },
      });
    } else {
      console.error('Invalid productionId: ', idParam);
    }
  }

  showImage(indexImage: number) {
    debugger;
    if (
      this.productResponse &&
      this.productResponse.productImagesResponse &&
      this.productResponse.productImagesResponse.length > 0
    ) {
      if (indexImage < 0) {
        indexImage = 0;
      } else if (
        indexImage >= this.productResponse.productImagesResponse.length
      ) {
        indexImage = this.productResponse.productImagesResponse.length - 1;
      }

      this.currentImageIndex = indexImage;
    }
  }

  previousImage() {
    this.showImage(this.currentImageIndex - 1);
  }

  nextImage() {
    this.showImage(this.currentImageIndex + 1);
  }

  thumbnailClick(indexImage: number) {
    this.currentImageIndex = indexImage;
  }

  addToCart() {
    debugger;
    if (this.productResponse) {
      this.cartService.addToCart(this.productResponse.id, this.quantity);
    } else {
      console.error('Không thể thêm sản phẩm vào giỏ hàng.');
    }
  }

  increaseQuantity() {
    this.quantity++;
  }

  decreaseQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  buyNow() {
    this.router.navigate(['/orders']);
  }
}
