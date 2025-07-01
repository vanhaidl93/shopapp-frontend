import { Component, Inject, inject } from '@angular/core';
import { OrderResponse } from '../../models/order.model';
import { OrderService } from '../../services/order.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-order',
  templateUrl: './admin-order.component.html',
  styleUrl: './admin-order.component.scss',
})
export class AdminOrderComponent {
  ordersReponse: OrderResponse[] = [];
  pageNumber: number = 1;
  pageSize: number = 12;
  pages: number[] = [];
  totalPages: number = 0;
  keyword: string = '';
  visiblePages: number[] = [];

  constructor(private orderService: OrderService, private router: Router) {}

  ngOnInit(): void {
    debugger;
    this.pageNumber =
      Number(localStorage.getItem('currentOrderAdminPage')) || 1;
    this.getAllOrders(this.keyword, this.pageNumber, this.pageSize);
  }

  searchOrders() {
    this.pageNumber = 1;
    this.pageSize = 12;

    debugger;
    this.getAllOrders(this.keyword.trim(), this.pageNumber, this.pageSize);
  }

  getAllOrders(keyword: string, pageNumber: number, pageSize: number) {
    debugger;
    this.orderService
      .getAllOrdersPage(keyword, pageNumber, pageSize)
      .subscribe({
        next: (ordersResponsePage) => {
          debugger;
          this.ordersReponse = ordersResponsePage.ordersResponse;
          this.totalPages = ordersResponsePage.totalPages;

          this.visiblePages = this.generateVisiblePageArray(
            this.pageNumber,
            this.totalPages
          );
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

  onPageChange(pageNumber: number) {
    debugger;
    this.pageNumber = pageNumber;
    localStorage.setItem('currentOrderAdminPage', String(this.pageNumber));
    this.getAllOrders(this.keyword, this.pageNumber, this.pageSize);
  }

  generateVisiblePageArray(pageNumber: number, totalPages: number): number[] {
    debugger;
    const maxVisiblePages = 5;
    const halfVisiblePages = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(pageNumber - halfVisiblePages, 1);
    let endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);

    // in the end of visible page, reach out totablPages = endPage.
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(endPage - maxVisiblePages + 1, 1);
    }

    return new Array(endPage - startPage + 1)
      .fill(0)
      .map((_, index) => startPage + index);
  }

  deleteOrder(id: number) {
    const confirmation = window.confirm(
      'Are you sure you want to delete this order?'
    );
    if (confirmation) {
      debugger;
      this.orderService.deleteOrder(id).subscribe({
        next: (response) => {
          debugger;
          location.reload();
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

  viewDetails(orderResponse: OrderResponse) {
    this.router.navigate(['/admin/orders', orderResponse.id]);
  }
}
