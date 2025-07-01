import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../services/order.service';
import { ToastService } from '../services/toast.service';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-payment-callback',
  templateUrl: './payment-callback.component.html',
  styleUrls: ['./payment-callback.component.scss'],
})
export class PaymentCallbackComponent implements OnInit {
  /* 
  The {domain} specicfied corresponding to "vnpReturnUrl" that's defined in BE.

  https://{domain}/ReturnUrl?vnp_Amount=1000000&vnp_BankCode=NCB
  &vnp_BankTranNo=VNP14226112
  &vnp_CardType=ATM
  &vnp_OrderInfo=Thanh+toan+don+hang+thoi+gian%3A+2023-12-07+17%3A00%3A44
  &vnp_PayDate=20231207170112
  &vnp_ResponseCode=00
  &vnp_TmnCode=CTTVNP01
  &vnp_TransactionNo=14226112
  &vnp_TransactionStatus=00
  &vnp_TxnRef=166117
  &vnp_SecureHash=b6dababca5e07a2d8e32fdd3cf05c29.....
 */

  loading: boolean = true;
  paymentSuccess: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private cartService: CartService,
    private orderService: OrderService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    // retrieve the parameter from VNPAY return.
    this.activatedRoute.queryParams.subscribe((params) => {
      debugger;
      const vnpResponseCode = params['vnp_ResponseCode']; // responseCode from VNPay
      const vnpTxnRef = params['vnp_TxnRef']; // VNPay ref according to orderId
      debugger;
      if (vnpResponseCode === '00') {
        // payment success
        this.handlePaymentSuccess(vnpTxnRef);
      } else {
        // payement failure
        this.handlePaymentFailure();
      }
    });
  }

  handlePaymentSuccess(vnpTxnRef: string): void {
    // update status for order, 'shipped'. successful payment.
    this.orderService.updateOrderStatus(vnpTxnRef, 'shipped').subscribe({
      next: (response) => {
        debugger;
        this.loading = false;
        this.paymentSuccess = true;

        this.toastService.showToast({
          error: null,
          defaultMsg: 'Thanh toán thành công!',
          title: 'Thành Công',
        });

        setTimeout(() => {
          debugger;
          this.cartService.clearCart();
          this.router.navigate(['/']);
        }, 3000);
      },
      error: (error: HttpErrorResponse) => {
        debugger;
        this.loading = false;
        this.paymentSuccess = false;

        this.toastService.showToast({
          error: error,
          defaultMsg: 'Lỗi khi cập nhật trạng thái đơn hàng',
          title: 'Lỗi',
        });

        setTimeout(() => {
          this.router.navigate(['/']);
        }, 3000);
      },
    });
  }

  handlePaymentFailure(): void {
    debugger;
    this.loading = false;
    this.paymentSuccess = false;

    this.toastService.showToast({
      error: null,
      defaultMsg: 'Thanh toán thất bại. Vui lòng thử lại.',
      title: 'Lỗi',
    });

    setTimeout(() => {
      this.router.navigate(['/']);
    }, 3000);
  }
}
