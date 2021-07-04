import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {environment} from '../../../environments/environment';

import {User} from '../model/user';
import {Router} from '@angular/router';

@Injectable({providedIn: 'root'})
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;
    public urlLogin = environment.API_HOST + '/login';
    public urlAcceptInvitation = environment.API_HOST + '/user/accept_invitation';
    public urlForgot = environment.API_HOST + '/user/forgot_password';
    public urlResetPass = environment.API_HOST + '/user/reset_password';
    public urlUpdatePass = environment.API_HOST + '/user/update_password';
    public urlSaveTracking = environment.API_HOST + '/track';
    private urlValidateToken = environment.API_HOST + '/user/validate'

    constructor(private http: HttpClient,
                public router: Router) {
        this.initUserSubject()
    }

    initUserSubject() {
        this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('currentUser') || '{}'));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    pushUserSubject(data): void {
        this.currentUserSubject.next(data)
    }

    public get currentUserValue(): any {
        console.log(this.currentUserSubject.value)
        return this.currentUserSubject.value;
    }

    login(email, password) {
        return this.http.post<any>(this.urlLogin, {
            api_user: {
                email,
                password
            }
        }, {headers: new HttpHeaders({'Content-Type': 'application/json'})})
            .pipe(map(user => {
                localStorage.setItem('currentUser', JSON.stringify(user));
                this.pushUserSubject(user)
                this.saveTracking()
                return user;
            }));
    }

    saveTracking(token: string = this.currentUserValue?.token) {
        return this.http.get(this.urlSaveTracking, {
            headers: new HttpHeaders({
                Authorization: token || ''
            })
        })
    }

    accept(token, pass) {
        return this.http.post(this.urlAcceptInvitation, {invitation_token: token, password: pass});
    }

    resetPass(token, pass) {
        return this.http.post(this.urlResetPass, {reset_password_token: token, password: pass});
    }

    updatePass(current, pass) {
        return this.http.post(this.urlUpdatePass, {current_password: current, password: pass});
    }

    forgot(email) {
        return this.http.post(this.urlForgot, {email: email});
    }

    logout() {
        // remove user from local storage and set current user to null
        localStorage.removeItem('currentUser');
        return this.pushUserSubject({})
    }

    validateToken() {
        let token = this.currentUserValue.token
        return this.http.post(this.urlValidateToken, {}, {
            headers: new HttpHeaders({
                Authorization: `Bearer ${token}`
            })
        })
    }
}
