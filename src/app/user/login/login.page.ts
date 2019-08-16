import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { ServicesService } from '../services.service';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  logo: any;
  formLogin = {
    email: '',
    password: ''
  }
  loading = false;

  constructor(private formBuilder: FormBuilder, private api : ServicesService,
    private route: ActivatedRoute, private router: Router) {

   }

  ngOnInit() {
    this.logo = '../../../assets/images/logo-cons.png'
  }

  doLogin(){
    
    let timerInterval;
    Swal.fire({
      title: '<strong>Mohon Tunggu</strong>',
      text: 'Sedang dalam proses',
      timer: 3000,
      onBeforeOpen: () => {
        // this.doLogin()
        this.loading = true;
        Swal.showLoading();
        timerInterval = setInterval(() => {
        }, 3000)
      },
      onOpen: async () => {
        Swal.stopTimer();
        try {
          await this.api.login(this.formLogin).subscribe(async (res: any) => {
            let user = res[0];
            console.log(user)
            if(res.length > 0) {
              if (user._id) {
                if(user._id) {
                  await localStorage.setItem("_USER", JSON.stringify({_ID: user._id, role:user.role, status:user.status}));
                  await localStorage.setItem("_EMAIL", user.email)
                }
              } 
            } else {
              Swal.fire('Oops...', 'Password atau email tidak sesuai!', 'error')
              this.loading = false;
            }
          })
          
        } catch (error) {
          console.log(error)
        }
        
        Swal.resumeTimer();
      },
      onClose: () => {
        this.loading = false;
        if (localStorage.getItem("_USER")) {
          this.router.navigateByUrl('home')
        } 
        clearInterval(timerInterval)
      }
    })
  }

  navigateTo(page: 'signup' | 'forget') {
    switch (page) {
      case 'signup':
        this.router.navigateByUrl('register')
        break;
      case 'forget': 
        this.router.navigateByUrl('forget/change-password')
        break;
      default:
        break;
    }
  }

}
