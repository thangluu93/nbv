import {Injectable} from '@angular/core';
import {HospitalService} from "./hospital.service";

@Injectable({
    providedIn: 'root'
})
export class DischargeDataService {

    constructor(private hospitalService: HospitalService) {
    }

    formatDischargeDataToView(dischargeData) {
        if (dischargeData.outcome === 1) {
            dischargeData = {...dischargeData, ...dischargeData['transferred_detail']}
            this.hospitalService.findPath(dischargeData.transfer_to['id'], 'transferred').subscribe((data) => {
                dischargeData.transfer_to = data
            })
                // dischargeData.transfer_milk_types = dischargeData.transfer_milk_types.map((obj) => {
                //     return obj.id
                // })
            delete dischargeData['transfer_detail']
        }
        // dischargeData.blood_culture_result = dischargeData.blood_culture_result.map((obj) => {
        //     return obj.id
        // })
        // dischargeData.other_blood_culture_result = dischargeData.other_blood_culture_result.map((obj) => {
        //     return obj.id
        // })
        // dischargeData.antibiotics_type = dischargeData.antibiotics_type.map((obj) => {
        //     return obj.id
        // })
        return dischargeData
    }
}
