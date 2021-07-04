import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {HospitalService} from "../../../services/hospital.service";
import {delay, map} from "rxjs/operators";
import {Observable} from "rxjs";
import {NotifierService} from "angular-notifier";

@Component({
    selector: 'app-hospital',
    templateUrl: './hospital.component.html',
    styleUrls: ['./hospital.component.css']
})
export class HospitalComponent implements OnInit {

    groupHospitalSubscriber: Observable<any>;
    visualGroupObservable: Observable<any>

    constructor(private hospitalService: HospitalService, private notifierService: NotifierService) {
    }

    newHospitalForm: FormGroup = new FormGroup({
        name: new FormControl(null),
        group_1_id: new FormControl(null),
        group_2_id: new FormControl(null),
        group_3_id: new FormControl(null),
        admission: new FormControl(true),
        transferred: new FormControl(true),
        place_booking: new FormControl(true),
        place_birth: new FormControl(true),
        admitted: new FormControl(true)

    })

    ngOnInit(): void {
        this.groupHospitalSubscriber = this.hospitalService.getGroupHospital().pipe(
            map((res: any) => {
                delay(1000)
                return res.data
            })
        )

        this.visualGroupObservable = this.newHospitalForm.valueChanges.pipe(map((data: any) => {
            if (data.name) {
                data.default_hospital = {
                    name: 'Vietnam National Children’s Hospital'
                }
                return data
            } else {
                return
            }
        }))

    }

    addHospital() {

        let confirmation = confirm('Please make sure your input data is correct!!! This data cannot be changed in the future.')
        if (confirmation) {
            let data = {
                name: this.newHospitalForm.controls['name'].value,
                group_1_id: this.newHospitalForm.controls['group_1_id'].value?.id,
                group_2_id: this.newHospitalForm.controls['group_2_id'].value?.id,
                group_3_id: this.newHospitalForm.controls['group_3_id'].value?.id,
                admission: this.newHospitalForm.controls['admission'].value,
                transferred: this.newHospitalForm.controls['transferred'].value,
                place_booking: this.newHospitalForm.controls['place_booking'].value,
                place_birth: this.newHospitalForm.controls['place_birth'].value,
                admitted: this.newHospitalForm.controls['admitted'].value
            }
            this.hospitalService.addHospital(data).subscribe((res: any) => {
                    if (!res.error) {
                        return this.notifierService.notify("success", res.message);
                    }
                },
                (error) => {
                    console.log(error)
                    return this.notifierService.notify("error", error.error.message)
                }
            )
        } else {
            console.log('close')
            return
        }
    }
}
