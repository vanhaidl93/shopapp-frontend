import { NgModule } from '@angular/core';

import { HomeComponent } from './components/home/home.component';
import { BrowserModule } from '@angular/platform-browser';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { OrderComponent } from './components/order/order.component';

import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { DetailProductComponent } from './components/detail-product/detail-product.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  HTTP_INTERCEPTORS,
  HttpClientModule,
  provideHttpClient,
} from '@angular/common/http';
import { TokenInterceptor } from './interceptors/token.interceptor';
import { OrderDetailComponent } from './components/order-detail/order-detail.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { AdminModule } from './admin/admin.module';
import { CommonModule } from '@angular/common';
import { AuthCallbackComponent } from './components/auth-callback/auth-callback.component';
import { PaymentCallbackComponent } from './payment-callback/payment-callback.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    FooterComponent,
    HeaderComponent,
    OrderComponent,
    OrderDetailComponent,
    LoginComponent,
    RegisterComponent,
    DetailProductComponent,
    UserProfileComponent,
    NotFoundComponent,
    PaymentCallbackComponent,
    AuthCallbackComponent,
  ],
  imports: [
    BrowserModule, // special module for root module

    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    CommonModule,

    AppRoutingModule, // overal router
    AdminModule, // admin module insclude admin router
  ],
  bootstrap: [AppComponent],
  providers: [
    provideHttpClient(),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
  ],
})
export class AppModule {}
