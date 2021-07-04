import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class LanguageService {

    language = ''
    languageSubject: BehaviorSubject<any>

    constructor() {
        this.language = localStorage.getItem('language') || 'en'
        this.languageSubject = new BehaviorSubject(this.isEng(this.language))
    }

    get CurrentLanguage() {
        return this.languageSubject.asObservable()
    }

    set SetCurrentLanguage(lang: string) {
        this.language = lang
        localStorage.setItem('language', lang)
        this.languageSubject.next(this.isEng(lang))
    }

    isEng(lang) {
        return lang === 'en'
    }

}
