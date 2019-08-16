import { Component, ViewChild, OnInit, ComponentFactoryResolver, ViewContainerRef } from '@angular/core';
import { ConselingScheduleDirective } from '../directives/conseling-schedule.directive';
import { ConselingSchedulePage } from '../scheduler/conseling-schedule/conseling-schedule.page';
import { ListConselingDirective } from '../directives/list-conseling.directive';
import { ListConselingPage } from '../conseling/list-conseling/list-conseling.page';
import { ModalController } from '@ionic/angular';
import { RoomChatPage } from '../room-chat/room-chat.page';
import { LogoutPage } from '../user/logout/logout.page';
import { ComplaintService } from '../services/complaint.service';
import { ServicesService } from '../user/services.service';
import { ConselingServiceService } from '../services/conseling-service.service';
import { environment } from 'src/environments/environment'
import { CategoryService } from '../services/category.service';
import { Socket } from 'ng-socket-io';
import { Observable } from 'rxjs';
import { FormSchedulePage } from '../scheduler/form-schedule/form-schedule.page';
import { CallerPage } from '../room-chat/caller/caller.page';
import { ReceiveCallPage } from '../room-chat/receive-call/receive-call.page';
import { VidCallPage } from '../room-chat/vid-call/vid-call.page';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { ActivatedRoute } from '@angular/router';
const MEDIA = environment.imageUrl;
declare var Peer: any;
declare var apiRTC: any

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{
  @ViewChild(ConselingScheduleDirective) conselingScheduleDirective: ConselingScheduleDirective;
  @ViewChild(ListConselingDirective) listConselingDirective: ListConselingDirective;

  segmentValue = "conseling";
  dataComplaint: any;
  dataConseling = []
  categories = [];
  peer: any;

  showCall: boolean;
  showHangup: boolean;
  showAnswer: boolean;
  showReject: boolean;
  showStatus: boolean;
  showRemoteVideo: boolean = true;
  showMyVideo: boolean = true;

  session;
  webRTCClient;
  incomingCallId = 0;
  myCallId;
  status;
  calleeId;

  constructor(private componentFactoryResolver: ComponentFactoryResolver,
    private socket: Socket, private nativeAudio: NativeAudio, private activatedRoute: ActivatedRoute,
              private apiComplaint: ComplaintService, private apiUser: ServicesService,
              private apiConseling: ConselingServiceService, private apiCategories: CategoryService,
              private viewContainerRef: ViewContainerRef, private modalCtrl: ModalController) {
                
              }
              
  ngOnInit() {
    
    this.InitializeApiRTC();
    this.nativeAudio.preloadComplex('uniqueI1', '../../assets/tone.mp3', 1, 1, 0).then((succ)=>{
      console.log("suu",succ)
    }, (err)=>{
      console.log("err",err)
    });
    let storeLocal = localStorage.getItem('_USER');
    let id = JSON.parse(storeLocal)._ID
    
    this.statusActive()
    this.incomingCall().subscribe((userData: any) => {
      console.log(userData)
      if(userData.user.data.to == id) {
        this.openReceiveCall(userData.user.data)
      }
    })
    this.incomingVidCall().subscribe((userData: any) => {
      console.log("Vidcallan")
      if(userData.user.data.to == id) {
        this.openVidCallInComing(userData.user.data)
        // this.openReceiveCall(userData.user.data)
      }
    })


    this.getOngoing().subscribe((user: any) => {
      console.log(user.user.data)
      if(user.user.data.to == id || user.user.data.from == id) {
        this.openCaller(user.user.data)
      }
    })
    this.apiCategories.getCategories()
      .subscribe((res: any) => {
        console.log(res.data)
        this.categories = res.data
      })
    this.apiComplaint.getPatientComplaint(id)
    .subscribe((complaint: any) => {
      this.peer = new Peer(id)
      console.log(this.peer)
      this.peer.on('connection', (conn) => {
        conn.on('data', (data) => {
          // Will print 'hi!'
          console.log(data);
        });
        conn.on("call", (data) => {
          console.log("call")
        })
      });
      console.log(complaint)
      this.apiUser.getProfile(complaint.data[0].conselorId)
      .subscribe((conselor: any) => {
        console.log(conselor)
        
        if(conselor.data[0].avatar == "") {
          if(conselor.data[0].gender == "men") {
            conselor.data[0].avatar = "../../assets/images/men.jpg"
          } else {
            conselor.data[0].avatar = "../../assets/images/women.jpg"
          }
        } else {
          conselor.data[0].avatar = MEDIA+"/media/"+conselor.data[0]._id;
        }
        this.dataComplaint.profile_conselor = conselor.data[0]
      })
      this.apiConseling.getPatientConseling(id)
      .subscribe((res: any) => {
          res.data.forEach(element => {
            this.apiConseling.getScheduleConseling(element._id)
            .subscribe((resSchedule: any) => {
              element.schedule = resSchedule.data[0]
            })
            this.apiUser.getProfile(element.conselorId)
            .subscribe((responseProfile:any) => {
              // console.log(responseProfile.data[0])
              if(responseProfile.data[0].avatar == "") {
                if(responseProfile.data[0].gender == "men") {
                  responseProfile.data[0].avatar = "../../assets/images/men.jpg"
                } else {
                  responseProfile.data[0].avatar = "../../assets/images/women.jpg"
                }
              } else {
                responseProfile.data[0].avatar = MEDIA+"/media/"+responseProfile.data[0]._id;
              }
              element.profile = responseProfile.data[0]
            })
            this.apiUser.getProfile(element.complaint_id)
            .subscribe((respComplaint: any) => {
              console.log(respComplaint.data)
              this.categories.forEach(category => {
                if(respComplaint.data.category_id == category._id) {
                  element.category = category
                }
              });
            })
            this.dataConseling.push(element)
          });
        console.log(res)
        if(this.segmentValue == 'conseling') {
          this.loadCoselingList(this.dataConseling)
        }
      })
      this.dataComplaint = complaint.data[0]


      this.getActiveUser().subscribe((dataObs: any) => {
        if(dataObs.user == this.dataComplaint.conselorId && dataObs.event == "joined") {
          this.apiConseling.statusConselor = 1
        } else if(dataObs.user == this.dataComplaint.conselorId && dataObs.event == "left"){
          this.apiConseling.statusConselor = 0
        }
      })
      if(this.activatedRoute.snapshot.paramMap.get('slug') == "chat") {
        this.segmentValue = 'chat'
        this.chatRoom('tes');
      }
    })
   
  }

  incomingCall() {
    let observable = new Observable(obs => {
      this.socket.on('call-connecting', data => {
        obs.next(data)
      }) 
    })
    return observable;
  }

  incomingVidCall() {
    let observable = new Observable(obs => {
      this.socket.on('vidcall-connecting', data => {
        obs.next(data)
      }) 
    })
    return observable;
  }
  getOngoing() {
    let observable = new Observable(obs => {
      this.socket.on('call-connect', data => {
        obs.next(data)
      }) 
    })
    return observable;
  }
  async openCaller(user) {
    const modal = await this.modalCtrl.create({
      component: CallerPage,
      componentProps: {
        dataPeer: this.peer,
        ongoing: true,
        from: user.from,
        to: user.to
      }
    });

    return await modal.present();
  }
  async openReceiveCall(user) {
    console.log(user)
    const modal = await this.modalCtrl.create({
      component: ReceiveCallPage,
      componentProps: {
        from: user.from,
        to: user.to
      }
    });
    modal.onDidDismiss().then(res => {
      console.log(res.data)
      
      switch (res.data.state) {
        case "answare":
          this.socket.emit('start-call', 
              {
                data: {
                  to: res.data.to,
                  from: res.data.from
                }
              })
          
          break;
        case "close":
          this.socket.emit('end-call', 
              {
                data: {
                  to: res.data.to,
                  from: res.data.from
                }
              })
          break;
        default:
          break;
      }
      
      
    })
    return await modal.present();
  }
  

  segmentChanged($event) {
    this.segmentValue = $event.detail.value;
    if($event.detail.value == 'schedule'){
      let dataComp;
      console.log(this.dataConseling)
      this.loadCoselingSchedule(this.dataComplaint, this.dataConseling)
    } else if($event.detail.value == 'conseling') {
      this.loadCoselingList(this.dataConseling)
    } else if($event.detail.value == 'chat') {
      this.chatRoom('tes')
    }
  }

  loadCoselingSchedule(elementData, scheduler): void {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(ConselingSchedulePage);
    const viewContainerRef = this.conselingScheduleDirective.viewContainerRef;
    viewContainerRef.clear();
    const componentRef = viewContainerRef.createComponent(componentFactory);
    const conselingSchedule = (<ConselingSchedulePage>componentRef.instance);
    conselingSchedule.scheduler = scheduler;
    conselingSchedule.dataComplaint = elementData
  }

  loadCoselingList(elementData): void {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(ListConselingPage);
    const viewContainerRef = this.listConselingDirective.viewContainerRef;
    viewContainerRef.clear();
    const componentRef = viewContainerRef.createComponent(componentFactory);
    const conselingSchedule = (<ListConselingPage>componentRef.instance);
    conselingSchedule.conseling = elementData;
  }

  openChat() {
    this.chatRoom("tes")
  }

  async chatRoom(data: any) {
    
    const modal = await this.modalCtrl.create({
      component: RoomChatPage,
      componentProps: {
        dataConseling: this.dataComplaint
      }
    });
    modal.onDidDismiss().then((res: any) => {
      // this.segmentValue = "schedule";
      if(res.data) {
        switch (res.data.state) {
          case "makeCall":
            this.makeCall(res.data.to)
            break;
          case "makeVidCall":
            this.makeVidCall(res.data.to, this.peer)
            break;
          default:
            break;
        }
      } else {
        window.location.href = "home"
        this.segmentValue = "schedule";
      }
      console.log(res)
    })
    return await modal.present();
  }

  async makeCall(id) {
    
    this.openCall(id, this.peer)
    // var getUserMedia = navigator.getUserMedia;
    // getUserMedia({video: false, audio: true}, (stream: any) => {
    //   var call = this.peer.call(id, stream);
    //   call.on('stream', (remoteStream: any) => {
    //     // Show stream in some video/canvas element.
    //   call.on("close", () => {
    //     console.log("by")
    //   })
    //   });
    // },(err) => {
    //   console.log('Failed to get local stream' ,err);
    // });
  }

  async openVidCallInComing(user) {
    console.log(user)
    const modal = await this.modalCtrl.create({
      component: VidCallPage,
      componentProps: {
        from: user.from,
        to: user.to,
        peer: this.peer,
        incomingCall: true,
        ongoing: true
      }
    });
    return await modal.present();
  }

  async makeVidCall(id, peer) {
    let storeLocal = localStorage.getItem('_USER');
    let me = JSON.parse(storeLocal)._ID
    const modal = await this.modalCtrl.create({
      component: VidCallPage,
      componentProps: {
        to: id,
        from: me,
        peer: peer,
        ongoing: false
      }
    });
    modal.onDidDismiss().then((res: any) => {
      
    })
    return await modal.present();
  }

  async openCall(id, peer) {
    const modal = await this.modalCtrl.create({
      component: CallerPage,
      componentProps: {
        conselor_id: id,
        to: id,
        dataPeer: peer,
        ongoing: false
      }
    });
    modal.onDidDismiss().then((res: any) => {
      
    })
    return await modal.present();
  }

  async logoutConfirm() {
    const modal = await this.modalCtrl.create({
      component: LogoutPage
    });
    modal.onDidDismiss().then((res: any) => {
      this.segmentValue = "schedule";
    })
    return await modal.present();
  }

  // async openModal() {
  //   const modal = await this.modalCtrl.create({
  //     component: FormSchedulePage,
  //     componentProps: {
  //       detail: this.dataComplaint
  //     }
  //   });
  //   return await modal.present();
  // }

  statusActive() {
    let storeLocal = localStorage.getItem('_USER');
    let id = JSON.parse(storeLocal)._ID
    this.socket.emit('set-nickname', id)
    setTimeout(() => {
      this.statusActive()
    }, 3000)
  }
  getActiveUser() {
    let observable = new Observable(obs => {
      this.socket.on('users-changed', data => {
        obs.next(data)
      }) 
    })
    return observable;
  }

  ionViewDidLeave() {
    this.socket.emit('disconnect')
  }

  async openModal() {
    let data;
    this.dataConseling.forEach(item => {
      if(item.status == 0) {
        data = item;
      }
    })
    console.log(this.dataComplaint)
    const modal = await this.modalCtrl.create({
      component: FormSchedulePage,
      componentProps: {
        detail: this.dataComplaint,
        scheduler: data
      }
    });
    modal.onDidDismiss().then(() => {
      window.location.href = "home"
    })
    return await modal.present();
  }


  //api RTC 
  InitializeApiRTC() {
    let storeLocal = localStorage.getItem('_USER');
    let id = JSON.parse(storeLocal)._ID
    apiRTC.init({
      apiKey: "c83c92d8ec6bccd086e097ed028ea672",
      // apiCCId : id,
      onReady: (e) => {
        this.sessionReadyHandler(e);
      }
    });
    console.log(apiRTC)
  }

  sessionReadyHandler(e) {
    this.myCallId = apiRTC.session.apiCCId;
    this.InitializeControls();
    this.AddEventListeners();
    this.InitializeWebRTCClient();
    console.log(this.myCallId)
  }
  InitializeWebRTCClient() {
    this.webRTCClient = apiRTC.session.createWebRTCClient({
      status: "status" //Optionnal
    });
    /*    this.webRTCClient.setAllowMultipleCalls(true);
        this.webRTCClient.setVideoBandwidth(300);
        this.webRTCClient.setUserAcceptOnIncomingCall(true);*/
  }
  InitializeControls() {
    this.showCall = true;
    this.showAnswer = false;
    this.showHangup = false;
    this.showReject = false;
  }
  InitializeControlsForIncomingCall() {
    this.showCall = false;
    this.showAnswer = true;
    this.showReject = true;
    this.showHangup = true;
    this.nativeAudio.loop('uniqueI1').then((succ)=>{
      console.log("succ",succ)
    }, (err)=>{
      console.log("err",err)
    });

  }

  AddEventListeners() {
    apiRTC.addEventListener("userMediaSuccess", (e) => {
      this.showStatus = true;
      this.showMyVideo = true;

      this.webRTCClient.addStreamInDiv(e.detail.stream, e.detail.callType, "mini", 'miniElt-' + e.detail.callId, {
        width: "128px",
        height: "96px"
      }, true);

    });

    apiRTC.addEventListener("userMediaError", (e) => {
      this.InitializeControlsForHangup();

      this.status = this.status + "<br/> The following error has occurred <br/> " + e;
    });

    apiRTC.addEventListener("incomingCall", (e) => {
      this.InitializeControlsForIncomingCall();
      this.incomingCallId = e.detail.callId;
    });

    apiRTC.addEventListener("hangup", (e) => {
      if (e.detail.lastEstablishedCall === true) {
        this.InitializeControlsForHangup();
      }
      this.status = this.status + "<br/> The call has been hunged up due to the following reasons <br/> " + e.detail.reason;
      this.RemoveMediaElements(e.detail.callId);
    });

    apiRTC.addEventListener("remoteStreamAdded", (e) => {
      this.webRTCClient.addStreamInDiv(e.detail.stream, e.detail.callType, "remote", 'remoteElt-' + e.detail.callId, {
        width: "300px",
        height: "225px"
      }, false);
    });

    apiRTC.addEventListener("webRTCClientCreated", (e) => {
      console.log("webRTC Client Created");
      this.webRTCClient.setAllowMultipleCalls(true);
      this.webRTCClient.setVideoBandwidth(300);
      this.webRTCClient.setUserAcceptOnIncomingCall(true);

      /*      this.InitializeControls();
            this.AddEventListeners();*/

      //this.MakeCall("729278");
    });

  }
  InitializeControlsForHangup() {
    this.showCall = true;
    this.showAnswer = false;
    this.showReject = false;
    this.showHangup = false;
  }
  RemoveMediaElements(callId) {
    this.webRTCClient.removeElementFromDiv('mini', 'miniElt-' + callId);
    this.webRTCClient.removeElementFromDiv('remote', 'remoteElt-' + callId);
  }

}
