import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Platform, NavController, ModalController } from '@ionic/angular';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { ConselingServiceService } from 'src/app/services/conseling-service.service';
import { Socket } from 'ng-socket-io';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment'
import { ServicesService } from 'src/app/user/services.service';
const MEDIA = environment.imageUrl;
// var peer = require('peerjs')

declare var apiRTC: any
@Component({
  selector: 'app-caller',
  templateUrl: './caller.page.html',
  styleUrls: ['./caller.page.scss'],
})


export class CallerPage implements OnInit {
  @ViewChild('videoContainer') videoContainer;
  @Input() conselor_id: any;
  @Input() dataPeer: any;
  @Input() ongoing: any = false;
  @Input() from: any;
  @Input() to: any;
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

  ringin = true;
  peer: any;

  micOff = false;
  volumeOff = false;
  private video: HTMLVideoElement;
  constructor(private platform: Platform, private androidPermissions: AndroidPermissions,
    private modalCtrl: ModalController, private socket: Socket, private api: ServicesService,
    public navCtrl: NavController,private nativeAudio: NativeAudio, private apiCoseling: ConselingServiceService) { 
    this.video = document.createElement('video');
    this.video.width = 640;
    this.video.height = 480;
    this.video.setAttribute('autoplay', '');
  }
  call: any;
  fromUser: any;
  toUser: any;
  ngOnInit() {
    // this.videoContainer.nativeElement.appendChild(this.video);
    console.log(this.dataPeer)
    let storeLocal = localStorage.getItem('_USER');
    let id = JSON.parse(storeLocal)._ID
    if(this.ongoing == false) {
      this.from = id
      this.to = this.conselor_id
    }
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
    this.peer = this.dataPeer
    if(this.ongoing == false) {
      this.tryCall()
    } else if(this.ongoing == true ) {
      this.conselor_id = this.from
    }
    this.getOngoing().subscribe((user: any) => {
      console.log(user.user.data)
      if(user.user.data.from == id && !this.ongoing) {
        this.onGoingCall()
      } else if(user.user.data.to == id && this.ongoing){
        this.receiveCall();
      }
    })
    this.receiveCall();
    this.getClosedCall().subscribe((user: any) => {
      if(user.user.data.to == id || user.user.data.from == id) {
          window.location.href="home/chat"
      }
    })
    
    // this.videoContainer.nativeElement.appendChild(this.video);
    // this.initWebRTC();
    
    // console.log(id)
    // this.peer = new Peer(id)
    // const conn = this.peer.connect(this.conselor_id);
    // console.log(conn)
    // conn.on('open', () => {
    //   conn.send('hi!');
    // });
    // this.makeCall(this.conselor_id)
    // this.InitializeApiRTC();
  }

  receiveCall() {
    // this.peer = this.dataPeer
    const constraints = {
      video: false,
      audio: true
    };
    var getUserMedia = navigator.mediaDevices.getUserMedia ;
    this.peer.on('call', (call: any) => {
      getUserMedia(constraints).then(stream => {
        call.answer(stream); // Answer the call with an A/V stream.
        call.on('stream', (remoteStream: any) => {
          // Show stream in some video/canvas element.
          (<any>window).stream = stream; // make stream available to browser console
          this.video.srcObject = stream;
          
        });
        call.on("close", () => {
          console.log("by")
        })
      })
    });
  }

  getClosedCall() {
    let observable = new Observable(obs => {
      this.socket.on('call-end', data => {
        obs.next(data)
      }) 
    })
    return observable;
  }
  
  tryCall() {
    let storeLocal = localStorage.getItem('_USER');
    let id = JSON.parse(storeLocal)._ID
    this.socket.emit('try-call', 
        {
          data: {
            to: this.conselor_id,
            from: id
          }
        })
  }

  setMic() {
    this.micOff = !this.micOff
  }

  setVolume() {
    this.volumeOff = !this.volumeOff
  }
  initWebRTC() {
    
    const constraints = {
      video: false,
      audio: false
    };

    const handleSuccess = (stream: MediaStream) => {
      (<any>window).stream = stream; // make stream available to browser console
      this.video.srcObject = stream;
      
    };

    const handleError = (error: any) => {
      const p = document.createElement('p');
      p.innerHTML = 'navigator.getUserMedia error: ' + error.name + ', ' + error.message;
      // this.videoContainer.nativeElement.appendChild(p);
    };

    navigator.mediaDevices.getUserMedia(constraints).then(handleSuccess).catch(handleError);
  }

  closeCall() {
    let storeLocal = localStorage.getItem('_USER');
    let id = JSON.parse(storeLocal)._ID
    this.socket.emit('end-call', 
        {
          data: {
            to: this.conselor_id,
            from: id
          }
        })
  }

  getOngoing() {
    let observable = new Observable(obs => {
      this.socket.on('call-connect', data => {
        obs.next(data)
      }) 
    })
    return observable;
  }
  onGoingCall() {
    const constraints = {
      video: false,
      audio: true
    };
    this.peer = this.dataPeer;
    var getUserMedia = navigator.getUserMedia;
    var getUserMediaD = navigator.mediaDevices.getUserMedia;
    getUserMediaD(constraints).then(stream => {
      var call = this.peer.call(this.conselor_id, stream);
      call.on('stream', (remoteStream: any) => {
        // Show stream in some video/canvas element.
        (<any>window).stream = stream; // make stream available to browser console
        this.video.srcObject = stream;
      });
      call.on("close", () => {
        console.log("by")
      })
    })
    // getUserMedia({video: false, audio: true}, (stream: any) => {
      
    // },(err) => {
    //   console.log('Failed to get local stream' ,err);
    // });
  }
  


  InitializeApiRTC() {
    //apiRTC initialization
    let storeLocal = localStorage.getItem('_USER');
    let id = JSON.parse(storeLocal)._ID
    let email = localStorage.getItem('_EMAIL');
    apiRTC.init({
      // userId: email,
      apiKey: "c83c92d8ec6bccd086e097ed028ea672",
      // token : id,
      // referer: "https://beckend-conseling.herokuapp.com/api/checkToken",
      // apiCCId : "2",
      onReady: (e) => {
        this.sessionReadyHandler(e);
      },
      
    });
  }

  sessionReadyHandler(e) {
    this.myCallId = apiRTC.session.apiCCId;
    this.InitializeControls();
    this.AddEventListeners();
    this.InitializeWebRTCClient();
  }

  InitializeWebRTCClient() {
    this.webRTCClient = apiRTC.session.createWebRTCClient({
      status: "status" //Optionnal
    });
    console.log(this.webRTCClient)
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

  InitializeControlsForHangup() {
    this.showCall = true;
    this.showAnswer = false;
    this.showReject = false;
    this.showHangup = false;
  }

  UpdateControlsOnAnswer() {
    this.showAnswer = false;
    this.showReject = false;
    this.showHangup = true;
    this.showCall = false;
  }

  UpdateControlsOnReject() {
    this.showAnswer = false;
    this.showReject = false;
    this.showHangup = false;
    this.showCall = true;
  }

  RemoveMediaElements(callId) {
    this.webRTCClient.removeElementFromDiv('mini', 'miniElt-' + callId);
    this.webRTCClient.removeElementFromDiv('remote', 'remoteElt-' + callId);
  }

  AddStreamInDiv(stream, callType, divId, mediaEltId, style, muted) {
    let mediaElt = null;
    let divElement = null;

    if (callType === 'audio') {
      mediaElt = document.createElement("audio");
    } else {
      mediaElt = document.createElement("video");
    }

    mediaElt.id = mediaEltId;
    mediaElt.autoplay = true;
    mediaElt.muted = muted;
    mediaElt.style.width = style.width;
    mediaElt.style.height = style.height;

    divElement = document.getElementById(divId);
    divElement.appendChild(mediaElt);

    this.webRTCClient.attachMediaStream(mediaElt, stream);
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

  MakeCall(calleeId) {
    // var callId = this.webRTCClient.call(calleeId);
    // if (callId != null) {
    //   this.incomingCallId = callId;
    //   this.showHangup = true;
    // }
    // apiRTC.addEventListener("remoteHangup", remoteHangupHandler);
    this.webRTCClient.call($("#388506").val());
  }

  HangUp() {
    this.webRTCClient.hangUp(this.incomingCallId);
  }

  AnswerCall(incomingCallId) {
    this.webRTCClient.acceptCall(incomingCallId);
    this.nativeAudio.stop('uniqueI1').then(()=>{},()=>{});

    this.UpdateControlsOnAnswer();
  }

  RejectCall(incomingCallId) {
    this.webRTCClient.refuseCall(incomingCallId);
    this.UpdateControlsOnReject();
    this.RemoveMediaElements(incomingCallId);
  }

}
