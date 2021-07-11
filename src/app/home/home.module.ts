import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {HomeRoutingModule} from './home-routing.module';
import {HomeComponent} from './home.component';
import {ComponentModule} from '../component/component.module';
import {SlickCarouselModule} from 'ngx-slick-carousel';


@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    HomeRoutingModule,
    ComponentModule,
    CommonModule,
    SlickCarouselModule
  ]
})
export class HomeModule {
}
