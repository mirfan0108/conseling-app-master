import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.page.html',
  styleUrls: ['./logout.page.scss'],
})
export class LogoutPage implements OnInit {

  constructor(private modalCtrl: ModalController, private router: Router) { }

  ngOnInit() {
  }

  cancelLogout(){
    this.modalCtrl.dismiss()
  }

  async doLogout(){
    await localStorage.clear();
    this.router.navigateByUrl('login');
    this.modalCtrl.dismiss()
  }

}
