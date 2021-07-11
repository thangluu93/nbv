import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ShopComponent} from './shop.component';

const routes: Routes = [
  {path: ':category', component: ShopComponent},
  {
    path: 'item/:id',
    data: {breadcrumb: 'asd'},
    loadChildren: () => import('./product-details/product-details.module').then(m => m.ProductDetailsModule)
  },
  // {path: '', redirectTo: 'all'},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShopRoutingModule {
}
