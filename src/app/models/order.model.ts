import { OrderDetailResponse } from './order-detail.model';

export interface OrderDto {
  userId: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  shippingAddress: string;
  note: string;
  totalMoney: number;
  shippingMethod: string;
  paymentMethod: string;
  couponCode: string;
  status: String;

  cartItems: { productId: number; quantity: number }[];

  vnpTxnRef: string;
}

export interface OrderResponse {
  id: number;
  userId: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  address: string;
  note: string;
  totalMoney: number;
  shippingMethod: string;
  shippingAddress: string;
  paymentMethod: string;
  orderDate: Date;
  status: string;
  shippingDate: Date;
  trackingNumber: string;
  active: boolean;
  orderDetailsResponse: OrderDetailResponse[];

  vnpTxnRef: string;
}

export interface OrdersResponsePage {
  ordersResponse: OrderResponse[];
  currentPage: number;
  totalPages: number;
}
