import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UserAccountListComponent } from './user-account/user-account-list/user-account-list.component';
import { TableModule } from 'primeng/table';
import { UserPermissionComponent } from './user-account/user-permission/user-permission.component';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserService } from './user.service';
import { UserInfoComponent } from './user-account/user-info/user-info.component';
import { BsModalService } from "ngx-bootstrap/modal";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule, MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { AuthenticationService } from '../auth/authentication.service';
import { Router } from '@angular/router';
import {UserActivityComponent} from "./user-account/user-activity/user-activity.component";
import {FormatDatePipe, DomUserEmail, ActivityDomHtml, FormatHospitalPipe} from "../../services/safe.pipe";
import {OwlDateTimeModule, OwlNativeDateTimeModule} from "ng-pick-datetime";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {NgSelectModule} from "@ng-select/ng-select";



@NgModule({
    declarations: [UserAccountListComponent, UserPermissionComponent, UserInfoComponent,UserActivityComponent,DomUserEmail, FormatDatePipe, ActivityDomHtml, FormatHospitalPipe],
    imports: [
        CommonModule,
        UserRoutingModule,
        TableModule,
        FormsModule,
        ReactiveFormsModule,
        MatAutocompleteModule,
        MatFormFieldModule,
        MatInputModule,
        MatPaginatorModule,
        MatTableModule,
        MatSortModule,
        MatCheckboxModule,
        MatButtonModule,
        MatSelectModule,
        MatDialogModule,
        ReactiveFormsModule,
        OwlDateTimeModule,
        MatProgressSpinnerModule,
        NgSelectModule
    ],
    providers: [UserService, BsModalService, { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: false } }],
})
export class UserModule {

}
