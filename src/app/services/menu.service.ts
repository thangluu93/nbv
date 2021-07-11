import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {DataService} from './data.service';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  constructor(public http: HttpClient, private dataService: DataService) {
  }

  getProductDetails(id: string) {
    return this.http.post(`${environment.CKSC_URL}/menu/product-detail`, {id: id}, this.dataService.httpConfig);
  }

  getMenuList(category = '', page = 1) {
    let params = new HttpParams().set('page', page.toString());
    if (category) {
      params.set('category', category);
    }
    return this.http.get(`${environment.CKSC_URL}/menu/get`, {params: params})
      .pipe(
        map((res: any) => res.data)
      );
  }
}
