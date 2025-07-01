import { Component, inject, OnInit } from '@angular/core';

import { CartService } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';
import { OrderService } from '../../services/order.service';
import { environment } from '../../environment/environment';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProductResponse } from '../../models/product.model';
import { OrderDto, OrderResponse } from '../../models/order.model';
import { TokenService } from '../../services/token.service';
import { Router } from '@angular/router';
import { CouponService } from '../../services/coupon.service';
import { ActualAmountResponse } from '../../models/amount.model';
import { ToastService } from '../../services/toast.service';
import { HttpErrorResponse } from '@angular/common/http';
import { PaymentService } from '../../services/payment.service';
import { PaymentDto, PaymentResponse } from '../../models/payment.model';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss',
})
export class OrderComponent implements OnInit {
  cartProducts: { product: ProductResponse; quantity: number }[] = [];
  // update state of cartProducts, doesn't change it.
  newCartProducts: Map<number, number> = new Map();

  couponCode: string = '';
  couponApplied: boolean = false;

  priceCoupon: number = 0;

  // default value for OrderForm (VNPAY by default).
  orderDto: OrderDto = {
    userId: 2,
    fullName: '',
    email: '',
    phoneNumber: '',
    shippingAddress: '',
    note: '',
    totalMoney: 0,
    shippingMethod: 'express',
    paymentMethod: 'vnpay',
    couponCode: '',
    status: 'pending',
    cartItems: [],
    vnpTxnRef: '',
  };

  paymentDto?: PaymentDto;

  // form reactive approach.
  orderForm: FormGroup = new FormGroup({
    fullName: new FormControl('', {
      validators: [Validators.required],
    }),
    email: new FormControl('', {
      validators: [Validators.email, Validators.required],
    }),
    phoneNumber: new FormControl('', {
      validators: [Validators.minLength(10), Validators.required],
    }),
    shippingAddress: new FormControl('', {
      validators: [Validators.minLength(5), Validators.required],
    }),
    note: new FormControl(''),
    shippingMethod: new FormControl<'express' | 'normal'>('express', {
      validators: [Validators.required],
    }),
    paymentMethod: new FormControl<'cod' | 'order'>('cod', {
      validators: [Validators.required],
    }),
  });

  constructor(
    private cartService: CartService,
    private productService: ProductService,
    private orderService: OrderService,
    private tokenService: TokenService,
    private couponService: CouponService,
    private toastService: ToastService,
    private router: Router,
    private paymentService: PaymentService
  ) {}

  ngOnInit(): void {
    debugger;
    this.orderDto.userId = this.tokenService.extractUserIdFromToken();

    const cartItems = this.cartService.getCart();
    const cartProductIds = Array.from(cartItems.keys());

    if (cartProductIds.length === 0) {
      return;
    }

    this.getCartProducts(cartProductIds, cartItems);

    this.orderDto.cartItems = Array.from(cartItems.entries()).map(
      (cartItem) => {
        return {
          productId: cartItem[0],
          quantity: cartItem[1],
        };
      }
    );
  }

  getCartProducts(cartProductIds: number[], cartItems: Map<number, number>) {
    this.productService.getProductsByCartProductIds(cartProductIds).subscribe({
      next: (productsResponses) => {
        this.cartProducts = cartProductIds.map((cartProductId) => {
          const product = productsResponses.find(
            (productResponse) => productResponse.id === cartProductId
          );
          if (product) {
            product.urlImage = `${environment.apiBaseUrl}/products/images/${product.thumbnail}`;
          }
          return {
            product: product!,
            quantity: cartItems.get(cartProductId)!,
          };
        });
      },
      complete: () => {
        this.totalPrice();
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  totalPrice() {
    this.orderDto.totalMoney = this.cartProducts.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  }

  placeOrder() {
    debugger;
    if (this.orderForm.valid) {
      this.orderDto = { ...this.orderDto, ...this.orderForm.value };
      this.paymentDto = {
        amount: this.orderDto.totalMoney,
        bankCode: '',
        language: 'vn',
      };

      // VNPAY METHOD
      if (this.orderDto.paymentMethod === 'vnpay') {
        debugger;

        // step 1: invoke "/createPaymentUrl", create paymentURL point to VNPAY.
        this.paymentService.createPaymentUrl(this.paymentDto).subscribe({
          next: (response: PaymentResponse) => {
            debugger;
            // https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?vnp_Amount=49800&...&vnp_TxnRef=18425732&...
            const paymentUrl = response.data;

            // step 2: extract vnp_TxnRef from paymentURL
            const vnpTxnRef =
              new URL(paymentUrl).searchParams.get('vnp_TxnRef') || '';
            this.orderDto.vnpTxnRef = vnpTxnRef;

            // Step 3: placeOrder, create an order in BE, (save vnp_TxnRef field)
            this.orderService.placeOrder(this.orderDto).subscribe({
              next: (response: OrderResponse) => {
                // Step 4: redirect to VNPAY page.
                // manipulate to actual bank account to charge the payment.
                debugger;
                window.location.href = paymentUrl;
              },
              error: (err: HttpErrorResponse) => {
                debugger;
                this.toastService.showToast({
                  error: err,
                  defaultMsg: 'Lỗi trong quá trình đặt hàng',
                  title: 'Lỗi Đặt Hàng',
                });
              },
            });
          },
          error: (err: HttpErrorResponse) => {
            this.toastService.showToast({
              error: err,
              defaultMsg: 'Lỗi kết nối đến cổng thanh toán',
              title: 'Lỗi Thanh Toán',
            });
          },
        });
      } else {
        debugger;
        // COD METHOD
        this.orderService.placeOrder(this.orderDto).subscribe({
          next: (response: OrderResponse) => {
            debugger;
            // clearn cart in Localstorage.
            this.cartService.clearCart();
            this.router.navigate(['/']); // pending status.
          },
          error: (err: HttpErrorResponse) => {
            debugger;
            this.toastService.showToast({
              error: err,
              defaultMsg: 'Lỗi trong quá trình đặt hàng',
              title: 'Lỗi Đặt Hàng',
            });
          },
        });
      }
    } else {
      this.toastService.showToast({
        error: 'Vui lòng điền đầy đủ thông tin bắt buộc',
        defaultMsg: 'Vui lòng điền đầy đủ thông tin bắt buộc',
        title: 'Lỗi Dữ Liệu',
      });

      this.orderForm.markAllAsTouched();
    }
  }

  validateFullName() {
    return (
      this.orderForm.controls['fullName'].touched &&
      this.orderForm.controls['fullName'].dirty &&
      this.orderForm.controls['fullName'].invalid
    );
  }

  // relate to cartProducts
  decreaseQuantity(index: number): void {
    if (this.cartProducts[index].quantity > 1) {
      this.cartProducts[index].quantity--;

      this.updateCartFromCartItems();
      this.totalPrice();
    }
  }

  increaseQuantity(index: number): void {
    this.cartProducts[index].quantity++;

    this.updateCartFromCartItems();
    this.totalPrice();
  }

  confirmDelete(index: number): void {
    if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      this.cartProducts.splice(index, 1);
      this.updateCartFromCartItems();
      this.totalPrice();
    }
  }

  private updateCartFromCartItems(): void {
    // clear and update a new Map<number,number> from cartProducts.
    this.newCartProducts.clear();
    this.cartProducts.forEach((item) => {
      this.newCartProducts.set(item.product.id, item.quantity);
    });
    // update localStorage ('cart:userId').
    this.cartService.setCart(this.newCartProducts);
  }

  // apply coupon
  applyCoupon(couponCode: string): void {
    if (!this.couponApplied && couponCode) {
      this.totalPrice();
      this.couponService
        .calculateCouponValue(couponCode, this.orderDto.totalMoney)
        .subscribe({
          next: (response: ActualAmountResponse) => {
            this.priceCoupon = this.orderDto.totalMoney - response.actualAmount;
            this.couponApplied = true;
            this.orderDto.totalMoney = response.actualAmount;
            this.orderDto.couponCode = couponCode;
          },
          error: (error) => {
            this.toastService.showToast({
              error: error,
              defaultMsg: 'Mã giảm giá không hợp lệ',
              title: 'Lỗi Coupon',
            });
          },
        });
    }
  }
}
