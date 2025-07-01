import { CategoryResponse } from './category.model';
import { ProductImageResponse } from './product-image.model';

export interface ProductDto {
  name: string;
  price: number;
  description: string;
  thumbnail: string;
  categoryId: number | null;
}

export interface ProductResponse {
  id: number;
  name: string;
  price: number;
  description: string;
  thumbnail: string;
  categoryResponse: CategoryResponse;
  productImagesResponse: ProductImageResponse[];

  urlImage: string;
}

export interface ProductsResponsePage {
  productsResponse: ProductResponse[];
  currentPage: number;
  totalPages: number;
}
