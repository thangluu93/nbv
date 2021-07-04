import { TestBed } from '@angular/core/testing';

import { DischargeDataService } from './discharge-data.service';

describe('DischargeDataService', () => {
  let service: DischargeDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DischargeDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
