import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HospitalComponent } from './hospital.component';

const routes: Routes = [{ path: '', component: HospitalComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HospitalRoutingModule { }
