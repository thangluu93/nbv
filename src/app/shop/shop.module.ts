import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShopRoutingModule } from './shop-routing.module';
import { ShopComponent } from './shop.component';
import {ComponentModule} from '../component/component.module';
import { ProductDetailsComponent } from './product-details/product-details.component';


@NgModule({
  declarations: [
    ShopComponent
  ],
    imports: [
        CommonModule,
        ShopRoutingModule,
        ComponentModule
    ]
})
export class ShopModule { }
