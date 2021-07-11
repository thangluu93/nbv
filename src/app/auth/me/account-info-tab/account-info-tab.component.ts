import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {LocationService} from '../../../services/location.service';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-account-info-tab',
  templateUrl: './account-info-tab.component.html',
  styleUrls: ['./account-info-tab.component.scss']
})
export class AccountInfoTabComponent implements OnInit {

  constructor(private location: LocationService) {
  }

  provincesSubscriber: any;
  districtsSubscriber: any;
  wardsSubscriber: any;

  ngOnInit(): void {
    this.getProvince();
  }

  accountForm = new FormGroup({
    'name': new FormControl(''),
    'email': new FormControl(''),
    'password': new FormControl(''),
    'phoneNumber': new FormControl(''),
    'address': new FormControl(''),
    'province': new FormControl(''),
    'district': new FormControl(''),
    'ward': new FormControl('')
  });

  getProvince() {
    this.provincesSubscriber = this.location.getProvince().pipe(map((res: any) => {
      return res.data;
    }));
  }

  updateProfile() {
    console.log(this.accountForm.value);
  }

  getDistricts() {
    let provinceId = (this.accountForm.controls['province'].value)?.id;
    this.districtsSubscriber = this.location.getDistricts(provinceId).pipe(
      map((res: any) => {
        return res.data;
      }));
    this.accountForm.controls['ward'].setValue('');
  }

  getWards() {
    let districtId = (this.accountForm.controls['district'].value)?.id;
    this.wardsSubscriber = this.location.getWard(districtId).pipe(
      map((res: any) => {
        return res.data;
      }));
  }
}
