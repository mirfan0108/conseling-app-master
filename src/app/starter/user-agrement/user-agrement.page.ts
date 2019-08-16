import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { ServicesService } from 'src/app/user/services.service';

@Component({
  selector: 'app-user-agrement',
  templateUrl: './user-agrement.page.html',
  styleUrls: ['./user-agrement.page.scss'],
})
export class UserAgrementPage implements OnInit {

  constructor(private modalCtrl: ModalController, private router: Router, private userApi: ServicesService) { }

  ngOnInit() {
  }

  iAgree() {
    let storeLocal = localStorage.getItem('_USER');
    let id = JSON.parse(storeLocal)._ID;
    this.userApi.getUser(id).subscribe((res: any) => {
      res.status = 9;
      this.userApi.updateUser(res).subscribe(async (resp: any) => {
        localStorage.removeItem('_USER')
        let updated = JSON.parse(storeLocal)
        updated.status = 9;
        await localStorage.setItem('_USER', JSON.stringify(updated))
        // this.router.navigateByUrl('home')
        // this.modalCtrl.dismiss()
        window.location.href = "home"
      })
    })
    
  }

  openSwall() {
    Swal.fire({
      title: 'Anda Yakin ?',
      text: "Anda tidak dapat melanjutkan konseling jika tidak menyetujui informed consent",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'OK',
      cancelButtonText: 'KEMBALI',
    }).then(async (result) => {
      if (result.value) {
        await localStorage.clear()
        await this.modalCtrl.dismiss()
        // this.router.navigateByUrl('home')
      }
    })
  }

}
