import { Component, computed, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { v4 as uuidv4 } from 'uuid';

interface Product {
  id: number;
  name: string;
  price: number;
}

interface Cart {
  id: string;
  productId: number;
  product: Product;
  quantity: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class AppComponent {
  title = 'angular-signals';

  products = signal<Product[]>([
    { id: 1, name: 'Nike Waffle One By You', price: 1939000 },
    { id: 2, name: 'Nike Air Max Terrascape 90', price: 2379000 },
    { id: 3, name: 'Nike Air Max Dawn', price: 1649000 },
  ]);

  carts = signal<Cart[]>([]);

  totalPrice = computed(() => {
    let sum = 0;

    const carts: Cart[] = this.carts().map((item: Cart) => {
      return {
        ...item,
        product: this.findProduct(item.productId),
      };
    });

    carts.forEach((item: Cart) => {
      sum += item.product.price * item.quantity;
    });

    return sum;
  });

  logger = effect(() => {
    localStorage.setItem('angular-signals-carts', JSON.stringify(this.carts()));
  });

  constructor() {
    const storage = localStorage.getItem('angular-signals-carts') as any;

    if (storage) {
      this.carts.update((cart) => JSON.parse(storage));
    }
  }

  findProduct(id: number) {
    return this.products().find((product) => product.id === id) as Product;
  }

  findCart(id: number) {
    return this.carts().find((cart) => cart.productId === id);
  }

  addToCart(id: number) {
    if (!this.findCart(id)) {
      this.carts.update((cart) => [
        ...cart,
        {
          id: uuidv4(),
          productId: id,
          product: this.findProduct(id),
          quantity: 1,
        },
      ]);
    }
  }

  changeQuantity(id: number, quantity: number) {
    if (Number(quantity) === 0) {
      this.deleteCart(id);
    } else {
      this.carts.update((cart) => {
        return cart.map((item) => {
          if (item.productId === id) {
            return { ...item, quantity };
          }

          return item;
        });
      });
    }
  }

  deleteCart(id: number) {
    this.carts.update((cart) => {
      const indexToRemove = cart.findIndex((item) => item.productId === id);
      cart.splice(indexToRemove, 1);
      return cart;
    });
  }
}
