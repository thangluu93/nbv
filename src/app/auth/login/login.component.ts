import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  isShowPassword = false;

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  });

  constructor(private authService: AuthService, private router: Router) {
  }

  ngOnInit(): void {
  }

  get LoginFormControl() {
    return this.loginForm.controls;
  }

  login() {
    this.authService.login(this.loginForm.value).subscribe((res: any) => {
        if (res.error) {
          return alert(res.message);
        } else {
          this.authService.setUserData(res.profile);
          localStorage.setItem('token', res.token);
          return this.router.navigate(['/']);
        }
      },
      (error: any) => {
        return alert(error.error.error.message);
      });
  }

  googleLogin() {
    return this.authService.GoogleAuth();
  }

  facebookLogin() {
    return this.authService.FacebookAuth();
  }
}
