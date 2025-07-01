import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { environment } from '../environment/environment';
import { Observable } from 'rxjs';
import {
  OrderDto,
  OrderResponse,
  OrdersResponsePage,
} from '../models/order.model';
import { SuccessResponse } from '../models/response.model';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private urlOrders = `${environment.apiBaseUrl}/orders`;

  constructor(private httpClient: HttpClient) {}

  placeOrder(order: OrderDto): Observable<OrderResponse> {
    return this.httpClient.post<OrderResponse>(this.urlOrders, order);
  }

  getOrderByOrderId(orderId: number): Observable<OrderResponse> {
    return this.httpClient.get<OrderResponse>(`${this.urlOrders}/${orderId}`);
  }

  getAllOrdersPage(
    keyword: string,
    pageNumber: number,
    pageSize: number
  ): Observable<OrdersResponsePage> {
    const params = new HttpParams()
      .set('keyword', keyword)
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    return this.httpClient.get<OrdersResponsePage>(
      `${this.urlOrders}/search-keyword`,
      {
        params,
      }
    );
  }

  updateOrder(orderId: number, orderDto: OrderDto) {
    debugger;
    const url = `${this.urlOrders}/${orderId}`;
    return this.httpClient.put(url, orderDto);
  }

  updateOrderStatus(
    vnpTxnRef: string,
    status: string
  ): Observable<SuccessResponse> {
    const url = `${environment.apiBaseUrl}/orders/${vnpTxnRef}/status`;
    const params = new HttpParams().set('status', status);
    return this.httpClient.put<SuccessResponse>(url, null, { params });
  }

  deleteOrder(orderId: number): Observable<any> {
    const url = `${environment.apiBaseUrl}/orders/${orderId}`;
    return this.httpClient.delete(url);
  }
}
