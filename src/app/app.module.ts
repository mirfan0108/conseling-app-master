import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { SocketIoModule, SocketIoConfig } from 'ng-socket-io';
import { CalendarModule } from 'ion2-calendar';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';

const config: SocketIoConfig = {url: 'https://beckend-conseling.herokuapp.com', options: {}};
// const config: SocketIoConfig = {url: 'http://localhost:8080', options: {}};

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    SocketIoModule.forRoot(config),
    AppRoutingModule,
    CalendarModule,
    HttpClientModule],
  providers: [
    StatusBar,
    SplashScreen,
    AndroidPermissions,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy, },
    LocalNotifications
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
