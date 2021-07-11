import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [
  {
    path: '',
    data: {breadcrumb: 'Home'},
    loadChildren: () => import('./home/home.module').then(m => m.HomeModule)
  },
  {
    path: 'shop',
    data: {breadcrumb: 'Shop'},
    loadChildren: () => import('./shop/shop.module').then(m => m.ShopModule)
  },
  {
    path: 'about',
    data: {breadcrumb: 'About'},
    loadChildren: () => import('./about/about.module').then(m => m.AboutModule)
  },
  {
    path: 'auth',
    data: {breadcrumb: 'Authentication'},
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes,
    {
      enableTracing: true
    }
    )],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
