import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {Actions} from '@ngrx/effects';
import {CartLinesActions} from '../../cart/cart.slice';
import {Item, MultipleLanguage} from '../../constant/interface';

@Component({
  selector: 'app-shop-item',
  templateUrl: './shop-item.component.html',
  styleUrls: ['./shop-item.component.scss']
})
export class ShopItemComponent implements OnInit {

  @Input() data: any;
  productDetails: productItem;

  constructor(private router: Router, private readonly store: Store, private action$: Actions) {
    this.productDetails = {
      id: '', image: '', isBestSeller: undefined, isNew: undefined, name: {en: '', vi: ''}, price: 0
    };
  }

  ngOnInit(): void {
    this.productDetails = {
      id: this.data['id'],
      name: this.data.name,
      image: this.data.image[0],
      price: this.data.price,
      isNew: this.data.isNew,
      isBestSeller: this.data.isBestSeller
    };
  }

  addToCart() {
    console.log('add to cart');
    let itemCart: Item = {
      id: this.productDetails.id,
      quantity: 1,
      name: this.productDetails.name,
      price: this.productDetails.price,
      editable: true,
      extra: [],
      price_str: this.productDetails.price.toString()
    };
    this.store.dispatch(
      CartLinesActions.addToCart.trigger({orderLines: itemCart})
    );
  }

  loadProductDetails() {
    void this.router.navigate(['/shop/item/', this.data.id]);
  }
}

interface productItem {
  id: string,
  name: MultipleLanguage,
  image: string,
  description?: MultipleLanguage,
  price: number,
  isNew: boolean | undefined,
  isBestSeller: boolean | undefined
}
