import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {UserAccountListComponent} from './user-account/user-account-list/user-account-list.component';
import {UserPermissionComponent} from './user-account/user-permission/user-permission.component';
import {UserInfoComponent} from './user-account/user-info/user-info.component';
import {UserActivityComponent} from "./user-account/user-activity/user-activity.component";


const routes: Routes = [
    {path: '', redirectTo:'all'},
    {path: 'all', component: UserAccountListComponent},
    {path: 'permission/:id', component: UserPermissionComponent},
    {path: 'info', component: UserInfoComponent},
    {path: 'activity', component: UserActivityComponent}


];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UserRoutingModule {
}
