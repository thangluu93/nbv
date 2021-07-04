import {Injectable} from '@angular/core';
import {BabyService} from "../pages/baby/baby.service";
import {BehaviorSubject, Observable, of} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {AuthenticationService} from "../pages/auth/authentication.service";
import {map, switchMap} from "rxjs/operators";
import {LanguageService} from "./language.service";

@Injectable({
    providedIn: 'root'
})
export class HospitalService {

    listHospitalSubscriber: BehaviorSubject<any>
    listTypeHospital = {admission: [], transferred: [], place_booking: [], place_birth: [], admitted: []}
    placeBookingSubscriber
    urlFilter = environment.API_HOST + '/user/filter_hospitals'
    formattedListTypeHospital = {admission: [], transferred: [], place_booking: [], place_birth: [], admitted: []};


    constructor(public babyService: BabyService,
                public http: HttpClient,
                private authService: AuthenticationService,
                private languageService: LanguageService) {
        this.listHospitalSubscriber = new BehaviorSubject<any>({
            admission: [],
            transferred: [],
            place_booking: [],
            place_birth: [],
            admitted: []
        })
        let listTypeHospital = {admission: [], transferred: [], place_booking: [], place_birth: [], admitted: []};

        // this.languageService.languageSubject.subscribe(isEng => {
        //     this.babyService.listHospitalType('place_booking').subscribe((data) => {
        //         this.formatHospital(data.data, isEng).then((formattedData: any[]) => {
        //             listTypeHospital.place_booking = formattedData;
        //             this.listHospitalSubscriber.next(listTypeHospital)
        //         });
        //     });
        //     this.babyService.listHospitalType('place_birth').subscribe((data) => {
        //         this.formatHospital(data.data, isEng).then((formattedData) => {
        //             listTypeHospital.place_birth = formattedData;
        //             this.listHospitalSubscriber.next(listTypeHospital)
        //
        //         });
        //     });
        //     this.babyService.listHospitalType('admission').subscribe((data) => {
        //         this.formatHospital(data.data, isEng).then((formattedData) => {
        //             listTypeHospital.admission = formattedData;
        //             this.listHospitalSubscriber.next(listTypeHospital)
        //
        //         });
        //     });
        //     this.babyService.listHospitalType('transferred').subscribe((data) => {
        //         this.formatHospital(data.data, isEng).then((formattedData) => {
        //             listTypeHospital.transferred = formattedData;
        //             this.listHospitalSubscriber.next(listTypeHospital)
        //
        //         });
        //     });
        //     this.babyService.listHospitalType('admitted').subscribe((data) => {
        //         this.formatHospital(data.data, isEng).then((formattedData) => {
        //             listTypeHospital.admitted = formattedData;
        //             this.listHospitalSubscriber.next(listTypeHospital)
        //
        //         });
        //     });
        // })
    }

    private fetchHospitalData(typeOfHospital, isEng): void {
        if (this.listTypeHospital[typeOfHospital].length === 0) {
            this.babyService.listHospitalType(typeOfHospital)
                .pipe(
                    map((res: any) => {
                        this.listTypeHospital[typeOfHospital] = res.data
                        return res.data
                    }),
                    switchMap(data => {
                        return this.formatHospitalData(data, isEng)
                    })
                ).subscribe(async (data) => {

                await data.then(a => {
                    this.formattedListTypeHospital[typeOfHospital] = a
                });
                this.listHospitalSubscriber.next(this.formattedListTypeHospital)
            })
        } else {
            this.formatHospitalData(this.listTypeHospital[typeOfHospital], isEng).subscribe(async (data) => {
                await data.then(a => {
                    this.formattedListTypeHospital[typeOfHospital] = a
                });
                this.listHospitalSubscriber.next(this.formattedListTypeHospital)
            })
        }
    }

    pushMissingHospitalToView(typeOfHospital, data) {
        let newListHospital
        let isEnglish
        this.languageService.CurrentLanguage.pipe(
            map(isEng => {
                isEnglish = isEng
            }),
            switchMap(data => {
                return of(this.listTypeHospital)
            }),
            switchMap(listTypeHospital => {
                newListHospital = listTypeHospital
                newListHospital[typeOfHospital].push({
                    id: data.id,
                    name: data.name,
                    name_vie: data?.name_vie || data.name
                })
                return this.formatHospitalData(newListHospital[typeOfHospital], isEnglish)
            })
        ).subscribe(async (data) => {
           await data.then(a => {
               this.formattedListTypeHospital[typeOfHospital] = a
               this.listHospitalSubscriber.next(this.formattedListTypeHospital)

           })
        })
    }

    private formatHospitalData(data, isEng): Observable<any> {
        let formattedData = this.formatHospital(data, isEng).then(data => {return data
        })
        return of(formattedData)
    }

    private async formatHospital(data, isEng) {
        let key = 'name'
        if (!isEng) {
            key = 'name_vie'
        }
        let result = []
        if (data.length !== 0) {
            for (let i = 0; i < data.length; i++) {
                if (data[i].child) {
                    let child = await this.formatHospital(data[i].child, isEng);
                    result.push({
                        value: data[i].name,
                        label: data[i][key],
                        children: child
                    })
                } else {
                    result.push({
                        value: data[i].id,
                        label: data[i][key],
                        isLeaf: true
                    })
                }
            }
        }
        return result
    }

    passHospital(type) {
        this.languageService.CurrentLanguage.subscribe(isEng => {
            this.fetchHospitalData(type, isEng)
        })
        return this.listHospitalSubscriber
    }

    private findPathSub(id, data) {
        let result = [];
        if (data) {
            for (let i = 0; i < data.length; i++) {
                if (data[i].value === id) {
                    result.push(data[i].value);
                    break;
                } else {
                    if (!data[i].isLeaf) {
                        let subPath = this.findPathSub(id, data[i].children);
                        if (subPath.length !== 0) {
                            // subPath[0].parent = data[i];
                            result.push(data[i].value)
                            result = result.concat(subPath)
                        }
                    }
                }
            }
            return result
        }
    }

    findPath(id, key): Observable<any> {
        let path: BehaviorSubject<any> = new BehaviorSubject<any>(null)
        this.listHospitalSubscriber.subscribe(data => {
            if (data[key]) {
                let a = this.findPathSub(id, data[key]);
                path.next(a)
            }
        })
        return path.asObservable()
    }

    formatHospitalToId(values) {
        if (values.length !== 0) {
            return values[values.length - 1]
        }
    }

    filterHospital(data) {
        return this.http.post<any>(this.urlFilter, data)
    }

    getGroupHospital() {
        return this.http.get(`${environment.API_HOST}/hospital/groups`)
    }

    addHospital(data) {
        return this.http.post(`${environment.API_HOST}/hospital/add`, data)
    }

    addDiagnosis(data) {
        return this.http.post(`${environment.API_HOST}/diagnosis/add`, data)
    }
}
