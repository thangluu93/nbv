import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DataManagementRoutingModule } from './data-management-routing.module';
import { DataManagementComponent } from './data-management.component';


@NgModule({
  declarations: [DataManagementComponent],
  imports: [
    CommonModule,
    DataManagementRoutingModule
  ]
})
export class DataManagementModule { }
