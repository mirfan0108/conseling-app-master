import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplyFormPage } from './apply-form.page';

describe('ApplyFormPage', () => {
  let component: ApplyFormPage;
  let fixture: ComponentFixture<ApplyFormPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplyFormPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplyFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
