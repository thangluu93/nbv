import {Injectable, NgZone} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import firebase from 'firebase';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {DataService} from './data.service';
import {environment} from '../../environments/environment';
import {ConfigService} from './config.service';
import {BehaviorSubject, Observable} from 'rxjs';
import auth = firebase.auth;

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  constructor(
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router,
    public ngZone: NgZone,
    public http: HttpClient,
    private dataService: DataService,
    private configService: ConfigService
  ) {
    this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('user') || '{}'));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  get currentUserValue() {
    return this.currentUserSubject.value;
  }

  get isUserVerified() {
    let user = this.currentUserValue;
    return user.profile_status < 1;
  }

  // Sign in with Google
  GoogleAuth() {
    return this.AuthLogin(new auth.GoogleAuthProvider());
  }

  FacebookAuth() {
    return this.AuthLogin(new auth.FacebookAuthProvider());
  }

  // Auth logic to run auth providers
  async AuthLogin(provider: auth.AuthProvider, isGoogle = false) {
    let token = '';
    await this.afAuth.signInWithPopup(provider)
      .then((result: any) => {
        console.log(result.credential['idToken']);
        token = result.credential['idToken'];
        localStorage.setItem('social_token', result.credential['idToken']);

      }).catch((error) => {
        console.log(error);
        return location.reload();
      });

    this.signInSocial(token).subscribe((res: any) => {
      if (res.error) {
        return alert(res.message);
      } else {
        localStorage.setItem('token', res.token);
        this.currentUserSubject.next(res?.profile);
        return this.router.navigate(['/auth/me/account-info']);
      }
    });
  }

  signInSocial(token: string, type = 'google') {
    let data = {};
    if (type === 'google') {
      data = {
        google_token: token
      };
    } else {
      data = {
        facebook_token: token
      };
    }
    return this.http.post(`${environment.CKSC_URL}/auth/sign-in-social`, data, this.configService.httpConfig);
  }


  trackingAuth() {
    return this.http.get(`${environment.CKSC_URL}/auth/tracking`, this.dataService.httpConfigWithToken);
  }

  login(loginInfo: any) {
    return this.http.post(`${environment.CKSC_URL}/auth/login`, loginInfo, this.dataService.httpConfig);
  }

  myProfile() {
    return this.http.post(`${environment.CKSC_URL}/auth/me`, this.dataService.httpConfigWithToken);
  }

  setUserData(user: any){
    localStorage.setItem('user', JSON.stringify(user))
    this.currentUserSubject.next(user);
  }

}
