import {Component, OnInit} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {map, pluck, tap} from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private readonly route: ActivatedRoute) {
  }

  page = {
    currentPage: 1,
    aroundPage: [1, 2, 3, 4, 5],
    lastPage: 20
  };

  pageSubject: BehaviorSubject<any> = new BehaviorSubject<any>(this.page);
  declare $: any;


  slideConfig = {
    autoplay: false,
    autoplaySpeed: 500,
    arrows: true,
    infinite: true,
    slidesToShow: 4,
    slidesToScroll: 1
  };

  ngOnInit(): void {
    // this.route.data.subscribe(a => {
    //   console.log(a);
    // })
  }

  goToPage(currentPage: any) {
    console.log(currentPage);
  }
}
