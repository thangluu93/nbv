import {Component, Input, OnInit} from '@angular/core';
import {Episode} from "../../../model/episode";
import {BabyService} from "../../baby.service";
import {NotifierService} from "angular-notifier";
import {Discharge} from "../../../model/discharge";
import {Router} from "@angular/router";
import {HospitalService} from "../../../../services/hospital.service";
import {LanguageService} from "../../../../services/language.service";
import {switchMap} from "rxjs/internal/operators";

@Component({
    selector: 'app-baby-episode',
    templateUrl: './baby-episode.component.html',
    styleUrls: ['./baby-episode.component.css']
})
export class BabyEpisodeComponent implements OnInit {

    @Input() babyId;
    @Input() listTypeHospital;
    @Input() allEpisodes;
    @Input() babyDOB;
    @Input() allEpId;
    @Input() isInEpisode;
    @Input() epId
    // tslint:disable-next-line:ban-types
    @Input() createNewBaby: Function;
    episode = new Episode();
    admitTime_withTime;
    formattedAdmitTime = new Date();
    isInvalidDateAdmission: boolean;
    dischargeData: Discharge;
    // allDiagnosis = []
    isShowDischarge = false;
    canReadonlyDischarge = false
    isEng = true


    constructor(private router: Router,
                private babyService: BabyService,
                private notifierService: NotifierService,
                private hospitalService: HospitalService,
                private langService: LanguageService) {
        this.langService.CurrentLanguage.subscribe(isEng => this.isEng = isEng)
    }

    async ngOnInit() {
        // console.log(this.allEpId)
        this.dischargeData = new Discharge();
        if (this.allEpisodes.length > 0 && this.epId) {
            let latestEpisode = await this.getEpisodeByID(this.epId)
            this.dischargeData.baby_id = this.babyId;
            if (latestEpisode.status !== 'discharge') {
                this.episode = {...this.episode, ...latestEpisode}
            } else {
                this.episode = latestEpisode
                this.dischargeData = {...this.dischargeData, ...latestEpisode.discharge_info}
                this.canReadonlyDischarge = true
            }
        }
        // this.babyService.getDiagnosis().subscribe((data: any) => {
        //     if (!data.error) {
        //         this.allDiagnosis = data.data;
        //     } else {
        //         this.notifierService.notify('error', 'Error when get diagnosis')
        //     }
        // })

    }

    onChanges(values: any, key): void {
        if (values.length !== 0) {
            this.episode[key] = values[values.length - 1].value
        }
    }


    async getEpisodeByID(epID) {
        let episode = await this.babyService.getEpisodeInfo(this.babyId, epID).toPromise().then((data: any) => {
            return data
        });

        if (episode.admit_from.id) {
            this.hospitalService.findPath(episode.admit_from.id, 'admitted').subscribe((path) => {
                if(path.length === 0){
                    this.hospitalService.pushMissingHospitalToView('admitted',episode.admit_from)
                    console.log([episode.admit_from.id])
                    return episode.admit_from = [episode.admit_from.id]
                }
                return episode.admit_from = path;
            })
        }
        if (episode.admit_to.id) {
            this.hospitalService.findPath(episode.admit_to.id, 'admission').subscribe((path) => {
                return episode.admit_to = path
            })
        }

        if (episode.admit_time) {
            this.formattedAdmitTime = new Date(episode.admit_time);
        }
        return episode
    }


    createBaby() {
        let episode = JSON.parse(JSON.stringify(this.episode))
        if (episode.admit_from) {
            // @ts-ignore
            episode.admit_from = this.episode.admit_from[this.episode.admit_from.length - 1]
        }
        if (episode.admit_to) {
            // @ts-ignore
            episode.admit_to = this.episode.admit_to[this.episode.admit_to.length - 1]
        }
        if (!this.babyId) {
            let newBaby;
            this.createNewBaby().then(baby => {
                episode.admit_time = this.formattedAdmitTime.toISOString()
                newBaby = {...baby, ...episode};
                newBaby.id = newBaby.input_id;
                newBaby.type = 'CREATE';
                this.babyService.saveBaby(newBaby).subscribe((data) => {
                        if (data.error) {
                            this.notifierService.notify("error", data.message);
                        } else {
                            this.notifierService.notify("success", "Success");
                            return this.router.navigate(['/baby'])
                        }
                    },
                    (res: any) => {
                        return this.notifierService.notify("error", res.error.message);
                    })
            });

        } else {
            episode.baby_id = this.babyId;
            if (this.admitTime_withTime) {
                episode.admit_time = this.admitTime_withTime;
            }
            episode.admit_time = this.formattedAdmitTime.toISOString()

            if (this.isInEpisode) {
                episode.type = 'UPDATE';
            } else {
                episode.type = 'CREATE';
            }
            this.babyService.saveEpisode(episode).subscribe((data: any) => {
                    console.log(123)
                    if (data.error) {
                        this.notifierService.notify("error", "Error");
                    } else {
                        this.notifierService.notify("success", "Success");
                        return this.router.navigate(['/baby'])
                    }
                },
                (res: any) => {
                    return this.notifierService.notify("error", res.error.message);
                });
        }
    }


    showDischarge() {
        this.isShowDischarge = true;
        // console.log(this.isShowDischarge)
    }

    closeDischarge() {
        this.isShowDischarge = false
    }


}
