import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from './pages/auth/auth.guard';


const routes: Routes = [
    {path: '', redirectTo: 'user/', pathMatch: 'prefix'},
    {path: 'login', loadChildren: './pages/login/login.module#LoginModule'},
    {path: 'user', loadChildren: './pages/user/user.module#UserModule', canActivate: [AuthGuard]},
    {path: 'baby', loadChildren: './pages/baby/baby.module#BabyModule', canActivate: [AuthGuard]},
    {
        path: 'data-management',
        loadChildren: () => import('./pages/data-management/data-management.module').then(m => m.DataManagementModule),
        canActivate: [AuthGuard]
    },
    {path: '**', redirectTo: 'baby'}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
