import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.page.html',
  styleUrls: ['./forget-password.page.scss'],
})
export class ForgetPasswordPage implements OnInit {
  formEmail = {
    email: ''
  }

  constructor(private router: Router) { }

  ngOnInit() {
  }

  navigateTo(page) {
    switch (page) {
      case 'login':
        this.router.navigateByUrl('login')
        break;
      
      default:
        break;
    }
  }

  doSend() {
    
  }


}
