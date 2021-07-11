import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MeRoutingModule } from './me-routing.module';
import { MeComponent } from './me.component';
import { AccountInfoTabComponent } from './account-info-tab/account-info-tab.component';
import {ReactiveFormsModule} from '@angular/forms';
import { OrderHistoryTabComponent } from './order-history-tab/order-history-tab.component';
import { OrderProcessingTabComponent } from './order-processing-tab/order-processing-tab.component';


@NgModule({
  declarations: [
    MeComponent,
    AccountInfoTabComponent,
    OrderHistoryTabComponent,
    OrderProcessingTabComponent,
  ],
  imports: [
    CommonModule,
    MeRoutingModule,
    ReactiveFormsModule
  ]
})
export class MeModule { }
