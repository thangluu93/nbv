import {Injectable, ViewChild} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor() {
  }
  addToCart(item: any) {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    let added = false;
    for (let itemInCart of cart) {
      if (item.id === itemInCart.id){
        itemInCart.quantity += item.quantity;
        added = true
      }
    }
    if (!added){
      cart.push(item)
    }
    localStorage.setItem('cart', JSON.stringify(cart));
  }
}
