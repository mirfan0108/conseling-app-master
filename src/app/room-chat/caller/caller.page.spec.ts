import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CallerPage } from './caller.page';

describe('CallerPage', () => {
  let component: CallerPage;
  let fixture: ComponentFixture<CallerPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CallerPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CallerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
