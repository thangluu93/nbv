import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HospitalRoutingModule } from './hospital-routing.module';
import { HospitalComponent } from './hospital.component';
import {ReactiveFormsModule} from "@angular/forms";
import {MatRadioModule} from "@angular/material/radio";
import {MatButtonModule} from "@angular/material/button";
// import {ReactiveFormsModule} from "@angular/forms";

@NgModule({
  declarations: [HospitalComponent],
    imports: [
        CommonModule,
        HospitalRoutingModule,
        ReactiveFormsModule,
        MatRadioModule,
        MatButtonModule,
        // ReactiveFormsModule
    ]
})
export class HospitalModule { }
