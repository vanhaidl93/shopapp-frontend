import { ProductResponse } from './product.model';

export interface OrderDetailDto {
  orderId: number;
  productId: number;
  price: number;
  numberOfProducts: number;
  totalMoney: number;
  color: string;
}

export interface OrderDetailResponse {
  id: number;
  orderId: number;
  productResponse: ProductResponse;
  price: number;
  numberOfProducts: number;
  totalMoney: number;
  color: string;
}
