import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environment/environment';
import { PaymentDto, PaymentResponse } from '../models/payment.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private urlPayments = `${environment.apiBaseUrl}/payments`;

  constructor(private httpClient: HttpClient) {}

  createPaymentUrl(paymentDto: PaymentDto): Observable<PaymentResponse> {
    debugger;
    return this.httpClient.post<PaymentResponse>(
      `${this.urlPayments}/createPaymentUrl`,
      paymentDto
    );
  }
}
