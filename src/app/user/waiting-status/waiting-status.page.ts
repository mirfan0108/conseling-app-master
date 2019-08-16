import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Socket } from 'ng-socket-io';
import { Observable } from 'rxjs';
import { Platform, AlertController, ModalController } from '@ionic/angular';
import { LocalNotifications, ELocalNotificationTriggerUnit, ILocalNotificationActionType, ILocalNotification  } from '@ionic-native/local-notifications/ngx';
import { UserAgrementPage } from 'src/app/starter/user-agrement/user-agrement.page';
import { ServicesService } from '../services.service';

@Component({
  selector: 'app-waiting-status',
  templateUrl: './waiting-status.page.html',
  styleUrls: ['./waiting-status.page.scss'],
})
export class WaitingStatusPage implements OnInit {

  constructor(private router: Router, private socket: Socket, private plt: Platform, private modalCtrl: ModalController,
    private localNotifications: LocalNotifications, private alertCtrl: AlertController, private userApi: ServicesService ) { 
      this.plt.ready().then(() => {
        this.localNotifications.on('click').subscribe(res => {
          let msg = res.data ? res.data.mydata : '';
          this.showAlert(res.title, res.text, msg);
        });
   
        this.localNotifications.on('trigger').subscribe(res => {
          let msg = res.data ? res.data.mydata : '';
          this.showAlert(res.title, res.text, msg);
        });
      });
    }

  ngOnInit() {
    let storeLocal = localStorage.getItem('_USER');
    console.log(JSON.parse(storeLocal).status )
    if(JSON.parse(storeLocal).status == 8) {
      this.informed()
    }

    this.getUpdate().subscribe((res: any) => {
      // console.log(res)
      let updated = JSON.parse(storeLocal)
      if(res.user == updated._ID) {
        localStorage.removeItem('_USER')
        updated.status = res.status;
        localStorage.setItem('_USER', JSON.stringify(updated))
        if(res.status == 1) {
          this.localNotifications.schedule({
            id: 1,
            title: 'Pemberitahuan!',
            text: 'Data Pengajuan Anda Ditolak',
            data: { mydata: 'My hidden message this is' },
            trigger: { in: 1, unit: ELocalNotificationTriggerUnit.SECOND },
          });
          this.router.navigateByUrl('modify-profile')
        } else if(res.status == 2) {
          this.localNotifications.schedule({
            id: 1,
            title: 'Pemberitahuan!',
            text: 'Data Pengajuan Anda Ditolak',
            data: { mydata: 'My hidden message this is' },
            trigger: { in: 1, unit: ELocalNotificationTriggerUnit.SECOND },
          });
          this.router.navigateByUrl('modify-form')
        } else if(res.status == 3) {
          this.localNotifications.schedule({
            id: 1,
            title: 'Pemberitahuan!',
            text: 'Data Pengajuan Anda Ditolak',
            data: { mydata: 'My hidden message this is' },
            trigger: { in: 1, unit: ELocalNotificationTriggerUnit.SECOND },
          });
          this.router.navigateByUrl('modify-profile')
        } else if(res.status == 9) {
          let storeLocal = localStorage.getItem('_USER');
          let id = JSON.parse(storeLocal)._ID;
          this.userApi.getUser(id).subscribe((res: any) => {
            res.status = 0;
            this.userApi.updateUser(res).subscribe(async (resp: any) => {
              localStorage.removeItem('_USER')
              let updated = JSON.parse(storeLocal)
              updated.status = 8;
              await localStorage.setItem('_USER', JSON.stringify(updated))
              // this.router.navigateByUrl('home')
              // this.modalCtrl.dismiss()
            })
          })
          this.localNotifications.schedule({
            id: 1,
            title: 'Pemberitahuan!',
            text: 'Data Pengajuan Telah Diterima',
            data: { mydata: 'My hidden message this is' },
            trigger: { in: 1, unit: ELocalNotificationTriggerUnit.SECOND },
          });
          this.informed()
        }
      }
    })
    this.getMessages().subscribe((msg: any) => {
      console.log(msg)
    })
  }

  getUpdate(){
    let observable = new Observable(obs => {
      this.socket.on('status-changed', data => {
        obs.next(data)
      }) 
    })
    return observable;
  }

  getMessages() {
    let observable = new Observable(obs => {
      this.socket.on('message', data => {
        obs.next(data)
      }) 
    })
    return observable;
  }
  showAlert(header, sub, msg) {
    this.alertCtrl.create({
      header: header,
      subHeader: sub,
      message: msg,
      buttons: ['Ok']
    }).then(alert => alert.present());
  }

  async informed() {
    const modal = await this.modalCtrl.create({
      component: UserAgrementPage
    });
    modal.onDidDismiss().then(res => {
      this.router.navigateByUrl('home')
    })
    return await modal.present();
  }

  logout() {
    localStorage.clear()
    this.router.navigateByUrl('home')
  }
}
