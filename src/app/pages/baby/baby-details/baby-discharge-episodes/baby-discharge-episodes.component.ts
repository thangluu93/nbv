import {
    AfterViewChecked,
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    Input,
    OnInit
} from '@angular/core';
import {Discharge} from "../../../model/discharge";
import {FormControl} from "@angular/forms";
import {BabyService} from "../../baby.service";
import {NotifierService} from "angular-notifier";
import {Router} from "@angular/router";
import {Observable, of} from "rxjs";
import {FilterService} from "../../../../services/filter.service";
import {concatMap, debounceTime, map, startWith, tap} from "rxjs/operators";
import {HospitalService} from "../../../../services/hospital.service";
import {DischargeDataService} from "../../../../services/discharge-data.service";
import {LanguageService} from "../../../../services/language.service";

@Component({
    selector: 'app-baby-discharge-episodes',
    templateUrl: './baby-discharge-episodes.component.html',
    styleUrls: ['./baby-discharge-episodes.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BabyDischargeEpisodesComponent implements OnInit, AfterViewInit, AfterViewChecked {

    @Input() dischargeData: Discharge;
    @Input() listTypeHospital
    @Input() readonlyDischarge
    antibioticsFormControl = new FormControl();
    diagnosisFilter = new FormControl();
    allDiagnosis = of(null);
    isEng = true
    isEngSubscription = of(true)
    filterDiagnosisOption: Observable<string[]>;
    backupDiagnosis
    antibiotics: string[] = ['Ampicillin', 'Ampicillin+Sulbactam', 'Amoxycillin', 'Amikacin', 'Penicillin', 'Gentamicin', 'Cefotaxime', 'Ceftazidime',
        'Cefuroxime',
        'Ceftriaxone',
        'Ticaricillin',
        'Piperacillin',
        'Vancomycin',
        'Imipenem',
        'Meropenem',
        'Ciprofloxacin',
        'Metronidazole',
        'Colistin',
        'Fosfomycin',
        'Cefoperazone',
        'Azithromycin',
        'Levofloxacin',
        'Other']

    constructor(private elem: ElementRef,
                private babyService: BabyService,
                public notifierService: NotifierService,
                private router: Router,
                private filterService: FilterService,
                private hospitalService: HospitalService,
                private dischargeService: DischargeDataService,
                private languageService: LanguageService) {

    }

    ngAfterViewChecked() {
    }

    ngOnInit() {
        this.isEngSubscription = this.languageService.CurrentLanguage
        this.languageService.CurrentLanguage.subscribe(isEng => {
            this.isEng = isEng;
            this.formatDiagnosis(isEng)
        })
        this.hospitalService.passHospital('transferred').subscribe((data) => {
            this.listTypeHospital.transferred = data.transferred
        })
        this.filterDiagnosisOption = this.diagnosisFilter.valueChanges.pipe(
            debounceTime(200),
            startWith(''),
            map(value => {
                let data = this.filterService._filter(this.allDiagnosis, value, 'title');
                return this.filterService.removeDuplicatesBy(x => x.title, data)
            })
        )
        this.dischargeData = this.dischargeService.formatDischargeDataToView(this.dischargeData)
    }

    ngAfterViewInit() {
        if (this.dischargeData['blood_culture_result']) {
            let elementsBlood = this.elem.nativeElement.querySelectorAll('.blood_culture_result');
            for (let ele of elementsBlood) {
                let result = this.dischargeData['blood_culture_result'].filter((result: number) => {
                    if (result === ele.value) {
                        return result
                    }
                })
                if (result[0]) {
                    ele.checked = true
                }
            }
        }

        if (this.dischargeData['other_blood_culture_result']) {
            let elementsOtherBlood = this.elem.nativeElement.querySelectorAll('.another-culture-result');
            for (let ele of elementsOtherBlood) {
                let result = this.dischargeData['other_blood_culture_result'].filter((result: number) => {
                    if (result === ele.value) {
                        return result
                    }
                })
                if (result[0]) {
                    ele.checked = true
                }
            }
        }
    }

    getAllDiagnosis() {
        return this.babyService.getDiagnosis()
    }

    formatDiagnosis(isEng) {
        return this.getAllDiagnosis().pipe(
            tap({
                next: (data: any) => {
                    let diagnosis = JSON.parse(JSON.stringify(data))
                    if (!isEng) {
                        for (let d of diagnosis){
                            d.title = d.title_vie
                        }
                    }
                    this.allDiagnosis = of(diagnosis)
                }
            })
        ).subscribe()
    }

    checkOutcome(index) {
        return Number(this.dischargeData.outcome) === index
    }

    checkIf(key, value) {
        return Number(this.dischargeData[key]) === value
    }

    onChanges(values: any, key): void {
        if (values.length !== 0) {
            this.dischargeData[key] = values[values.length - 1].value
        }
    }

    changeProblems(key = 'blood_culture_result') {
        this.dischargeData[key] = [];
        let elements;
        if (key === 'blood_culture_result') {
            elements = this.elem.nativeElement.querySelectorAll('.blood_culture_result');
        } else {
            elements = this.elem.nativeElement.querySelectorAll('.another-culture-result');
        }
        for (let ele of elements) {
            if (ele.checked) {
                this.dischargeData[key].push(parseInt(ele.value, 10));
            }
        }
    }

    isDisable(data, key, index) {
        return data[key] && index ? data[key].indexOf(index) !== -1 : false
    }

    customSearchDiagnosis(term, item) {
        let rmVieTone = function removeVietnameseTones(str) {
            str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
            str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
            str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
            str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
            str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
            str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
            str = str.replace(/đ/g, "d");
            str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
            str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
            str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
            str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
            str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
            str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
            str = str.replace(/Đ/g, "D");
            // Some system encode vietnamese combining accent as individual utf-8 characters
            // Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
            str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
            str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
            // Remove extra spaces
            // Bỏ các khoảng trắng liền nhau
            str = str.replace(/ + /g, " ");
            str = str.trim();
            // Remove punctuations
            // Bỏ dấu câu, kí tự đặc biệt
            str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, " ");
            return str;
        }

        term = rmVieTone(term.toLowerCase());
        return (
            rmVieTone(item.title_vie.toLowerCase()).indexOf(term) > -1 ||
            item.title.toLowerCase().replace(' ', '').indexOf(term) > -1 ||
            item.code.toLowerCase().replace(' ', '').indexOf(term) > -1
        );


    }

    dischargeEpisode() {
        let reqData: any = JSON.parse(JSON.stringify(this.dischargeData));
        reqData.type = "DISCHARGE";
        reqData.discharge = new Date(this.dischargeData.discharge).toISOString()
        reqData.full_milk_feeding = new Date(this.dischargeData.full_milk_feeding).toISOString()
        reqData.cooling_start = new Date(this.dischargeData.cooling_start).toISOString()
        reqData.rewarming_start = new Date(this.dischargeData.rewarming_start).toISOString()
        reqData.cooling_stop = new Date(this.dischargeData.cooling_stop).toISOString()
        reqData.transfer_last_blood_gas = new Date(this.dischargeData.transfer_last_blood_gas).toISOString()
        reqData.transfer_last_full_blood = new Date(this.dischargeData.transfer_last_full_blood).toISOString()
        reqData.transfer_last_electrolytes = new Date(this.dischargeData.transfer_last_electrolytes).toISOString()
        if (this.dischargeData.transfer_to) {
            reqData.transfer_to = this.hospitalService.formatHospitalToId(this.dischargeData.transfer_to)
        }
        this.babyService.dischargeEpisode(reqData).subscribe((data: any) => {
            if (!data.error) {
                this.router.navigate(['/baby'])
                return this.notifierService.notify("success", "Discharge Successfully");

            } else {
                this.notifierService.notify('error', data.message)
            }
        }, (err) => {
            console.log(err)
            this.notifierService.notify('error', `Error System ${err.error.message}. Please try again later`)
        })
    }
}
