import { HttpStatusCode } from '@angular/common/http';

export interface PaymentDto {
  amount: number;
  bankCode: string;
  language: string;
}

export interface PaymentQueryDto {
  orderId: number;
  transDate: Date;
  ipAddress: string;
}

export interface PaymentRefundDto {
  transactionType: string;
  orderId: number;
  amount: number;
  transactionDate: Date;
  createBy: Date;
  ipAddress: string;
}

export interface PaymentResponse {
  message: string;
  status: HttpStatusCode;
  data: string;
}
