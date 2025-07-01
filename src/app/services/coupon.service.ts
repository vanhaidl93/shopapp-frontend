import { Inject, Injectable } from '@angular/core';
import { environment } from '../environment/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ActualAmountResponse } from '../models/amount.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CouponService {
  private apiBaseUrl = environment.apiBaseUrl;

  constructor(private httpClient: HttpClient) {}

  calculateCouponValue(
    couponCode: string,
    totalAmount: number
  ): Observable<ActualAmountResponse> {
    const url = `${this.apiBaseUrl}/coupons/calculate`;
    const params = new HttpParams()
      .set('couponCode', couponCode)
      .set('totalAmount', totalAmount);

    return this.httpClient.get<ActualAmountResponse>(url, {
      params,
    });
  }
}
