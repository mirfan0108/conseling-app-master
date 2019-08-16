import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VidCallPage } from './vid-call.page';

describe('VidCallPage', () => {
  let component: VidCallPage;
  let fixture: ComponentFixture<VidCallPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VidCallPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VidCallPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
