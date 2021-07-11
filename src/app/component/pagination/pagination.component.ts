import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit, AfterViewInit, OnDestroy {

  constructor(private el: ElementRef) {
  }

  @Output() pageIndex: EventEmitter<any> = new EventEmitter<any>();
  @Input() pageSubject: any;
  page: any = {
    currentPage: 1,
    aroundPage: [1, 2, 3, 4, 5],
    lastPage: 10
  };

  @ViewChild('indexPage') indexPage: ElementRef | any;


  ngOnInit(): void {
    this.subscribePageIndex();
  }

  ngAfterViewInit() {
    setInterval(() => this.renderIndex(), 10);
    this.pageSubject.unsubscribe()
  }

  ngOnDestroy() {
  }

  countPage (currentPage: number){
    let aroundPage = this.page.aroundPage;
    if (this.page.currentPage !== 1 && aroundPage.indexOf(currentPage) === -1) {
      aroundPage = [];
      let firstPage;
      let lastPage;
      if (currentPage - this.page.currentPage === 1) {
        firstPage = currentPage - 4;
        lastPage = currentPage + 1;
      } else {
        firstPage = currentPage;
        lastPage = currentPage + 5;
      }
      for (let i = firstPage; i < lastPage; i++) {
        aroundPage.push(i);
      }
    }
    this.page = {
      currentPage: currentPage,
      aroundPage: aroundPage,
      lastPage: 20
    };
  }

  subscribePageIndex() {
    this.pageSubject.subscribe((page: any) => {
      this.page = page;
    });
  }

  renderIndex() {
    let indexes = (<HTMLElement> this.el.nativeElement).querySelectorAll('.index-page');
    indexes.forEach(r => {
      if(r.className.indexOf('current-page') !== -1){
        r.classList.remove('current-page')
      }
      if (this.page.currentPage.toString() === r.id) {
        r.classList.add('current-page');
      } else {
        r.addEventListener('click', () => {
          this.goToPage(null, Number(r.id));
        });
      }
    });
  }

  goToPage(type?: any, page?: number) {
    let moveToPage
    if (type === 'next') {
      moveToPage = this.page.currentPage + 1
    }
    if (type === 'prev') {
      moveToPage =this.page.currentPage - 1
    }
    if (page) {
      moveToPage = page
    }
    this.countPage(moveToPage)
    return this.pageIndex.emit(moveToPage)
  }
}
