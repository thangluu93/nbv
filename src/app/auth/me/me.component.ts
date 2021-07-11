import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-me',
  templateUrl: './me.component.html',
  styleUrls: ['./me.component.scss']
})
export class MeComponent implements OnInit {

  tabs = '';
  TabList = TabList;

  constructor(private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      let tab = params.get('tab');
      // @ts-ignore
      if (tab && Object.values(this.TabList).includes(tab)) {
        this.tabs = tab;
      } else {
        this.router.navigate(['/auth/me', this.TabList.accountInformation]);
      }
    });
  }


  changeTab(param: string) {
    this.router.navigate(['/auth/me', param]);
  }

}


enum TabList {
  accountInformation = 'account-information',
  orderHistory = 'order-history',
  orderProcessing = 'order-processing'
}
