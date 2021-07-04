import {Component, OnInit, TemplateRef} from '@angular/core';
import {UserService} from '../../user.service';
import {Profile} from '../../../model/profile';
import {ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';
import {AuthenticationService} from '../../../auth/authentication.service';
import {NotifierService} from "angular-notifier";
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
    selector: 'app-user-permission',
    templateUrl: './user-permission.component.html',
    styleUrls: ['./user-permission.component.css']
})
export class UserPermissionComponent implements OnInit {
    currentUser;
    profile = new Profile();
    profileId = '';
    listHospital = [];
    hospitalSelected = '';
    roleSelected = '';
    addable: boolean


    editPermissionFormGroup: FormGroup;
    modalRef: BsModalRef;
    hideFormHospital = true;
    oldHospital: number
    oldRole: number
    private sub: any;
    private routerParams: any;

    constructor(private userService: UserService,
                private location: Location,
                private notifierService: NotifierService,
                private authenticationService: AuthenticationService,
                private route: ActivatedRoute,
                private modalService: BsModalService,) {
    }

    ngOnInit() {
        this.currentUser = this.authenticationService.currentUserValue;


        this.sub = this.route.params.subscribe(params => {
            this.routerParams = params;
            if (this.routerParams.id) {
                this.profileId = this.routerParams.id;
                this.getProfileById();
            }
        });


    }

    showFormHospital() {
        let myProfile = JSON.parse(localStorage.getItem('my_profile'))
        if (myProfile.role === 'Local Admin' && myProfile.hospitals.length === 0) {
            return this.notifierService.notify('error', 'You have not been assigned to any hospital')
        }

        this.hideFormHospital = false;

        this.userService.getListHospital(this.profile.id).subscribe((data: any) => {
            this.listHospital = data.data;
        });
    }

    savePermission() {
        this.userService.assignHospital(this.hospitalSelected, this.roleSelected, this.profile.id).subscribe((data: any) => {
            if (data.error) {
                this.notifierService.notify("error", data.message);
            } else {
                this.notifierService.notify("success", data.message);
                this.hideFormHospital = true;
                this.getProfileById();
            }
        });
    }

    removePermission(hospitalId) {
        this.userService.unAssignHospital(hospitalId, this.profile.id).subscribe((data: any) => {
            if (data.error) {
                this.notifierService.notify("error", data.message);
            } else {
                this.notifierService.notify("success", data.message);
                this.getProfileById();
            }
        });
    }

    getProfileById() {
        this.userService.getProfile(this.profileId).subscribe((data: any) => {
            this.profile = data.data;
            this.addable = this.profile['addable']
            this.profile.id = this.profileId;
        });
    }


    back() {
        this.location.back();
    }


    editPermission(template: TemplateRef<any>, hospital) {
        this.modalRef = this.modalService.show(template);
        this.showFormHospital();
        this.hideFormHospital = true;
        hospital.userId = this.authenticationService.currentUserValue.info.id
        this.editPermissionFormGroup = new FormGroup({
            hospital: new FormControl({
                name: hospital.name,
                id: hospital.id
            }, Validators.required),
            role: new FormControl(null, Validators.required),
            userId: new FormControl(this.profileId, Validators.required)
        })
        this.oldHospital = Number(hospital.id)
        this.oldRole = Number(hospital.role)
    }

    async reSavePermission() {
        let data = this.editPermissionFormGroup.value;
        try {
            let response = await this.userService.unAssignHospital(data.hospital.id, data.userId).toPromise();
            if (response['error'] === false) {
                this.userService.assignHospital(data.hospital.id, data.role, data.userId).toPromise().then((res) => {
                    if (res['error'] === false) {
                        this.getProfileById();
                        this.modalRef.hide();
                        return this.notifierService.notify("success", "Edit Permission Successfully")
                    }
                })
            }
        } catch (e) {
            this.notifierService.notify("error", "Edit Failed. Please try again")
        }
    }

}
