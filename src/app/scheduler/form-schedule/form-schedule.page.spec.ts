import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormSchedulePage } from './form-schedule.page';

describe('FormSchedulePage', () => {
  let component: FormSchedulePage;
  let fixture: ComponentFixture<FormSchedulePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormSchedulePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormSchedulePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
