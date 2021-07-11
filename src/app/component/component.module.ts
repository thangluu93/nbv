import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HeaderComponent} from './header/header.component';
import {TrendingItemComponent} from './trending-item/trending-item.component';
import {HomeHighlightComponent} from './home-highlight/home-highlight.component';
import { ShopListingComponent } from './shop-listing/shop-listing.component';
import { ShopItemComponent } from './shop-item/shop-item.component';
import { PaginationComponent } from './pagination/pagination.component';
import { FooterComponent } from './footer/footer.component';
import {AccountInfomationComponent} from './account-infomation/account-infomation.component';
import {StoreModule} from '@ngrx/store';
import {cartFeature} from '../cart/cart.slice';


@NgModule({
  declarations: [
    HeaderComponent,
    TrendingItemComponent,
    HomeHighlightComponent,
    ShopListingComponent,
    ShopItemComponent,
    PaginationComponent,
    FooterComponent,
    AccountInfomationComponent
  ],
  exports: [
    HeaderComponent,
    TrendingItemComponent,
    HomeHighlightComponent,
    ShopListingComponent,
    PaginationComponent,
    FooterComponent,
    AccountInfomationComponent
  ],
  imports: [
    CommonModule,
    StoreModule.forFeature(cartFeature)
  ]
})
export class ComponentModule {
}
