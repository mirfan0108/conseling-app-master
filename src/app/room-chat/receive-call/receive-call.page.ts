import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { environment } from 'src/environments/environment'
import { ServicesService } from 'src/app/user/services.service';
const MEDIA = environment.imageUrl;

@Component({
  selector: 'app-receive-call',
  templateUrl: './receive-call.page.html',
  styleUrls: ['./receive-call.page.scss'],
})
export class ReceiveCallPage implements OnInit {
  @Input() from: any;
  @Input() to: any;

  fromUser: any;
  toUser: any;
  constructor(private modalCtrl: ModalController, private api: ServicesService) { }

  ngOnInit() {
    this.api.getProfile(this.from).subscribe((fromUser: any) => {
      if(fromUser.data[0].avatar == "" || fromUser.data[0].avatar.data == null) {
        if(fromUser.data[0].gender == "men") {
          fromUser.data[0].avatar = "../../assets/images/men.jpg"
        } else {
          fromUser.data[0].avatar = "../../assets/images/women.jpg"
        }
      } else {
        fromUser.data[0].avatar = MEDIA+"/media/"+fromUser.data[0]._id;
      }
      this.fromUser = fromUser.data[0]

      this.api.getProfile(this.to).subscribe((toUser: any) => {
        if(toUser.data[0].avatar == "" || toUser.data[0].avatar.data == null) {
          if(toUser.data[0].gender == "men") {
            toUser.data[0].avatar = "../../assets/images/men.jpg"
          } else {
            toUser.data[0].avatar = "../../assets/images/women.jpg"
          }
        } else {
          toUser.data[0].avatar = MEDIA+"/media/"+toUser.data[0]._id;
        }
        this.toUser = toUser.data[0]
      })
    })
  }

  answare() {
    this.modalCtrl.dismiss({state:"answare", to: this.to, from: this.from})
  }

  decline() {
    this.modalCtrl.dismiss({state:"close", to: this.to, from: this.from})
  }

}
