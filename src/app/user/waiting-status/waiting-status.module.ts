import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { WaitingStatusPage } from './waiting-status.page';
import { UserAgrementPage } from 'src/app/starter/user-agrement/user-agrement.page';

const routes: Routes = [
  {
    path: '',
    component: WaitingStatusPage
  }
];

@NgModule({
  entryComponents: [
    UserAgrementPage
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [WaitingStatusPage, UserAgrementPage]
})
export class WaitingStatusPageModule {}
