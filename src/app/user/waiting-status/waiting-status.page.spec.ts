import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WaitingStatusPage } from './waiting-status.page';

describe('WaitingStatusPage', () => {
  let component: WaitingStatusPage;
  let fixture: ComponentFixture<WaitingStatusPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WaitingStatusPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WaitingStatusPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
