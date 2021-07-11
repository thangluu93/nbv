import { Component, OnInit } from '@angular/core';
import {MenuService} from '../../services/menu.service';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-shop-listing',
  templateUrl: './shop-listing.component.html',
  styleUrls: ['./shop-listing.component.scss']
})
export class ShopListingComponent implements OnInit {

  constructor(private menuService: MenuService) { }

  menu$: Observable<any> = new Observable<any>()

  ngOnInit(): void {
    this.menu$ = this.menuService.getMenuList()
  }

}
