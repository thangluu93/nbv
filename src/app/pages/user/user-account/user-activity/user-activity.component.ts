import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {UserService} from "../../user.service";
import {MatPaginator} from '@angular/material/paginator';
import {isObject} from "rxjs/internal-compatibility";
import {catchError, filter, finalize, map, startWith, switchMap} from "rxjs/operators";
import {BehaviorSubject, of} from "rxjs";
import {empty} from "rxjs/internal/Observer";
import {NotifierService} from "angular-notifier";

@Component({
    selector: 'app-user-activity',
    templateUrl: './user-activity.component.html',
    styleUrls: ['./user-activity.component.css']
})
export class UserActivityComponent implements OnInit, AfterViewInit {

    @ViewChild(MatPaginator) paginator: MatPaginator;

    displayedColumns: string[] = ['time', 'user_email', 'description']
    dataSource: any;
    filterRangeTime = [];
    isLoadingResults = true;
    loadingSubject = new BehaviorSubject(false)
    loading$ = this.loadingSubject.asObservable();
    itemPerPage = 10;
    limitActivity = this.itemPerPage * 5;
    index = 1;

    constructor(public userService: UserService,
                public notifiService: NotifierService) {
    }

    ngOnInit() {
        this.dataSource = new MatTableDataSource(null);

    }

    dataRange() {
        console.log(this.filterRangeTime)
        if (this.filterRangeTime.length > 0 && this.filterRangeTime[0] && this.filterRangeTime[1]) {
            this.dataSource.filter = this.filterRangeTime.toString();
        } else {
            this.dataSource.filter = ''
        }
    }


    ngAfterViewInit() {
        this.paginator.page.pipe(
            startWith({}),
            switchMap(() => {
                if ((this.paginator.pageIndex * this.itemPerPage) % this.limitActivity === 0) {
                    this.isLoadingResults = true;
                    console.log(this.index)
                    return this.userService.getActivityLog(this.index, this.limitActivity);
                } else {
                    return of({})
                }
            }),
            map((data: any) => {
                this.isLoadingResults = false;
                if (data.data) {
                    this.index += 1;
                    return data.data
                } else {
                    return []
                }
            }),
            catchError((err) => {
                console.log(err)
                this.isLoadingResults = false;
                return [{error: true}]
            })
        ).subscribe(data => {
            if (!this.dataSource.data && data.length > 0) {
                this.dataSource = new MatTableDataSource<any>(data)
                this.dataSource.paginator = this.paginator
                this.dataSource.filterPredicate = this.filterDateRange();
                this.dataSource.paginator.length = 1000;
            } else {
                if (data.length > 0) {
                    this.dataSource.data = this.dataSource.data.concat(data);
                    this.dataSource.paginator.length = 1000;
                } else if (data.error) {
                    this.notifiService.notify('error', "End of list!!!")
                    this.dataSource.paginator.length = this.dataSource.data.length;
                    this.dataSource.paginator.previousPage()
                    return
                }
            }

            this.dataSource.paginator.length = 1000;
        })
    }

    applyFilter(event: Event, isSearch = true) {
        if (isSearch && event.target) {
            const filterValue = (event.target as HTMLInputElement).value;
            this.dataSource.filter = filterValue.trim().toLowerCase();
        }
    }


    filterDateRange(): (data: any, filter: string) => boolean {
        // tslint:disable-next-line:no-shadowed-variable
        let filterFn = (data, filter: string): boolean => {
            if (filter) {
                let filterVal = filter.split(',')
                if (filterVal.length > 0) {
                    return (new Date(filterVal[0])) <= (new Date(data.time)) && (new Date(data.time)) <= (new Date(filterVal[1]))
                }
            } else {
                this.dataSource.filter = null
            }

        };
        return filterFn
    }


}
