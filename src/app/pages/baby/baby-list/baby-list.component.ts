import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {BabyService} from "../baby.service";
import {Router} from "@angular/router";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {catchError, map, startWith, switchMap} from "rxjs/operators";
import {of} from "rxjs";
import {HospitalService} from "../../../services/hospital.service";
import {FilterService} from "../../../services/filter.service";

@Component({
    selector: 'app-baby-list',
    templateUrl: './baby-list.component.html',
    styleUrls: ['./baby-list.component.css']
})
export class BabyListComponent implements OnInit, AfterViewInit {

    selectedBaby = [];

    cols: any[];
    listBaby = [];
    dataSource: MatTableDataSource<any>;
    // DOA: Date of Admission
    // DOB: Date of birth
    displayColumns: string[] = ['babyId', 'uniqueId', 'hospital', 'gender', 'DOB']
    isLoadingResults = false
    pageSize = 50
    hospitalOption = [];
    selectedHospital:string = null;
    @ViewChild(MatPaginator) paginator: MatPaginator;


    constructor(private babyService: BabyService,
                private router: Router,
                private hospitalservice: HospitalService,
                private filterService: FilterService) {
        this.hospitalservice.passHospital('admission').subscribe((data) => {
            this.hospitalOption = data.admission
        })
    }

    ngOnInit() {
        this.cols = [
            {field: 'id', header: 'Baby ID'},
            {field: 'input_id', header: 'Unique ID'},
            {field: 'hospital', header: 'Hospital'},
            {field: 'gender', header: 'Gender'},
            {field: 'birthday', header: 'Day of birth'},
        ];
    }

    ngAfterViewInit() {
        this.paginator.page.pipe(
            startWith({}),
            switchMap(() => {
                this.isLoadingResults = true;
                return this.babyService.getListBaby(this.paginator.pageIndex + 1, this.pageSize);
            }),
            map((data: any) => {
                this.isLoadingResults = false;
                return data.data
            }),
            catchError((err) => {
                console.log(err)
                this.isLoadingResults = false;
                return of([]);
            })
        ).subscribe(data => {
            this.dataSource = new MatTableDataSource<any>(data)
        })
    }

    onRowSelect(rowData) {
        this.router.navigateByUrl('baby/details/' + rowData['sys_id']).then(r => console.log(r));
    }

    applyFilterHospital() {
        this.dataSource.filter = this.selectedHospital
    }

    applyFilter(event: Event) {
        this.dataSource.filter = (event.target as HTMLInputElement).value;
    }
}

