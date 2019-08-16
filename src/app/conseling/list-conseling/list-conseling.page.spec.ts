import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListConselingPage } from './list-conseling.page';

describe('ListConselingPage', () => {
  let component: ListConselingPage;
  let fixture: ComponentFixture<ListConselingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListConselingPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListConselingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
