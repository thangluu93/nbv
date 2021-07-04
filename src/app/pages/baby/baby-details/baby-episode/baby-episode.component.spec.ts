import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BabyEpisodeComponent } from './baby-episode.component';

describe('BabyEpisodeComponent', () => {
  let component: BabyEpisodeComponent;
  let fixture: ComponentFixture<BabyEpisodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BabyEpisodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BabyEpisodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
