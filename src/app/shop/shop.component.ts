import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit, AfterViewInit {

  constructor(private route: ActivatedRoute, private el: ElementRef) {
  }

  @ViewChild('cateList') cateList: ElementRef<any> | any;
  category: string = ''
  page = {
    currentPage: 1,
    aroundPage: [1, 2, 3, 4, 5],
    lastPage: 20
  };

  pageSubject: BehaviorSubject<any> = new BehaviorSubject<any>(this.page);

  ngOnInit(): void {
    this.route.paramMap.subscribe((param: any) => {
      this.category = param.get('category');
    });

  }

  ngAfterViewInit() {
    let categories = (<HTMLElement> this.el.nativeElement).querySelectorAll('.item');
    categories.forEach((cateRef: any) => {
      if (cateRef.id == this.category){
        console.log(cateRef.id);
        cateRef.classList.add('active')
      }
    });
  }

}
