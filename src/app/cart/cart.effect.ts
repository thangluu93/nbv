import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';
import {Actions, concatLatestFrom, createEffect, ofType} from '@ngrx/effects';
import {CartLinesActions, CartSelectors} from './cart.slice';
import {map, switchMap} from 'rxjs/operators';
import {timer} from 'rxjs';
import {Item} from '../constant/interface';
import * as _ from 'lodash'

@Injectable()
export class CartEffect {

  constructor(
    private readonly action$: Actions,
    private readonly store: Store
  ) {
  }

  readonly cartEffect = createEffect(() => this.action$.pipe(
    ofType(CartLinesActions.addToCart.trigger),
    concatLatestFrom(() => this.store.select(CartSelectors.selectCartState)),
    switchMap(([{orderLines}, cart]) => {
      return timer(0).pipe(
        map(() => {
            return CartEffect.formatOrderLines(cart, orderLines);
          }
        )
      );
    })
  ));

  private static formatOrderLines(cart: Array<Item>, orderLines: Item) {
    let _cart = _.cloneDeep(cart)
    if (_cart.length) {
      _cart = _cart.map((item: Item) => {
        if (item.id === orderLines.id){
          item.quantity += orderLines.quantity
        }
        return item
      })
    } else {
      _cart = [orderLines]
    }
    return CartLinesActions.addToCart.success({
      cart: _cart
    });
  }
}
