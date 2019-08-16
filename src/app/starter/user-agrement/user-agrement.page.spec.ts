import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAgrementPage } from './user-agrement.page';

describe('UserAgrementPage', () => {
  let component: UserAgrementPage;
  let fixture: ComponentFixture<UserAgrementPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserAgrementPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserAgrementPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
