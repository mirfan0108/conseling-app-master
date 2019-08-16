import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormSchedulePage } from '../form-schedule/form-schedule.page';
import { ConselingServiceService } from 'src/app/services/conseling-service.service';

@Component({
  selector: 'app-conseling-schedule',
  templateUrl: './conseling-schedule.page.html',
  styleUrls: ['./conseling-schedule.page.scss'],
})
export class ConselingSchedulePage implements OnInit {
  @Input() scheduler: any;
  @Input() dataComplaint: any;
  mon: string;
  day: string;
  year: any;
  methode = "";
  reset: any;
  constructor(private modalCtrl: ModalController, private api: ConselingServiceService) { }
  slideOpts : {
    slidesPerView: 2
  }
  ngOnInit() {
    console.log(this.dataComplaint)
    console.log(this.scheduler)
    let storeLocal = localStorage.getItem('_USER');
    let id = JSON.parse(storeLocal)._ID;
    this.scheduler.forEach(sc => {
      if(sc.complaint_id == this.dataComplaint._id) {
        this.methode = sc.methode;
      }
    });
    this.scheduler = this.reset;
    this.api.getPatientSchedule(id).subscribe((res: any) => {
      console.log(res)
      res.data.forEach(sch => {
        if(sch.status == 0) {
          this.scheduler = sch
          this.dateTxt(this.scheduler.date)
        }
      });
      
      
    })
  }
  
  async openModal() {
    console.log(this.dataComplaint)
    const modal = await this.modalCtrl.create({
      component: FormSchedulePage,
      componentProps: {
        detail: this.dataComplaint
      }
    });
    modal.onDidDismiss().then(() => {
      window.location.href = "home"
    })
    return await modal.present();
  }

  dateTxt(data) {
    let dtDate: Date;
    dtDate = new Date(data)
    this.getDay(dtDate.getDay())
    this.year = dtDate.getFullYear();
    switch (dtDate.getMonth()) {
      case 0:
        this.mon = "Januari"
        break;
      case 1:
        this.mon = "Februari"
        break;
      case 2:
        this.mon = "Maret"
        break;
      case 3:
        this.mon = "April"
        break;
      case 4:
        this.mon = "Mei"
        break;
      case 5:
        this.mon = "Juni"
        break;
      case 6:
        this.mon = "Juli"
        break;
      case 7:
        this.mon = "Agustus"
        break;
      case 8:
        this.mon = "September"
        break;
      case 9:
        this.mon = "Oktober"
        break;
      case 10:
        this.mon = "November"
        break;
      case 11:
        this.mon = "Desember"
        break;
      default:
        break;
    }
  }

  getDay(day) {
    switch (day) {
      case 1:
        this.day = "Senin"
        break;
      case 2:
        this.day = "Selasa"
        break;
      case 3:
        this.day = "Rabu"
        break;
      case 4:
        this.day = "Kamis"
        break;
      case 5:
        this.day = "Jumat"
        break;
      case 6:
        this.day = "Sabtu"
        break;
      case 7:
        this.day = "Minggu"
        break;
      default:
        break;
    }
  }

}
