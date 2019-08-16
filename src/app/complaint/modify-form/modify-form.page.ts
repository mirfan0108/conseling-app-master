import { Component, OnInit } from '@angular/core';
import { CategoryService } from 'src/app/services/category.service';
import { ComplaintService } from 'src/app/services/complaint.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ServicesService } from 'src/app/user/services.service';
import { Socket } from 'ng-socket-io';

@Component({
  selector: 'app-modify-form',
  templateUrl: './modify-form.page.html',
  styleUrls: ['./modify-form.page.scss'],
})
export class ModifyFormPage implements OnInit {
  categories: any;
  labelCategory = "Pilih Kategori";
  formComplaint = {
    category_id: "",
    conselorId: "",
    created_on: "",
    note: "",
    patientId: "",
    status: 0,
    story: "",
    subyek: "",
    __v: 0,
    _id: ""
  }
  constructor(private apiCategory: CategoryService, private apiComplaint: ComplaintService, private router: Router,
    private userApi: ServicesService, private socket: Socket) { }

  ngOnInit() {
    let storeLocal = localStorage.getItem('_USER');
    let id = JSON.parse(storeLocal)._ID;
    this.apiCategory.getCategories()
    .subscribe((res: any) => {
      this.categories = res.data
      this.apiComplaint.getPatientComplaint(id).subscribe((res: any) => {
        this.formComplaint = res.data[0]
        console.log(this.formComplaint)
      })
    })
  }

  selectedCategory($event) {
    let id = $event.detail.value;
    this.categories.forEach(category => {
      if(id == category._id){
        this.formComplaint.category_id = category._id
        this.labelCategory = category.category
        this.formComplaint.subyek = category.information
      }
    });
  }

  doPost() {
    let storeLocal = localStorage.getItem('_USER');
    let id = JSON.parse(storeLocal)._ID;
    this.formComplaint.status = 2;
    let delay = 2000
    let timerInterval = null
    let Error;
    Swal.fire({
      title: '<strong>Mohon Tunggu</strong>',
      timer: delay,
      onBeforeOpen: () => {
        Swal.showLoading();
        timerInterval = setInterval(() => {
        }, 3000)
      },
      onOpen: async () => {
        Swal.stopTimer();
        await this.apiComplaint.updateComplaint(this.formComplaint)
        .subscribe(res => {
          if(!res) {
            Swal.fire({
              type: 'error',
              title: 'Oops...',
              text: "Maaf terjadi kesalahan pada server, silahkan coba beberapa saat lagi"
            })
          } else {
            Swal.fire({
              type: 'success',
              title: 'Berhasil',
              text: "Data anda telah berhasil di perbarui",
              onClose: () => {
                this.userApi.getUser(id).subscribe((res: any) => {
                  res.status = 0;
                  this.userApi.updateUser(res).subscribe(async (resp: any) => {
                    localStorage.removeItem('_USER')
                    let updated = JSON.parse(storeLocal)
                    updated.status = 0;
                    await localStorage.setItem('_USER', JSON.stringify(updated))
                    this.router.navigateByUrl('home')
                  })
                })
                this.socket.emit('patient-update')
                this.router.navigateByUrl('home')
              }
            })
            
          }
        })
        Swal.resumeTimer()
      },
      onClose: () => {
        clearInterval(timerInterval)
        this.router.navigateByUrl('home')
      }
    })
  }

}
