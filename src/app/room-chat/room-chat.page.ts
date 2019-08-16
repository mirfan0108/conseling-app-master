import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { IonContent, ModalController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { ConselingServiceService } from '../services/conseling-service.service';
import { ServicesService } from '../user/services.service';
import { environment } from 'src/environments/environment'
import { Socket } from 'ng-socket-io';
import { Observable } from 'rxjs';
const MEDIA = environment.imageUrl;

@Component({
  selector: 'app-room-chat',
  templateUrl: './room-chat.page.html',
  styleUrls: ['./room-chat.page.scss'],
})
export class RoomChatPage implements OnInit {
  @ViewChild('IonContent') content: IonContent
  @Input() dataConseling: any;
  paramData: any;
  msgList: any = [];
  userName: any;
  user_input: string = "";
  User: string ;
  toUser: string ;
  start_typing: any;
  loader: boolean;
  profile: any
  constructor(public activRoute: ActivatedRoute, private modalCtrl: ModalController,
    private socket: Socket,
    private apiConseling: ConselingServiceService, private apiUser: ServicesService) {
    // this.activRoute.params.subscribe((params) => {
    //   console.log(params)
    //   this.paramData = params
    //   this.userName = params.name
    // });
    // this.msgList = [
    //   {
    //     userId: "HealthBot",
    //     userName: "HealthBot",
    //     userAvatar: "../../assets/chat/chat4.jpg",
    //     time: "12:00",
    //     message: "Hello, have you seen this great chat UI",
    //     id: 0
    //   },
    //   {
    //     userId: "Me",
    //     userName: "Me",
    //     userAvatar: "../../assets/chat/chat5.jpg",
    //     time: "12:03",
    //     message: "Yeah, I see this. This looks great. ",
    //     id: 1,
    //   },
    //   {
    //     userId: "HealthBot",
    //     userName: "HealthBot",
    //     userAvatar: "../../assets/chat/chat4.jpg",
    //     time: "12:05",
    //     message: "... and this is absolutely free, anyone can use",
    //     id: 3
    //   },
    //   {
    //     userId: "Me",
    //     userName: "Me",
    //     userAvatar: "../../assets/chat/chat5.jpg",
    //     time: "12:06",
    //     message: "wow ! that's great. Love to see more of such chat themes",
    //     id: 4
    //   },
    //   {
    //     userId: "HealthBot",
    //     userName: "HealthBot",
    //     userAvatar: "../../assets/chat/chat4.jpg",
    //     time: "12:07",
    //     message: "Oh there are several other designs. Check all their designs on their website enappd.com",
    //     id: 5
    //   }
    // ];
   }

  ngOnInit() {
    this.toUser = this.dataConseling.conselorId
    this.User = this.dataConseling.patientId
    console.log(this.dataConseling)
    this.apiUser.getProfile(this.dataConseling.patientId)
    .subscribe((respProfile: any) => {
      if(respProfile.data[0].avatar == "" || respProfile.data[0].avatar.data == null) {
        if(respProfile.data[0].gender == "men") {
          respProfile.data[0].avatar = "../../assets/images/men.jpg"
        } else {
          respProfile.data[0].avatar = "../../assets/images/women.jpg"
        }
      } else {
        respProfile.data[0].avatar = MEDIA+"/media/"+respProfile.data[0]._id;
      }
      this.profile = respProfile.data[0]
      this.fetchData()
    })
    this.getMessages()
    .subscribe((dataObs: any) => {
      // dataObs.data.userId = this.toUser,
      // dataObs.data.userName = this.dataConseling.profile_conselor.name
      // this.msgList.push(dataObs.data)
      this.msgList = []
      this.fetchData()
      // this.senderSends(dataObs)
    })
  }

  startVidCall(id) {
    this.modalCtrl.dismiss({state: "makeVidCall", to: id})
    console.log(id)
  }

  startCall(id) {
    this.modalCtrl.dismiss({state: "makeCall", to: id})
    console.log(id)
  }

  sendMsg() {
    let time = new Date()
    let tempTime = this.pad(time.getHours(),2)+":"+this.pad(time.getMinutes(),2)
    let formMsg = {
      complaint_id: this.dataConseling._id,
      user_id: this.dataConseling.conselorId,
      avatar: this.profile.avatar,
      name: this.dataConseling.profile_conselor.name,
      text: this.user_input,
      time: tempTime
    }
    if (this.user_input !== '') {
      this.apiConseling.sendChat(formMsg)
      .subscribe((resp: any) => {
        console.log(resp)
        this.socket.emit('add-message', 
        {
          data: {
            userId: this.User,
            userName: this.profile.name,
            userAvatar: this.profile.avatar,
            time: tempTime,
            message: resp.data.text,
            id: this.dataConseling._id
          }
        })
      })
      this.user_input = "";
      this.scrollDown()
      setTimeout(() => {
        // this.senderSends()
      }, 500);

    }
  }
  senderSends(data: any) {
    this.loader = true;
    console.log(data)
    setTimeout(() => {
      this.msgList.push({
        userId: this.User,
        userName: this.User,
        userAvatar: data.userAvatar,
        time: data.time,
        message: data.message
      });
      this.loader = false;
      this.scrollDown()
    }, 2000)
    this.scrollDown()
  }
  getMessages() {
    let observable = new Observable(obs => {
      this.socket.on('message', data => {
        obs.next(data)
      }) 
    })
    return observable;
  }
  scrollDown() {
    setTimeout(() => {
      this.content.scrollToBottom(50)
    }, 50);
  }

  userTyping(event: any) {
    console.log(event);
    this.start_typing = event.target.value;
    this.scrollDown()
  }

  closeModal() {
    this.modalCtrl.dismiss()
  }

  fetchData() {
    this.apiConseling.getChat(this.dataConseling._id)
    .subscribe((res: any) => {
      let temp;
      if(res.data.length > 0) {
        res.data.forEach(element => {
          temp = {
            userId: element.user_id,
            userName: element.name,
            userAvatar: element.avatar,
            time: element.time,
            message: element.text,
            id: element.complaint_id
          }
          this.msgList.push(temp)
        });
      }
    })
  }
  pad(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
  }
}
