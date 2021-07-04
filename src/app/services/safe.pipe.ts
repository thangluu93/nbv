import {Pipe, PipeTransform} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';

@Pipe({
    name: 'domUserEmail'
})

export class DomUserEmail implements PipeTransform {
    constructor(private sanitizer: DomSanitizer) {
    }

    transform(html): unknown {
        let href = html.match(/href="([^"]*)/)[1].replace(':', '/permission/').replace('@', '');
        let newHtml = html.replace(html.match(/href="([^"]*)/)[1], href)
        return this.sanitizer.bypassSecurityTrustHtml(newHtml);
    }
}

@Pipe({
    name: 'activityDomHtml'
})

export class ActivityDomHtml implements PipeTransform {
    constructor(private sanitizer: DomSanitizer) {
    }

    transform(value: any): any {
        let reg = new RegExp('<[a][^>]*>(.+?)<\/[tag]>', 'g')
        let resultsReg = value.match(reg)
        if (resultsReg) {
            for (let i = 0; i < resultsReg.length; i++) {
                let findTagUser = resultsReg[i].match(new RegExp(/href="@user:[[0-9]+"/));
                if (findTagUser) {
                    let newHref = resultsReg[i].match(/href="([^"]*)/)[1].replace(':', '/permission/').replace('@', '')
                    value = value.replace(resultsReg[i].match(new RegExp(/@user:[[0-9]+/))[0], newHref);
                }
                let matchHospital = resultsReg[i].match(new RegExp(/<[a] href="@hospital:[[0-9]+">/))

                if (matchHospital) {
                    value = value.replace(matchHospital[0], '').replace('</a>', '')
                }
            }
            return this.sanitizer.bypassSecurityTrustHtml(value)
        }
        return value
    }
}

@Pipe({
    name: 'formatDate'
})

export class FormatDatePipe implements PipeTransform {
    constructor() {
    }

    transform(dateString): any {
        let formattedDate = new Date(dateString).toLocaleString("en-US", {timeZone: 'Asia/Ho_Chi_Minh'}).replace(', ', ' - ');
        return formattedDate;
    }
}

@Pipe({
    name: 'roundedFloat'
})

export class RoundedFloatPipe implements PipeTransform {
    constructor() {
    }

    transform(value: any, ...args): any {
        console.log(value)
    }
}

@Pipe({
    name: 'formatHospital'
})

export class FormatHospitalPipe implements PipeTransform {

    constructor() {
    }

    transform(value: any, ...args): any {
        if (value.length > 1) {
            for (let hos of value) {
                if (hos.length > 30) {
                    continue
                }
                return `${hos}, ${value.length - 1}+`

            }
            return `${value[0]}, ${value.length -1}`
        }
        return value.toString()
    }
}

@Pipe({
    name: 'formatDatetime'
})

export class FormatDatetimePipe implements PipeTransform{
    constructor() {}

    transform(value: any, ...args): any {
        console.log(value)
        return value
    }
    
}
