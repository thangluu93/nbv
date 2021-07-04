import {Component, OnInit, TemplateRef} from '@angular/core';
import {Profile} from '../../../model/profile';
import {AuthenticationService} from '../../../auth/authentication.service';
import {UserService} from '../../user.service';
import {ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {NotifierService} from "angular-notifier";


@Component({
    selector: 'app-user-info',
    templateUrl: './user-info.component.html',
    styleUrls: ['./user-info.component.css']
})
export class UserInfoComponent implements OnInit {
    profile = new Profile();
    editInfo: boolean;

    currentPass;
    newPass;

    private sub: any;
    private routerParams: any;
    modalRef: BsModalRef;

    constructor(private authenticationService: AuthenticationService,
                private userService: UserService,
                private modalService: BsModalService,
                private notifierService: NotifierService,
                private location: Location,
                private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.sub = this.route.params.subscribe(params => {
            this.routerParams = params;
            if (this.routerParams.editInfo) {
                this.editInfo = JSON.parse(this.routerParams.editInfo);
            }
        });
        const currentUser = this.authenticationService.currentUserValue;
        this.userService.getProfile(currentUser.info.id).subscribe((data: any) => {
            this.profile = data.data;
        });
    }

    updateInfo() {
        this.userService.updateProfile(this.profile.name, this.profile.phone).subscribe((data: any) => {
            if (data.error) {
                console.log(data.message)
                this.notifierService.notify("error", data.message);
            } else {
                this.notifierService.notify("success", 'Success');
            }
        });

    }

    openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template);
    }

    changePass() {
        this.authenticationService.updatePass(this.currentPass, this.newPass).subscribe((data: any) => {
            if (data.error) {
                this.notifierService.notify("error", data.message);
            } else {
                this.notifierService.notify("success", data.message);
                this.modalRef.hide();
            }
        });
    }

    back() {
        this.location.back();
    }
}
