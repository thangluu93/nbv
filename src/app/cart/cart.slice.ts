import {createSlice, noopReducer, PayloadAction} from 'ngrx-slice';
import {Item} from '../constant/interface';

let cart: Array<Item> = [];

const {
  selectors: CartSelectors,
  actions: CartLinesActions,
  ...cartFeature
} = createSlice({
  name: 'cart',
  initialState: cart as Array<Item>,
  reducers: {
    addToCart: {
      success: (state, action: PayloadAction<{cart: Array<Item>}>) => (action.cart),
      trigger: noopReducer<Array<Item>, { orderLines: Item }>()
    }
  }
});

export {CartSelectors, CartLinesActions, cartFeature};
