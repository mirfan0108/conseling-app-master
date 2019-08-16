import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { HomePage } from './home.page';
import { ConselingScheduleDirective } from '../directives/conseling-schedule.directive';
import { ConselingSchedulePage } from '../scheduler/conseling-schedule/conseling-schedule.page';
import { ListConselingDirective } from '../directives/list-conseling.directive';
import { ListConselingPage } from '../conseling/list-conseling/list-conseling.page';
import { RoomChatPage } from '../room-chat/room-chat.page';
import { LogoutPage } from '../user/logout/logout.page';
import { FormSchedulePage } from '../scheduler/form-schedule/form-schedule.page';
import { CalendarModule } from 'ion2-calendar';
import { ResultConselingPage } from '../conseling/result-conseling/result-conseling.page';
import { CallerPage } from '../room-chat/caller/caller.page';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { ReceiveCallPage } from '../room-chat/receive-call/receive-call.page';
import { VidCallPage } from '../room-chat/vid-call/vid-call.page';
// import { CalendarModule } from 'ion2-calendar';
@NgModule({
  entryComponents: [
    ConselingSchedulePage,
    ListConselingPage,
    RoomChatPage,
    LogoutPage,
    FormSchedulePage,
    ResultConselingPage,
    CallerPage,
    ReceiveCallPage,
    VidCallPage,
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CalendarModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomePage
      }
    ])
  ],
  providers: [
    NativeAudio
  ],
  declarations: [
    HomePage, 
    ConselingScheduleDirective,
    ListConselingDirective,
    ListConselingPage,
    RoomChatPage,
    LogoutPage,
    ConselingSchedulePage,
    FormSchedulePage,
    ResultConselingPage,
    CallerPage,
    ReceiveCallPage,
    VidCallPage
  ]
})
export class HomePageModule {}
