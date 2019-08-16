import { Component, OnInit, Input } from '@angular/core';
import { ConselingServiceService } from 'src/app/services/conseling-service.service';
import { ModalController } from '@ionic/angular';
import { async } from 'q';

@Component({
  selector: 'app-form-schedule',
  templateUrl: './form-schedule.page.html',
  styleUrls: ['./form-schedule.page.scss'],
})
export class FormSchedulePage implements OnInit {
  @Input() detail: any;
  @Input() scheduler: any;
  scheduleConselor = [];
  weeklyConselor = [];
  timings = [];
  formSchedule = {
    date: "",
    time: "",
    conselor_id: "",
    patient_id: ""
  }
  formConseling = {
    complaint_id: "",
    methode: "",
    option: "",
    result: "",
    patientId: "",
    conselorId: "",
  }
  day = "";
  clocks = [
    {clock:'08:00', avail: 1},{clock:'09:00', avail: 1},{clock:'10:00', avail: 1},
    {clock:'11:00', avail: 1},{clock:'12:00', avail: 1},{clock:'13:00', avail: 1},
    {clock:'14:00', avail: 1},{clock:'15:00', avail: 1},{clock:'16:00', avail: 1},
    {clock:'17:00', avail: 1},{clock:'18:00', avail: 1},{clock:'19:00', avail: 1}
  ];
  formApply = {
    applyDate: '',
    clock: ''
  }

  schedule = [];
  times = []
  days = "";
  constructor(private api: ConselingServiceService, private modalCtrl: ModalController ) { }

  ngOnInit() {
    console.log(this.scheduler)
    console.log(this.detail)
    let nowDate = new Date()
    if(this.scheduler) {
      if(this.scheduler.status == 0) {
        this.formSchedule.time = this.scheduler.schedule.time
        this.formSchedule.date = this.scheduler.schedule.date
        this.formConseling.methode = this.scheduler.methode
      }
    } else {
      this.formSchedule.date = nowDate.getFullYear()+"-"+this.pad(nowDate.getMonth()+1, 2)+"-"+this.pad(nowDate.getDate(), 2)
      this.formSchedule.date = this.formatDate();
    }
    console.log(this.detail)
    this.api.getScheduleConselor(this.detail.conselorId)
    .subscribe((resp: any) => {
      console.log(resp)
      this.schedule = resp.data;
      this.schedule.forEach(element => {
        if(element.date == this.formSchedule.date) {
          element.time.forEach(time => {
            if(time.status != 0) {
              switch (time.time) {
                case "09:00":
                  time.text = "09:00-10:00";
                  break;
                case "10:00":
                  time.text = "10:00-11:00";
                  break;
                case "11:00":
                  time.text = "11:00-12:00";
                  break;
                case "12:00":
                  time.text = "12:00-13:00";
                  break;
                case "13:00":
                  time.text = "13:00-14:00";
                  break;
                case "14:00":
                  time.text = "14:00-15:00";
                  break;
                case "15:00":
                  time.text = "15:00-16:00";
                  break;
                case "16:00":
                  time.text = "16:00-17:00";
                  break;
                case "17:00":
                  time.text = "17:00-18:00";
                  break;
                case "18:00":
                  time.text = "18:00-19:00";
                  break;
                case "19:00":
                  time.text = "19:00-20:00";
                  break;
                case "20:00":
                  time.text = "20:00-21:00";
                  break;
                case "21:00":
                  time.text = "21:00-22:00";
                  break;
                case "22:00":
                  time.text = "22:00-23:00";
                  break;
                default:
                  break;
              }
              this.times.push(time)
            }
          });
        }
      });
    })
    this.formConseling.complaint_id = this.detail._id
    this.formConseling.conselorId = this.detail.conselorId
    this.formConseling.patientId = this.detail.patientId
    this.formSchedule.conselor_id = this.detail.conselorId;
    this.formSchedule.patient_id = this.detail.patientId;
    
    this.api.getWeekly(this.detail.conselorId)
    .subscribe((res: any) => {
      this.weeklyConselor = res.data[0].week
      console.log(this.weeklyConselor)
      this.timings = []
      this.weeklyConselor.forEach(day => {
        if(day.day == this.day) {
          day.time.forEach(times => {
            if(times.isSelected) {
              this.timings.push(times)
            }
          });
        }
      })
    })
  }
  formatDate() {
    var d = new Date();
    
    var month = '' + (d.getMonth() + 1);
    var day = '' + d.getDate();
    var year = d.getFullYear();
    var hari = d.getDay()
    console.log(hari)
    let dayName;
    switch (hari) {
      case 1:
        dayName = "Senin"
        break;
      case 2:
        dayName = "Selasa"
        break;
      case 3:
        dayName = "Rabu"
        break;
      case 4:
        dayName = "Kamis"
        break;
      case 5:
        dayName = "Jumat"
        break;
      default:
        break;
    }
    console.log(dayName)
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    this.day = dayName
    return [year, month, day].join('-');
  }

  closeModal() {
    this.modalCtrl.dismiss()
  }
  checkSchedules() {
    this.times = []
    console.log(this.formSchedule.date)
    this.schedule.forEach(element => {
      if(element.date == this.formSchedule.date) {
        element.time.forEach(time => {
          if(time.status != 0) {
            switch (time.time) {
              case "09:00":
                time.text = "09:00-10:00";
                break;
              case "10:00":
                time.text = "10:00-11:00";
                break;
              case "11:00":
                time.text = "11:00-12:00";
                break;
              case "12:00":
                time.text = "12:00-13:00";
                break;
              case "13:00":
                time.text = "13:00-14:00";
                break;
              case "14:00":
                time.text = "14:00-15:00";
                break;
              case "15:00":
                time.text = "15:00-16:00";
                break;
              case "16:00":
                time.text = "16:00-17:00";
                break;
              case "17:00":
                time.text = "17:00-18:00";
                break;
              case "18:00":
                time.text = "18:00-19:00";
                break;
              case "19:00":
                time.text = "19:00-20:00";
                break;
              case "20:00":
                time.text = "20:00-21:00";
                break;
              case "21:00":
                time.text = "21:00-22:00";
                break;
              case "22:00":
                time.text = "22:00-23:00";
                break;
              default:
                break;
            }
            this.times.push(time)
          }
        });
      }
    });
  }
  checkSchedule() {
    console.log(this.formSchedule.date)
    var d = new Date(this.formSchedule.date);
    let hari = d.getDay()
    let dayName;
    console.log(d.getDay())
    switch (hari) {
      case 1:
        dayName = "Senin"
        break;
      case 2:
        dayName = "Selasa"
        break;
      case 3:
        dayName = "Rabu"
        break;
      case 4:
        dayName = "Kamis"
        break;
      case 5:
        dayName = "Jumat"
        break;
      default:
        break;
    }
    this.timings = []
    this.weeklyConselor.forEach(day => {
      if(day.day == dayName) {
        day.time.forEach(times => {
          if(times.isSelected) {
            this.timings.push(times)
          }
        });
      }
    })

    this.clocks.forEach(item => {
      item.avail = 1;
    })
    this.api.getScheduleByDate(this.formSchedule.date).subscribe((res: any) => {
      console.log(res)
      let tempClock = res.data;
      if(tempClock.length > 0 ){
        this.clocks.forEach(item => {
          tempClock.forEach(element => {
            if(item.clock == element.time){
              item.avail = 0
            } 
          });
        })
      } else {

      }
    })
  }

  calendarChanged($event){
    console.log($event)
  }

  async doPost() {
    let form = {
      formConsult: this.formConseling,
      formSchedule: this.formSchedule
    }
    console.log(form)
    if(this.scheduler) {
      this.doUpdate()
      // console.log("will update")
    } else {
      // console.log("will post")
      await this.api.createConseling(form).subscribe( async (res: any) => {
        console.log(res)
        await this.api.updateStatusComplaintToConsult(this.detail).subscribe(res => res)
        this.closeModal()
      })
    }
  }

  async doUpdate() {
    let conselings = {
      status: this.scheduler.status,
      complaint_id: this.scheduler.complaint_id,
      methode: this.formConseling.methode,
      option: this.scheduler.option,
      result: this.scheduler.result,
      patientId: this.scheduler.patientId,
      conselorId: this.scheduler.conselorId
    }

    let schedule = {
      date: this.formSchedule.date,
      time: this.formSchedule.time,
      conselor_id: this.scheduler.conselor_id,
      patient_id: this.scheduler.schedule.patient_id,
      conseling_id: this.scheduler.status,
      status: this.scheduler.schedule.date
    }

    await this.api.updateConseling(conselings)
    .subscribe(async (resp: any) => {
      await this.api.updateSchedule(schedule).subscribe(res => res)
      this.closeModal()
    })
  }
  pad(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
  }
}
