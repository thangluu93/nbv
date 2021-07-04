import {NgModule} from '@angular/core';
import {CommonModule, registerLocaleData} from '@angular/common';
import {TableModule} from 'primeng/table';

import {BabyRoutingModule} from './baby-routing.module';
import {BabyListComponent} from './baby-list/baby-list.component';
import {BabyDetailsComponent} from './baby-details/baby-details.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BsDatepickerModule} from 'ngx-bootstrap/datepicker';
import {BabyService} from './baby.service';
import {BabyEpisodeComponent} from './baby-details/baby-episode/baby-episode.component';
import {TabsModule} from "ngx-bootstrap/tabs";
import {MatTableModule} from "@angular/material/table";
import {MatSortModule} from "@angular/material/sort";
import {MatFormFieldModule} from "@angular/material/form-field";
import {FormatDatetimePipe, RoundedFloatPipe} from "../../services/safe.pipe";
import {MatRadioModule} from "@angular/material/radio";
import {MatSelectModule} from "@angular/material/select";
import {BabyDischargeEpisodesComponent} from './baby-details/baby-discharge-episodes/baby-discharge-episodes.component'
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatInputModule} from "@angular/material/input";
import {OwlDateTimeModule, OwlNativeDateTimeModule} from "ng-pick-datetime";
import {NzCascaderModule} from "ng-zorro-antd/cascader";

import en from '@angular/common/locales/en';

import {NZ_ICONS} from 'ng-zorro-antd/icon';
import {NZ_I18N, en_US} from 'ng-zorro-antd/i18n';
import {IconDefinition} from '@ant-design/icons-angular';
import * as AllIcons from '@ant-design/icons-angular/icons';
import {MatTabsModule} from "@angular/material/tabs";
import {NgSelectModule} from "@ng-select/ng-select";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatPaginatorModule} from "@angular/material/paginator";


registerLocaleData(en);

const antDesignIcons = AllIcons as {
    [key: string]: IconDefinition;
};
const icons: IconDefinition[] = Object.keys(antDesignIcons).map(key => antDesignIcons[key])

@NgModule({
    declarations: [BabyListComponent, BabyDetailsComponent, BabyEpisodeComponent, RoundedFloatPipe, BabyDischargeEpisodesComponent, FormatDatetimePipe],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        BabyRoutingModule,
        TableModule,
        FormsModule,
        BsDatepickerModule.forRoot(),
        TabsModule.forRoot(),
        MatTableModule,
        MatSortModule,
        MatInputModule,
        MatRadioModule,
        MatSelectModule,
        MatAutocompleteModule,
        OwlDateTimeModule,
        OwlNativeDateTimeModule,
        NzCascaderModule,
        MatTabsModule,
        NgSelectModule,
        MatPaginatorModule,
        MatProgressSpinnerModule
    ],
    providers: [{provide: NZ_I18N, useValue: en_US}, {provide: NZ_ICONS, useValue: icons}, BabyService],
    exports: [BabyDischargeEpisodesComponent]
})
export class BabyModule {
}
