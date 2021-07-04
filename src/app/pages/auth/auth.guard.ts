import {Injectable} from '@angular/core';
import {Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree} from '@angular/router';
import {catchError, map} from 'rxjs/operators';
import {Observable, of} from 'rxjs'
import {NotifierService} from 'angular-notifier'
import {UserService} from "../user/user.service";
import {AuthenticationService} from "./authentication.service";

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private authService: AuthenticationService,
        private notifierService: NotifierService
    ) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

        return this.authService.validateToken().pipe(
            map((a:any) => {
                return a?.data?.valid;

            }),
            catchError((err) => {
                // if (err.status === 401) {
                    localStorage.removeItem('currentUser')
                    this.authService.pushUserSubject({})
                    this.router.navigate(['/login'], {queryParams: {returnUrl: state.url}});
                    this.notifierService.notify('error', 'Please log in again')
                    return of(false)
                // }
            })
        )
    }
}
