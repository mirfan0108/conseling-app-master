import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomChatPage } from './room-chat.page';

describe('RoomChatPage', () => {
  let component: RoomChatPage;
  let fixture: ComponentFixture<RoomChatPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoomChatPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomChatPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
