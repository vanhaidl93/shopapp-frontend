import { Component, inject, OnInit } from '@angular/core';

import { OrderService } from '../../services/order.service';
import { OrderResponse } from '../../models/order.model';
import { ProductResponse } from '../../models/product.model';
import { environment } from '../../environment/environment';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrl: './order-detail.component.scss',
})
export class OrderDetailComponent implements OnInit {
  order: OrderResponse = {
    id: 0,
    userId: 0,
    fullName: '',
    email: '',
    phoneNumber: '',
    address: '',
    note: '',
    totalMoney: 0,
    shippingMethod: '',
    shippingAddress: '',
    paymentMethod: '',
    orderDate: new Date(),
    status: '',
    shippingDate: new Date(),
    trackingNumber: '',
    active: false,
    orderDetailsResponse: [],
    vnpTxnRef: '',
  };
  couponCode: string = '';

  constructor(
    private orderService: OrderService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getOrder();
  }

  getOrder() {
    debugger;
    const orderId = Number(
      this.activatedRoute.snapshot.paramMap.get('orderId')
    );
    this.orderService.getOrderByOrderId(orderId).subscribe({
      next: (orderResponse) => {
        debugger;
        if (orderResponse.orderDetailsResponse) {
          orderResponse.orderDetailsResponse.map((orderDetail) => {
            orderDetail.productResponse.urlImage = `${environment.apiBaseUrl}/products/images/${orderDetail.productResponse.thumbnail}`;
          });
        }

        debugger;
        this.order = orderResponse;
      },
      complete: () => {
        debugger;
      },
      error: (error) => {
        debugger;
        console.error(error);
      },
    });
  }
}
