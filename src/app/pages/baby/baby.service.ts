import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {AuthenticationService} from "../auth/authentication.service";
import {concatMap, map, share} from "rxjs/operators";
import {Observable, of} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class BabyService {
    public urlCreateBaby = environment.API_HOST + '/baby/modify';
    public urlListBaby = environment.API_HOST + '/baby/query';
    public urlBabyInfo = environment.API_HOST + '/baby/info/';
    public urlHospitalType = environment.API_HOST + '/hospital/';
    public urlCreateEpisode = environment.API_HOST + '/baby/episode/modify';
    public urlLoadEpisode = environment.API_HOST + '/baby/episode/load';
    public urlAdmissionDischarge = environment.API_HOST + '/baby/admission/modify'
    public urlGetDiagnosis = environment.API_HOST + '/baby/admission/diagnosis'


    constructor(private http: HttpClient, private authService: AuthenticationService) {
    }

    allDiagnosis = []
    allDiagnosisSubscription


    saveBaby(baby) {
        return this.http.post<any>(this.urlCreateBaby, baby);
    }

    getListBaby(page, limit) {
        return this.http.post<any>(this.urlListBaby, {page, limit});
    }

    getBabyInfo(id) {
        return this.http.get<any>(this.urlBabyInfo + id);
    }

    listHospitalType(type) {
        return this.http.get<any>(this.urlHospitalType + type);
    }


    saveEpisode(episode) {
        return this.http.post<any>(this.urlCreateEpisode, episode);
    }

    getEpisodeInfo(babyID, epID) {
        epID = Number(epID)
        return this.http.post<any>(this.urlLoadEpisode, {baby_id: babyID, episode_id: Number(epID)});
    }


    getDiagnosis() {
        if (!this.allDiagnosisSubscription) {
            console.log('call Api')
            let token = this.authService.currentUserValue.token
            this.allDiagnosisSubscription = of(null)
            let apiCall = this.http.get(this.urlGetDiagnosis, {
                headers: new HttpHeaders({
                    Authorization: token || ''
                })
            })
            return apiCall.pipe(
                share(),
                map(
                    (res: any) => {
                        return res.data;
                    }
                ),
                concatMap(
                    data => {
                        this.allDiagnosisSubscription = of(data)
                        return this.allDiagnosisSubscription
                    }
                )
            )
        }
        return this.allDiagnosisSubscription
    }

    mapDiagnosis(res: any): Observable<any> {
        return of(res.data)
    }

    dischargeEpisode(data) {
        let token = this.authService.currentUserValue.token
        return this.http.post(this.urlAdmissionDischarge, data, {
            headers: new HttpHeaders({
                Authorization: token || ''
            })
        })
    }

    removeAccents(str) {
        let accentsMap = [
            'aàảãáạăằẳẵắặâầẩẫấậ',
            'AÀẢÃÁẠĂẰẲẴẮẶÂẦẨẪẤẬ',
            'dđ', 'DĐ',
            'eèẻẽéẹêềểễếệ',
            'EÈẺẼÉẸÊỀỂỄẾỆ',
            'iìỉĩíị',
            'IÌỈĨÍỊ',
            'oòỏõóọôồổỗốộơờởỡớợ',
            'OÒỎÕÓỌÔỒỔỖỐỘƠỜỞỠỚỢ',
            'uùủũúụưừửữứự',
            'UÙỦŨÚỤƯỪỬỮỨỰ',
            'yỳỷỹýỵ',
            'YỲỶỸÝỴ'
        ];
        for (let i = 0; i < accentsMap.length; i++) {
            let re = new RegExp('[' + accentsMap[i].substr(1) + ']', 'g');
            let char = accentsMap[i][0];
            str = str.replace(re, char);
            str = str.replace(' ', '');
        }
        return str;
    }


}
