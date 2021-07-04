import {Component, ElementRef, OnInit, QueryList, ViewChildren} from '@angular/core';
import {Baby} from '../../model/baby';
import {BabyService} from '../baby.service';
import {Location} from '@angular/common';
import {ActivatedRoute} from "@angular/router";
import {NotifierService} from "angular-notifier";
import {Observable, of} from "rxjs";
import {HospitalService} from "../../../services/hospital.service";
import {isNumeric} from "rxjs/internal-compatibility";
import {LanguageService} from "../../../services/language.service";
import {switchMap} from "rxjs/internal/operators";


@Component({
    selector: 'app-baby-details',
    templateUrl: './baby-details.component.html',
    styleUrls: ['./baby-details.component.css']
})

export class BabyDetailsComponent implements OnInit {

    baby = new Baby();
    babySysID: string;
    expect_delivery_withTime;
    birthday_withTime;
    public routerParams: any;
    showEpisode = false;
    allEpisode = [];
    allEpID = []
    lastEpisodes;
    isEpisodeAlready = false;
    canAddEpisode = true;
    babySubscriber;
    formattedDOB = new Date();
    havePermission = false;
    listHospitalSubscriber: Observable<any>
    newEp = false
    selectedTabsIndex = 0;
    isEng
    @ViewChildren('allTabsEpisodes') allTabsEpisodes: QueryList<any>
    listTypeHospital = {admission: [], transferred: [], place_booking: [], place_birth: [], admitted: []};
    private sub: any;

    constructor(private babyService: BabyService,
                private location: Location,
                private notifierService: NotifierService,
                private elem: ElementRef,
                private route: ActivatedRoute,
                private hospitalService: HospitalService,
                private langService: LanguageService
    ) {
        this.sub = this.route.params.subscribe(params => {
            this.routerParams = params;
            if (this.routerParams['sys_id']) {
                this.babySysID = this.routerParams['sys_id'];
                this.babySubscriber = this.babyService.getBabyInfo(this.babySysID)
                this.getBabyById();
            } else {
                this.showEpisode = true;
                this.newEp = true
            }
        });
        this.langService.CurrentLanguage.subscribe(isEng => this.isEng = isEng)
    }

    get createBabyFunc() {
        return this.createBaby.bind(this)
    }

    ngOnInit() {
        this.hospitalService.passHospital('place_booking').subscribe((data) => {
            this.listTypeHospital.place_booking = data.place_booking
        })
        this.hospitalService.passHospital('place_birth').subscribe((data) => {
            this.listTypeHospital.place_birth = data.place_birth
        })
        this.hospitalService.passHospital('admission').subscribe((data) => {
            this.listTypeHospital.admission = data.admission
        })
        this.hospitalService.passHospital('admitted').subscribe((data) => {
            this.listTypeHospital.admitted = data.admitted
        })
    }


    async getBabyById() {

        let baby = await this.babySubscriber.toPromise().then(data => {
            // let baby = data
            return data.data
        })
        if (baby.expect_delivery) {
            baby.expect_delivery = new Date(baby.expect_delivery)
        }
        if (baby.birthday) {
            this.formattedDOB = new Date(baby.birthday)
        }

        if (baby.place_booking.id) {
            this.hospitalService.findPath(baby.place_booking.id, 'place_booking').subscribe(path => {
                baby.place_booking = path
            })
        }

        if (baby.place_birth.id) {
            this.hospitalService.findPath(baby.place_birth.id, 'place_birth').subscribe(path => {
                baby.place_birth = path
            })
        }

        let _problems = [];
        for (let problem of baby.problems) {
            _problems.push(problem)
            baby.problems = _problems;
        }

        let elements = this.elem.nativeElement.querySelectorAll('.problems-check');
        for (let ele of elements) {
            if (baby.problems.includes(ele.id)) {
                ele.checked = true;
            }
        }
        if (baby.all_episodes.length > 0) {
            // this.showEpisode = true;

            for (let ep of baby.all_episodes) {
                if (ep.viewable === true) {
                    this.allEpisode.push(ep)
                }
            }
        }
        this.canAddEpisode = baby.allow_add_episode
        this.baby = baby;
    }


    async createBaby(isSaveStatic = false) {
        let baby = JSON.parse(JSON.stringify(this.baby))
        if (baby.place_birth && baby.place_birth[0]) {
            baby.place_birth = this.hospitalService.formatHospitalToId(this.baby.place_birth)
        }
        if (baby.place_booking) {
            baby.place_booking = isNumeric(baby.place_booking[0]) ? baby.place_booking[0] : this.hospitalService.formatHospitalToId(this.baby.place_booking)

        }
        if (baby.mother_name && baby.birthday && !this.babySysID) {
            const motherName = this.removeAccents(this.baby.mother_name).toLowerCase();
            const _date = this.baby.birthday.getUTCDate();
            const _month = (this.baby.birthday.getUTCMonth() + 1);
            const _year = this.baby.birthday.getUTCFullYear();
            baby.id = motherName + _date + _month + _year;
        }
        if (this.formattedDOB) {
            baby.birthday = this.formattedDOB.toISOString();
        }
        if (baby.expect_delivery instanceof Date) {
            baby.expect_delivery = baby.expect_delivery.toISOString();
        }

        if (this.babySysID) {
            baby.type = 'UPDATE';
            if (baby.sys_id) {
                baby.id = baby.sys_id;
            }
            delete baby.sys_id;
            if (isSaveStatic === true) {
                try {
                    delete baby.input_id
                    delete baby.all_episodes
                    // baby.place_booking = baby.place_booking[0] ? baby.place_booking[0].value : baby.place_booking
                    // baby.place_birth = baby.place_birth[0] ? baby.place_birth[0].value : baby.place_birth
                    return await this.babyService.saveBaby(baby).toPromise().then(data => {
                        if (data.error) {
                            console.log(data.message)
                            this.notifierService.notify('error', data.message)
                        } else {
                            this.notifierService.notify('success', 'Save successful')

                        }
                    }).catch((res: any) => {
                        this.notifierService.notify('error', res.error.message)
                    })
                } catch (err) {
                    console.log(err)
                    this.notifierService.notify('error', err.error.message)

                }
            }
            // if (this.baby.input_id) {
            //     this.baby.id = this.baby.input_id;
            // }
        } else {
            baby.type = 'CREATE';
        }
        return baby;
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

    changeProblems() {
        this.baby.problems = [];
        let elements = this.elem.nativeElement.querySelectorAll('.problems-check');
        for (let ele of elements) {
            if (ele.checked) {
                this.baby.problems.push(parseInt(ele.id, 10));
            }
        }
        if (this.baby.problems.indexOf(10) === -1) {
            this.baby.problem_other = null;
        }
    }

    addEpisode() {
        this.showEpisode = true;
        this.newEp = true;
        this.selectedTabsIndex = Number(this.allTabsEpisodes.first._tabs.length)
        // console.log(this.canAddEpisode)
    }


    back() {
        this.location.back();
    }

    isIncludeNoneProblem()
        :
        boolean {
        return this.baby.problems.indexOf(1) !== -1
    }

    viewEpisode() {
        this.showEpisode = true;
    }

    asd() {
        console.log(this.baby.place_booking)
    }
}
