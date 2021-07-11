import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, RouteConfigLoadEnd, Route, Router} from '@angular/router';
import {filter, pluck, switchMap, tap} from 'rxjs/operators';
import {Observable, of} from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  ROUTE_DATA_BREADCRUMB = 'breadcrumb';
  breadcrumb$: Observable<BreadCrumbs> = new Observable<BreadCrumbs>();

  constructor(private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit(): void {
    this.breadcrumb$ = this.router.events
      .pipe(
        filter(event => event instanceof RouteConfigLoadEnd),
        switchMap(data => {
          return HeaderComponent.createBreadcrumbs(this.route.root);
        })
      );
  }

  private static createBreadcrumbs(route: ActivatedRoute, breadcrumbs = []): Observable<BreadCrumbs> {
    // route.data.subscribe(
    //   a => {
    //     console.log(a);
    //   }
    // )
    return of({
      path: '/',
      label: 'Home'
    });
  }
}


interface BreadCrumbs {
  path: string,
  label: string
}
