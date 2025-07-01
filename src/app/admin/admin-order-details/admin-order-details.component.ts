import { Component, inject } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderDto, OrderResponse } from '../../models/order.model';
import { environment } from '../../environment/environment';

@Component({
  selector: 'app-admin-order-detail',
  templateUrl: './admin-order-details.component.html',
  styleUrl: './admin-order-details.component.scss',
})
export class AdminOrderDetailsComponent {
  orderId: number = 0;
  orderResponse?: OrderResponse;

  orderDto: OrderDto = {
    userId: 0,
    fullName: '',
    email: '',
    phoneNumber: '',
    shippingAddress: '',
    totalMoney: 0,
    note: '',
    shippingMethod: '',
    paymentMethod: '',
    couponCode: '',
    status: '',
    cartItems: [],
    vnpTxnRef: '',
  };

  constructor(
    private orderService: OrderService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getOrderDetails();
  }

  getOrderDetails(): void {
    debugger;
    this.orderId = Number(this.activatedRoute.snapshot.paramMap.get('id'));

    this.orderService.getOrderByOrderId(this.orderId).subscribe({
      next: (response) => {
        debugger;
        response.orderDetailsResponse.map((orderDetailResponse) => {
          orderDetailResponse.productResponse.urlImage = `${environment.apiBaseUrl}/products/images/${orderDetailResponse.productResponse.thumbnail}`;
          return orderDetailResponse;
        });

        this.orderResponse = response;

        this.orderDto = {
          userId: response.userId,
          fullName: response.fullName,
          email: response.email,
          phoneNumber: response.phoneNumber,
          shippingAddress: response.shippingAddress,
          note: response.note,
          totalMoney: response.totalMoney,
          shippingMethod: response.shippingMethod,
          paymentMethod: response.paymentMethod,
          couponCode: '',
          status: response.status,
          cartItems: [],
          vnpTxnRef: '',
        };
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

  updateOrder(): void {
    debugger;
    this.orderService.updateOrder(this.orderId, this.orderDto!).subscribe({
      next: (response: any) => {
        debugger;
        // Handle the successful update
        console.log('Order updated successfully:', response);
        // Navigate back to the previous page
        this.router.navigate(['../'], { relativeTo: this.activatedRoute });
      },
      complete: () => {
        debugger;
      },
      error: (error) => {
        // Handle the error
        debugger;
        console.error(error);
      },
    });
  }
}
