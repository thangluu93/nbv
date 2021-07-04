import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {BabyListComponent} from './baby-list/baby-list.component';
import {BabyDetailsComponent} from './baby-details/baby-details.component';


const routes: Routes = [
  {path: '', component: BabyListComponent },
  {path: 'details', component: BabyDetailsComponent },
  {path: 'details/:sys_id', component: BabyDetailsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BabyRoutingModule { }
