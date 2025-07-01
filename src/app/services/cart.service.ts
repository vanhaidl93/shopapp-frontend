import { Inject, inject, Injectable } from '@angular/core';
import { ProductService } from './product.service';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartItems: Map<number, number> = new Map(); // <productId, quantity>

  constructor() {}

  addToCart(productId: number, quantity: number = 1) {
    debugger;
    if (this.cartItems.has(productId)) {
      this.cartItems.set(productId, this.cartItems.get(productId)! + quantity);
    } else {
      this.cartItems.set(productId, quantity);
    }
    this.saveCartToLocalStorage();
  }

  getCart() {
    const storeCart = localStorage.getItem(this.getCartKey());
    if (storeCart) {
      this.cartItems = new Map(JSON.parse(storeCart));
    }
    return this.cartItems;
  }

  setCart(newCartItems: Map<number, number>) {
    // "??"" circute breaker for non null or non undefined, accept 0.
    this.cartItems = newCartItems ?? new Map<number, number>();
    this.saveCartToLocalStorage();
  }

  clearCart() {
    this.cartItems.clear();
    this.saveCartToLocalStorage();
  }

  private saveCartToLocalStorage() {
    localStorage.setItem(
      this.getCartKey(),
      JSON.stringify(Array.from(this.cartItems.entries()))
    );
  }

  private getCartKey() {
    const userResponseJSON = localStorage.getItem('userResponse');
    const userResponse = JSON.parse(userResponseJSON!);
    return `cart:${userResponse.id}`;
  }
}
