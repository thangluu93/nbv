import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthenticationService} from '../auth/authentication.service';
import {first} from 'rxjs/operators';
import {NotifierService} from "angular-notifier";


@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;
    error = '';
    newPassword = '';
    emailForgot = '';
    forgotForm = false;
    tokenForgot = '';

    tokenInvitation = '';
    acceptInvitation = false;

    private sub: any;
    private routerParams: any;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private notifierService: NotifierService,
        private router: Router,
        private authenticationService: AuthenticationService,
    ) {
        // redirect to home if already logged in
        if (this.authenticationService.currentUserValue) {
            this.router.navigate(['/']);
        }
    }

    ngOnInit() {
        this.loginForm = this.formBuilder.group({
            email: ['', Validators.required],
            password: ['', Validators.required]
        });

        // get return url from route parameters or default to '/'
        this.route.queryParams.subscribe((params: any) => {
            this.returnUrl = params.returnUrl
        })

        this.sub = this.route.params.subscribe(params => {
            this.routerParams = params;

            this.tokenInvitation = this.route.snapshot.queryParams.invitation_token;
            if (this.tokenInvitation) {
                this.acceptInvitation = true;
            }

            this.tokenForgot = this.route.snapshot.queryParams.reset_password_token;
            if (this.tokenForgot) {
                this.acceptInvitation = true;
                this.forgotForm = false;
            }
        });
    }

    // convenience getter for easy access to form fields
    get f() {
        return this.loginForm.controls;
    }

    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.loginForm.invalid) {
            return;
        }

        this.loading = true;
        this.authenticationService.login(this.f.email.value, this.f.password.value)
            .pipe(first())
            .subscribe((data: any) => {
                    if (this.returnUrl) {
                        return this.router.navigate([this.returnUrl]);
                    }
                    return this.router.navigate(['/baby'])
                },
                error => {
                    this.notifierService.notify("error", `Error ${error.error.message}, please try again later`);
                    this.error = error;
                    this.loading = false;
                    console.log(this.error)
                });
    }

    acceptInvited() {
        if (this.tokenForgot) {
            this.authenticationService.resetPass(this.tokenForgot, this.newPassword).subscribe((data: any) => {
                if (data.error) {
                    this.notifierService.notify("error", data.message);
                } else {
                    this.notifierService.notify("success", data.message);
                    this.forgotForm = false;
                    this.acceptInvitation = false;
                    this.router.navigateByUrl('/login');
                }
            });
        }
        if (this.tokenInvitation) {
            this.authenticationService.accept(this.tokenInvitation, this.newPassword).subscribe((data: any) => {
                if (data.error) {
                    this.notifierService.notify("error", data.message);
                } else {
                    this.notifierService.notify("success", data.message);
                    this.forgotForm = false;
                    this.acceptInvitation = false;
                    this.router.navigateByUrl('/login');
                }
            });
        }
    }

    sendEmailForgot() {
        this.authenticationService.forgot(this.emailForgot).subscribe((data: any) => {
            if (data.error) {
                this.notifierService.notify("error", data.message);
            } else {
                this.notifierService.notify("success", data.message);
                this.router.navigateByUrl('/login');
                this.forgotForm = false;
                this.acceptInvitation = false;
            }
        });
    }
}
