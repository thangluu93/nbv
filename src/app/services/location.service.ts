import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {DataService} from './data.service';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor(private http: HttpClient, private dataService: DataService) {
  }

  getProvince() {
    return this.http.get(`${environment.CKSC_URL}/location/provinces`, this.dataService.httpConfig);
  }

  getDistricts(provinceId: any) {
    return this.http.get(`${environment.CKSC_URL}/location/districts/${provinceId}`, this.dataService.httpConfig);
  }

  getWard(districtId: any) {
    return this.http.get(`${environment.CKSC_URL}/location/wards/${districtId}`, this.dataService.httpConfig);
  }



}
