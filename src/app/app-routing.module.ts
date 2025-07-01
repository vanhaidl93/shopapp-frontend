import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { DetailProductComponent } from './components/detail-product/detail-product.component';
import { OrderComponent } from './components/order/order.component';
import { OrderDetailComponent } from './components/order-detail/order-detail.component';
import { adminGuard, authGuard } from './route-guards/auth.guards';
import { UserProfileComponent } from './components/user-profile/user-profile.component';

import { NotFoundComponent } from './not-found/not-found.component';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin/admin.component';
import { AdminGuardFn } from './route-guards/admin.guard';
import { PaymentCallbackComponent } from './payment-callback/payment-callback.component';
import { AuthCallbackComponent } from './components/auth-callback/auth-callback.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'products/:id',
    component: DetailProductComponent,
  },
  {
    path: 'orders',
    component: OrderComponent,
    canActivate: [authGuard],
  },
  {
    path: 'orders/:id',
    component: OrderDetailComponent,
  },
  {
    path: 'profile',
    component: UserProfileComponent,
    canActivate: [authGuard],
  },
  //Admin
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AdminGuardFn],
  },
  // vnpay - payment callback
  { path: 'payments/paymentCallback', component: PaymentCallbackComponent },
  // redirect-url of social Auth Server.
  { path: 'auth/google/callback', component: AuthCallbackComponent },
  { path: 'auth/facebook/callback', component: AuthCallbackComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes), CommonModule],
  exports: [RouterModule],
})
export class AppRoutingModule {}
