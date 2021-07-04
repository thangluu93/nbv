import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {JwtInterceptor} from './pages/auth/jwt.interceptor';
import {NotifierModule, NotifierOptions} from "angular-notifier";
import {ModalModule} from "ngx-bootstrap/modal";
import {MatAutocomplete, MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatTableModule} from '@angular/material/table';
import {MatFormFieldModule} from "@angular/material/form-field";
import {OwlDateTimeModule, OwlNativeDateTimeModule} from 'ng-pick-datetime';
import {MatInputModule} from "@angular/material/input";
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { en_US } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { FormsModule } from '@angular/forms';

registerLocaleData(en);

const customNotifierOptions: NotifierOptions = {
    position: {
        horizontal: {
            position: 'right',
            distance: 12
        },
        vertical: {
            position: 'top',
            distance: 12,
            gap: 10
        },
    },
    behaviour: {
        onClick: 'hide',
        autoHide: 4000,
        onMouseover: 'pauseAutoHide',
    },
    animations: {
        hide: {
            preset: 'slide',
            offset: 1,
            speed: 300,
            easing: 'ease-out'
        },
        show: {
            preset: 'slide',
            // offset: 1,
            speed: 300,
            easing: 'ease-out'
        },
        shift: {
            speed: 300
        }
    }
};

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        HttpClientModule,
        MatAutocompleteModule,
        ModalModule.forRoot(),
        MatTableModule,
        NotifierModule.withConfig(customNotifierOptions),
        MatFormFieldModule,
        MatInputModule,
        OwlDateTimeModule,
        OwlNativeDateTimeModule,
        FormsModule,
    ],
    providers: [{provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true}, { provide: NZ_I18N, useValue: en_US }],
    bootstrap: [AppComponent],
    exports: []
})
export class AppModule {
}
