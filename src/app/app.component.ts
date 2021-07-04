import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from './pages/auth/authentication.service';
import {Router} from '@angular/router';
import {UserService} from './pages/user/user.service';
import {NotifierService} from "angular-notifier";
import {LanguageService} from "./services/language.service";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
    currentUser;
    currentUserProfile;
    isEng = true
    isNetAd = false
    isValid = false;
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService,
        private userService: UserService,
        private notifierService: NotifierService,
        private languageService: LanguageService
    ) {
    }

    ngOnInit() {
        this.isValid = !!this.authenticationService.currentUserValue.token
        this.userService.myProfile().subscribe((data: any) => {
                if (data) {
                    this.currentUserProfile = data.data;
                    localStorage.setItem('my_profile', JSON.stringify(data.data));
                    localStorage.getItem('my_profile');
                    if(data.data?.role === 'Network Admin'){
                        this.isNetAd = true
                    }
                    // this.isValid = true
                }
            },
            ()=> {
                // this.router.navigate(['/login']);
                // this.notifierService.notify('error', 'Please log in again')
            })
        this.languageService.CurrentLanguage.subscribe(isEng => {
            this.isEng = isEng
        })
    }

    logout() {
        this.authenticationService.logout();
        this.router.navigate(['/login']);
    }

    changeLang(lang: string) {
        this.languageService.SetCurrentLanguage = lang;
    }

}
