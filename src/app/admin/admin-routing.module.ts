import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { AdminOrderComponent } from './admin-order/admin-order.component';
import { AdminProductComponent } from './admin-product/admin-product.component';
import { AdminCategoryComponent } from './admin-category/admin-category.component';
import { AdminOrderDetailsComponent } from './admin-order-details/admin-order-details.component';
import { NotFoundComponent } from '../not-found/not-found.component';
import { UpdateCategoryAdminComponent } from './admin-cateogry-update/update.category.admin.component';
import { InsertCategoryAdminComponent } from './admin-category-insert/insert.category.admin.component';
import { UpdateProductAdminComponent } from './admin-product-update/update.product.admin.component';
import { InsertProductAdminComponent } from './admin-product-insert/insert.product.admin.component';

const adminRoutes: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'orders', // This will redirect to the default route
      },
      {
        path: 'orders',
        component: AdminOrderComponent,
      },
      {
        path: 'orders/:id',
        component: AdminOrderDetailsComponent,
      },
      {
        path: 'products',
        component: AdminProductComponent,
      },
      {
        path: 'products/update/:id',
        component: UpdateProductAdminComponent,
      },
      {
        path: 'products/insert',
        component: InsertProductAdminComponent,
      },
      {
        path: 'categories',
        component: AdminCategoryComponent,
      },
      {
        path: 'categories/update/:id',
        component: UpdateCategoryAdminComponent,
      },
      {
        path: 'categories/insert',
        component: InsertCategoryAdminComponent,
      },
      {
        path: '**',
        component: NotFoundComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(adminRoutes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
