import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar
  ) {

    this.initializeApp();
  }
  peer: any;
  initializeApp() {
    // let storeLocal = localStorage.getItem('_USER');
    // let id = JSON.parse(storeLocal)._ID
    // console.log(id)
    // this.peer = new Peer(id)
    // console.log(this.peer)
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
    // this.peer.on('call', (call) => {
    //   console.log("calling")
    // });
    
  }
}
