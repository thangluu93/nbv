import {Injectable} from '@angular/core';
import {HttpClient, HttpHandler, HttpHeaders, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {AuthenticationService} from '../auth/authentication.service';
import {share} from "rxjs/operators";

@Injectable({
    providedIn: 'root'
})
export class UserService {
    public urlInvitationUser = environment.API_HOST + '/user/send_invitation';
    public urlProfileUser = environment.API_HOST + '/user/profile';
    public urlUpdateProfile = environment.API_HOST + '/user/update';
    public urlAllUser = environment.API_HOST + '/user/all';
    public urlListHospitalLeft = environment.API_HOST + '/user/list_hospital_left';
    public urlAssignHospital = environment.API_HOST + '/user/assign_hospital';
    public urlRemoveHospital = environment.API_HOST + '/user/remove_hospital';
    public urlMyProfile = environment.API_HOST + '/user/me';
    public urlDeactiveUser = environment.API_HOST + '/user/profile/de-active-list';
    public urlLogActivity = environment.API_HOST + '/logs'

    constructor(private http: HttpClient, private authService: AuthenticationService) {
    }

    myProfileData;

    sendInvitation(newEmail, newRole, hospital_id) {
        return this.http.post<any>(this.urlInvitationUser, {email: newEmail, role: newRole, hospital_id: hospital_id});
    }

    getProfile(id) {
        return this.http.post(this.urlProfileUser, {user_id: id});
    }

    getAllUser() {
        return this.http.get(this.urlAllUser);
    }

    updateProfile(name, phone) {
        return this.http.post(this.urlUpdateProfile, {name: name, phone: phone});
    }

    getListHospital(id) {
        return this.http.post(this.urlListHospitalLeft, {user_id: id});
    }

    assignHospital(hospitalId, role, userId) {
        return this.http.post(this.urlAssignHospital, {hospital_id: hospitalId, role: role, user_id: userId});
    }

    unAssignHospital(hospitalId, userId) {
        return this.http.post(this.urlRemoveHospital, {hospital_id: hospitalId, user_id: userId});
    }

     myProfile(token = this.authService.currentUserValue?.token) {
        let profile =  this.http.post(this.urlMyProfile, {
            headers: new HttpHeaders({
                Authorization: token
            })
        }).pipe(share())
        profile.toPromise().then((data: any) => {
            this.myProfileData = data.data
        })
        return profile
    }

    deactiveUser(userId) {
        let token = this.authService.currentUserValue.token
        return this.http.post(this.urlDeactiveUser, {
            user_id_list: userId
        }, {
            headers: new HttpHeaders({
                Authorization: token
            }),

        })
    }

    getActivityLog(page = 1, limit = 10) {
        let token = this.authService.currentUserValue.token;
        let params = new HttpParams({
            fromObject: {
                page: page.toString(),
                limit: limit.toString()
            }
        });

        return this.http.get(this.urlLogActivity, {
            headers: new HttpHeaders({Authorization: token}),
            params: params
        })
    }
}
