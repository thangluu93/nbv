import {Injectable} from '@angular/core';
import {Observable} from 'rxjs'

@Injectable({
    providedIn: 'root'
})
export class FilterService {

    filteredWorkplaceOptions: Observable<string[]>;
    filteredPermissionOptions: Observable<string[]>;

    constructor() {

    }

    _filter(object, value = '', key) {
        if (value === '') {
            return object
        }
        const filterValue = value && (typeof value === 'string') ? value.toLocaleLowerCase() : '';

        return object.filter(option => {
            if (option[key] && option[key].toLocaleLowerCase().indexOf(filterValue) === 0) {
                return option[key]
            }
        });
    }

    removeDuplicatesBy(keyFn, array) {
        let mySet: Set<any> = new Set();
        return array.filter(x => {
            let key: any;
            let isNew: boolean;
            key = keyFn(x);
            isNew = !mySet.has(key);
            if (isNew) mySet.add(key);
            return isNew;
        });
    }

}
