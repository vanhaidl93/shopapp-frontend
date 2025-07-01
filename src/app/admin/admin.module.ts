import { NgModule } from '@angular/core';
import { AdminComponent } from './admin.component';
import { AdminCategoryComponent } from './admin-category/admin-category.component';
import { AdminOrderComponent } from './admin-order/admin-order.component';
import { AdminProductComponent } from './admin-product/admin-product.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminOrderDetailsComponent } from './admin-order-details/admin-order-details.component';
import { InsertCategoryAdminComponent } from './admin-category-insert/insert.category.admin.component';
import { UpdateCategoryAdminComponent } from './admin-cateogry-update/update.category.admin.component';
import { InsertProductAdminComponent } from './admin-product-insert/insert.product.admin.component';
import { UpdateProductAdminComponent } from './admin-product-update/update.product.admin.component';

@NgModule({
  declarations: [
    AdminComponent,
    AdminCategoryComponent,
    InsertCategoryAdminComponent,
    UpdateCategoryAdminComponent,
    AdminProductComponent,
    InsertProductAdminComponent,
    UpdateProductAdminComponent,
    AdminOrderComponent,
    AdminOrderDetailsComponent,
  ],
  imports: [CommonModule, FormsModule, AdminRoutingModule],
  exports: [AdminComponent],
})
export class AdminModule {}
