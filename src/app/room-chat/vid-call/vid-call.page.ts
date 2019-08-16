import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { NavController } from '@ionic/angular';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { Socket } from 'ng-socket-io';
import { Observable } from 'rxjs';

declare var apiRTC: any
@Component({
  selector: 'app-vid-call',
  templateUrl: './vid-call.page.html',
  styleUrls: ['./vid-call.page.scss'],
})
export class VidCallPage implements OnInit {
  @ViewChild('videoContainer') videoContainer;
  @Input() peer: any;
  @Input() from: any;
  @Input() to: any;
  @Input() ongoing: any = false;
  @Input() incomingCall: any = false;
  @Input() apiRTC: any;

  //initial other
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
  userAgent: any;
  private video: HTMLVideoElement;
  constructor(public navCtrl: NavController,private nativeAudio: NativeAudio, private socket: Socket) { }

  ngOnInit() {
    this.video = document.createElement('video');
    this.video.width = 640;
    this.video.height = 480;
    this.video.setAttribute('autoplay', '');
    this.videoContainer.nativeElement.appendChild(this.video);
    this.initWebRTC();
    if(this.ongoing == false) {
      this.tryCall()
    }
    this.getOngoing().subscribe((user: any) => {
      if(user.user.data.to == this.to || user.user.data.from == this.from) {
        // this.openCaller(user.user.data)
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
    })
    this.getEndVidcall().subscribe((user: any) => {
      if(user.user.data.to == this.to || user.user.data.from == this.from) {
        window.location.href = "home/chat"
      }
    })
    // this.InitializeApiRTC()
    // this.nativeAudio.preloadComplex('uniqueI1', '../../assets/tone.mp3', 1, 1, 0).then((succ)=>{
    //   console.log("suu",succ)
    // }, (err)=>{
    //   console.log("err",err)
    // });

  }

  getOngoing() {
    let observable = new Observable(obs => {
      this.socket.on('vidcall-connect', data => {
        obs.next(data)
      }) 
    })
    return observable;
  }

  tryCall() {
    
    // this.initWebRTC();
    let storeLocal = localStorage.getItem('_USER');
    let id = JSON.parse(storeLocal)._ID
    this.socket.emit('try-vidcall', 
        {
          data: {
            to: this.to,
            from: this.from
          }
        })
        const constraints = {
      video: false,
      audio: true
    };
    this.peer = this.peer;
    console.log(this.to)
    var getUserMedia = navigator.getUserMedia;
    var getUserMediaD = navigator.mediaDevices.getUserMedia;
    getUserMediaD(constraints).then(stream => {
      var call = this.peer.call(this.to, stream);
      call.on('stream', (remoteStream: any) => {
        // Show stream in some video/canvas element.
        (<any>window).stream = stream; // make stream available to browser console
        this.video.srcObject = stream;
        this.video.play()
      });
      call.on("close", () => {
        console.log("by")
      })
    })
    
  }

  initWebRTC() {
    
    const constraints = {
      video: true,
      audio: true
    };

    const handleSuccess = (stream: MediaStream) => {
      (<any>window).stream = stream; // make stream available to browser console
      this.video.srcObject = stream;
      
    };

    const handleError = (error: any) => {
      const p = document.createElement('p');
      p.innerHTML = 'navigator.getUserMedia error: ' + error.name + ', ' + error.message;
      this.videoContainer.nativeElement.appendChild(p);
    };

    navigator.mediaDevices.getUserMedia(constraints).then(handleSuccess).catch(handleError);
  }

  getEndVidcall() {
    let observable = new Observable(obs => {
      this.socket.on('vidcall-end', data => {
        obs.next(data)
      }) 
    })
    return observable;
  }

  InitializeApiRTC() {
    //apiRTC initialization
    apiRTC.init({
      apiKey: "c83c92d8ec6bccd086e097ed028ea672",
      // apiCCId : "2",
      onReady: (e) => {
        this.sessionReadyHandler(e);
      }
    });
    console.log(apiRTC)
    this.myCallId = apiRTC.session.apiCCId;
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

  endCall() {
    this.socket.emit('end-vidcall', 
              {
                data: {
                  to: this.to,
                  from: this.from
                }
              })
    window.location.href = "home/chat";
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
    var callId = this.webRTCClient.call(calleeId);
    if (callId != null) {
      this.incomingCallId = callId;
      this.showHangup = true;
    }
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
