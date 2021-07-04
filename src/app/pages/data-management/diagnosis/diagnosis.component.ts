import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {HospitalService} from "../../../services/hospital.service";
import {NotifierService} from "angular-notifier";

@Component({
    selector: 'app-diagnosis',
    templateUrl: './diagnosis.component.html',
    styleUrls: ['./diagnosis.component.css']
})
export class DiagnosisComponent implements OnInit {

    constructor(private hospitalService: HospitalService, private notifier: NotifierService) {
    }

    newDiagnosisForm: FormGroup

    ngOnInit(): void {
        this.newDiagnosisForm = new FormGroup({
            'idc10_code': new FormControl(''),
            'title': new FormControl(null),
            'title_vie': new FormControl(null),
            'diagnosis_id': new FormControl('')
        })
    }

    addDiagnosis() {
        let confirmation = confirm('Please make sure your input data is correct!!! This data cannot be changed in the future.')
        if (confirmation) {
            this.hospitalService.addDiagnosis(this.newDiagnosisForm.value).subscribe(
                (res: any) => {
                    return this.notifier.notify('success', res.message)
                },
                (error) => {
                    return this.notifier.notify('error', error.error.message)
                })
        } else {
            return
        }
    }

}
