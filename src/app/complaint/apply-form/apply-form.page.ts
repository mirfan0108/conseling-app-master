import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { CategoryService } from 'src/app/services/category.service';
import { ComplaintService } from 'src/app/services/complaint.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-apply-form',
  templateUrl: './apply-form.page.html',
  styleUrls: ['./apply-form.page.scss'],
})
export class ApplyFormPage implements OnInit {
  categories: any;
  labelCategory = "Pilih Kategori";
  formComplaint = {
    category: '',
    information: '',
    story: '',
  }
  constructor(private apiCategory: CategoryService, private apiComplaint: ComplaintService, private router: Router) { }

  ngOnInit() {
    this.apiCategory.getCategories()
    .subscribe((res: any) => {
      this.categories = res.data
    })
  }

  selectedCategory($event) {
    let id = $event.detail.value;
    this.categories.forEach(category => {
      if(id == category._id){
        this.formComplaint.category = category._id
        this.labelCategory = category.category,
        this.formComplaint.information = category.information
      }
    });
  }

  doPost() {
    let storeLocal = localStorage.getItem('_USER');
    let id = JSON.parse(storeLocal)._ID;
    let form = {
      category_id: this.formComplaint.category,
      subyek: this.formComplaint.information,
      story: this.formComplaint.story,
      patientId: id
    }
    let delay = 2000
    let timerInterval = null
    let Error;
    Swal.fire({
      title: '<strong>Mohon Tunggu</strong>',
      showConfirmButton: false,
      timer: delay,
      onBeforeOpen: () => {
        Swal.showLoading();
        timerInterval = setInterval(() => {
        }, 3000)
      },
      onOpen: async () => {
        Swal.stopTimer();
        await this.apiComplaint.postComplain(form)
        .subscribe(res => {
          console.log(res)
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
              text: "Terima Kasih Atas Pengaduannya, Konsultan Kami akan segera menghubungi anda",
              onClose: () => {
                this.router.navigateByUrl('home')
              }
            })
            
          }
        })
        Swal.resumeTimer()
      },
      onClose: () => {
        clearInterval(timerInterval)
        
      }
    })
    
    console.log(this.formComplaint)
  }
}
