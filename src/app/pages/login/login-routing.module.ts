import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {LoginComponent} from './login.component';


const routes: Routes = [
    {
        path: '', component: LoginComponent,
        children: [
            {path: 'forgot', pathMatch: 'full'},
        ]
    },
    {path: '/:tokenInvitation', component: LoginComponent},
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LoginRoutingModule {
}
