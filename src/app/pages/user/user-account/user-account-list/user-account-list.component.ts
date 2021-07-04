import {Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {BehaviorSubject, Observable, pipe} from 'rxjs';
import {debounceTime} from "rxjs/internal/operators";
import {map, startWith} from 'rxjs/operators';
import {Router} from '@angular/router';
import {UserService} from '../../user.service';
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {NotifierService} from "angular-notifier";
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table'
// import {FilterService} from 'src/app/services/filter.service';
// import {AuthenticationService} from "./app/pages/auth/authentication.service";
import {role} from './../../../../configs/enum'
import {isObject} from "rxjs/internal-compatibility";
import {MatAutocompleteSelectedEvent} from "@angular/material/autocomplete";
import {User} from "../../../model/user";
import {AuthenticationService} from "../../../auth/authentication.service";
import {FilterService} from "../../../../services/filter.service";
import {HospitalService} from "../../../../services/hospital.service";

export interface UserData {
    name: string;
    email: string;
    role: string;
    workplace: string;
    status: string
}


@Component({
    selector: 'app-user-account-list',
    templateUrl: './user-account-list.component.html',
    styleUrls: ['./user-account-list.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class UserAccountListComponent implements OnInit {

    roleFormControl = new FormControl('', Validators.required)
    historyFilter = new FormControl();
    emailFormControl = new FormControl('', Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,3}$"))
    hospitalAssignFormControl = new FormControl('', Validators.required)
    roleFilter = new FormControl();
    listHospital = []
    myProfileData;
    filterHospitalOption = [];
    filteredWorkplaceOptions: Observable<string[]>;
    filteredPermissionOptions: Observable<string[]>;

    newEmail = '';
    newHospital = '';
    newRole = '';
    selectedHospital = []
    backupAllData = []
    hospitalChanged: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([])
    addPermission = false;
    disPermission = false;
    cols: any[];

    allUser = [];
    dataSource: MatTableDataSource<any>;
    modalRef: BsModalRef;
    inviteRole: Array<any>
    allComplete = false;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    displayedColumns: string[] = ['check', 'name', 'email', 'workplace', 'role', 'status'];

    constructor(
        private router: Router,
        private modalService: BsModalService,
        private notifierService: NotifierService,
        private userService: UserService,
        private filterService: FilterService,
        private authService: AuthenticationService,
        private hospitalService: HospitalService
    ) {
        this.userService.getAllUser().pipe(
            map((res: any) => {
                let data = res.data
                data.completed = false
                return data
            })
        ).subscribe((data: any) => {
            this.allUser = data;
            this.dataSource = new MatTableDataSource(this.allUser);
            this.backupAllData = this.dataSource.data
            this.dataSource.filterPredicate = this.createFilter();
        });

        this.myProfileData = userService.myProfileData
        if (!this.myProfileData) {
            this.myProfileData = this.authService.currentUserValue.info;
        }
        if (this.myProfileData['role'] === 'Local Admin' || this.myProfileData['role'] === 'Network Admin') {
            this.addPermission = true;
            if (this.myProfileData['role'] === 'Network Admin') {
                this.disPermission = true
            }
        }
        this.allowRoleInvite();


    }

    ngOnInit() {
        this.cols = [
            {field: 'name', header: 'Name'},
            {field: 'workplace', header: 'Hospital'},
            {field: 'email', header: 'Email'},
            {field: 'role', header: 'Role'},
            {field: 'status', header: 'Status'}
        ];

        this.hospitalService.passHospital('admission').subscribe(data => {
            this.filterHospitalOption = data;
        })

        this.filteredWorkplaceOptions = this.historyFilter.valueChanges.pipe(
            debounceTime(400),
            startWith(''),
            map(value => {
                let data = this.filterService._filter(this.allUser, value, 'workplace');
                let result = this.filterService.removeDuplicatesBy(x => x.workplace, data);
                return result
            })
        );

        this.filteredPermissionOptions = this.roleFilter.valueChanges.pipe(
            // this.filteredWorkplaceOptions.pipe,
            debounceTime(400),
            startWith(''),
            map(value => {
                let data = this.filterService._filter(this.allUser, value, 'role');
                let result = this.filterService.removeDuplicatesBy(x => x.role, data);
                return result;
            }),
        );
        this.userService.getListHospital(1).subscribe((data: any) => {
            console.log(this.listHospital)
            this.listHospital = data.data
        })

        this.hospitalChanged
            .asObservable()
            .pipe(debounceTime(500))
            .subscribe(() => {
                if (this.selectedHospital.length > 0) {
                    this.filterHospital()
                        .toPromise()
                        .then(data => {
                                if (data.data.length > 0) {
                                    this.dataSource.data = data.data
                                }
                            }
                        )
                } else {
                    if (this.backupAllData.length > 0) {
                        this.dataSource.data = this.backupAllData
                    }
                }
            })
    }


    // ngAfterViewInit() {
    //     if (this.dataSource) {
    //         this.dataSource.paginator = this.paginator;
    //     }
    // }

    applyFilter(event: Event) {
        let filterValue = (event.target as HTMLInputElement).value;
        let a = {
            name: filterValue.trim().toLocaleLowerCase(),
            workplace: filterValue.trim().toLocaleLowerCase(),
            email: filterValue.trim().toLocaleLowerCase(),
            role: filterValue.trim().toLocaleLowerCase(),
            status: filterValue.trim().toLocaleLowerCase(),
        }
        this.dataSource.filter = JSON.stringify(a)
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }

    }

    filterSpecificColumn(event: MatAutocompleteSelectedEvent, column) {
        let filter = {}
        filter[column] = event.option.viewValue.trim().toLowerCase()
        this.dataSource.filter = JSON.stringify(filter)
    }


    createFilter(): (data: any, filter: string) => boolean {
        let filterFunction = (data, filter): boolean => {
            if (isObject(data) && filter) {
                let searchTerms = JSON.parse(filter);
                console.log(Object.getOwnPropertyNames(searchTerms).length)
                if (Object.getOwnPropertyNames(searchTerms).length === 5) {
                    if (data.role.trim().toLowerCase().indexOf(searchTerms.role) !== -1) {
                        return true
                    } else if (data.email.trim().toLowerCase().indexOf(searchTerms.email) !== -1) {
                        return data.email.trim().toLowerCase().indexOf(searchTerms.email) !== -1
                    } else if (data.name.trim().toLowerCase().indexOf(searchTerms.name) !== -1) {
                        return data.name.trim().toLowerCase().indexOf(searchTerms.name) !== -1
                    } else if (data.status.trim().toLowerCase().indexOf(searchTerms.status) !== -1) {
                        return data.status.trim().toLowerCase().indexOf(searchTerms.status) !== -1
                    } else {
                        return false
                    }
                }
                if (data.role) {
                    return data.role.trim().toLowerCase().indexOf(searchTerms.role) !== -1
                }
                if (data.workplace) {
                    return data.workplace.trim().toLowerCase().indexOf(searchTerms.workplace) !== -1
                }
                if (data.email) {
                    return data.email.trim().toLowerCase().indexOf(searchTerms.email) !== -1
                }
                if (data.name) {
                    return data.name.trim().toLowerCase().indexOf(searchTerms.name) !== -1
                }
                if (data.status) {
                    return data.status.trim().toLowerCase().indexOf(searchTerms.status) !== -1
                }
                return false
            }
        };
        return filterFunction;
    }

    isChecked() {
        return this.someComplete() || this.allComplete

    }

    updateAllComplete() {
        this.allComplete = this.allUser != null && this.allUser.every(t => t.completed);
    }

    someComplete(): boolean {
        if (this.allUser == null) {
            return false;
        }
        return this.allUser.filter(t => t.completed).length > 0 && !this.allComplete;
    }

    setAll(completed: boolean) {
        this.allComplete = completed;
        if (this.allUser == null) {
            return;
        }
        this.allUser.forEach(t => t.completed = completed);
    }


    sendInvitation() {
        this.userService.sendInvitation(this.newEmail, this.newRole, this.newHospital).subscribe({
            next: (data: any) => {
                if (data.error) {
                    this.notifierService.notify("error", data.message);
                } else {
                    this.notifierService.notify("success", data.message);
                    this.modalRef.hide();
                }
            },
            error: (err) => {
                console.log(err)
                this.notifierService.notify("error", `Error System ${err.error.message} . Please try again later`);
            }
        });
    }


    onRowSelect(rowData) {
        this.router.navigateByUrl('user/permission/' + rowData.id);
    }

    openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template);
    }

    deacticeUser() {
        try {
            let user_is_deactive = []
            this.allUser.forEach((user) => {
                if (user.completed) {
                    user_is_deactive.push(user.id)
                }
            })
            this.userService.deactiveUser(user_is_deactive).toPromise().then((res) => {
                if (res['error'] === false) {
                    this.notifierService.notify("success", "Remove Successfully")
                }
            }).catch((error) => this.notifierService.notify("error", "Remove Failed. Please try again later"))
        } catch (e) {
            this.notifierService.notify("error", "Remove failed. Please try again later")
        }
    }

    allowRoleInvite() {
        if (this.myProfileData.role === "Network Admin") {
            this.inviteRole = [{title: 'Local Admin', value: 1}, {title: 'User', value: 0}]
        } else if ((this.myProfileData.role === 'Local Admin')) {
            this.inviteRole = [{title: 'User', value: 0}]
        } else {

            return []
        }
    }

    displayWorkplaceFn(_this): string {
        return _this && _this.workplace ? _this.workplace : ''
    }

    displayRoleFn(_this): string {
        return _this && _this.role ? _this.role : ''
    }

    onFieldChange() {
        this.hospitalChanged.next(this.selectedHospital)
    }

    filterHospital() {
        return this.hospitalService.filterHospital({
            page: 1,
            limit: 10,
            hospital_ids: this.selectedHospital
        })
    }
}

