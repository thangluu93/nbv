import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {DataManagementComponent} from './data-management.component';

const routes: Routes = [{path: '', component: DataManagementComponent},
    {path: 'hospital', loadChildren: () => import('./hospital/hospital.module').then(m => m.HospitalModule)},
    {path: 'diagnosis', loadChildren: () => import('./diagnosis/diagnosis.module').then(m => m.DiagnosisModule)}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DataManagementRoutingModule {
}
