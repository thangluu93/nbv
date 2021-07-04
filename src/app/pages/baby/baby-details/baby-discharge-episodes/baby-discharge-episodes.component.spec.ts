import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BabyDischargeEpisodesComponent } from './baby-discharge-episodes.component';

describe('BabyDischargeEpisodesComponent', () => {
  let component: BabyDischargeEpisodesComponent;
  let fixture: ComponentFixture<BabyDischargeEpisodesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BabyDischargeEpisodesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BabyDischargeEpisodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
