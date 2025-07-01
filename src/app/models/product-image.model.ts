export interface ProductImageDto {
  productId: number;
  imageName: string;
}

export interface ProductImageResponse {
  id: number;
  productId: number;
  imageName: string;

  urlImage: string;
}
