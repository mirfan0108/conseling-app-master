import { Component, OnInit } from '@angular/core';
import { ServicesService } from '../services.service';
import { ComplaintService } from 'src/app/services/complaint.service';
import { CategoryService } from 'src/app/services/category.service';
import { Router } from '@angular/router';
import * as $ from 'jquery'
import { Socket } from 'ng-socket-io';
@Component({
  selector: 'app-modify-profile',
  templateUrl: './modify-profile.page.html',
  styleUrls: ['./modify-profile.page.scss'],
})
export class ModifyProfilePage implements OnInit {
  formUpdate = {
    address: "",
    avatar: '',
    birth: "",
    gender: "men",
    hp: 98123874723,
    ktp: null,
    name: "",
    userId: "",
    __v: 0,
    _id: ""
  }
  bod: '';
  file: File;
  fileKtp: File;
  ktpName = ''
  fotoName = ''


  constructor(private apiCategory: CategoryService, private apiComplaint: ComplaintService, private router: Router,
    private userApi: ServicesService, private socket: Socket) { }


  ngOnInit() {
    let storeLocal = localStorage.getItem('_USER');
    let id = JSON.parse(storeLocal)._ID;
    this.apiComplaint.getPatientComplaint(id).subscribe((res: any) => {
      this.formUpdate = res.profile
      console.log(res)
    })
  }

  changeListener($event) : void {
    if($event.target.files[0]) {
      this.file = $event.target.files[0];
      if($event.target.files && $event.target.files[0]){
        let reader = new FileReader();
        reader.readAsDataURL($event.target.files[0]);
      }
        let fileList: FileList = $event.target.files;  
        this.fotoName = fileList[0].name
    }
  }

  changeListenerKtp($event) : void {
    if($event.target.files[0]) {
      this.fileKtp = $event.target.files[0];
      if($event.target.files && $event.target.files[0]){
        let reader = new FileReader();
        reader.readAsDataURL($event.target.files[0]);
      }
        let fileList: FileList = $event.target.files;  
        this.ktpName = fileList[0].name;
    }
  }
  normalizeDate() {
    let date = this.formUpdate.birth
    let dateChiper = date.split("T")
    let dateArr = dateChiper[0].split("-");
    let dateText;
    switch (dateArr[1]) {
      case "01":
        dateText = dateArr[2]+" Januari "+dateArr[0]
        break;
      case "02":
        dateText = dateArr[2]+" Februari "+dateArr[0]
        break;
      case "03":
        dateText = dateArr[2]+" Maret "+dateArr[0]
        break;
      case "04":
        dateText = dateArr[2]+" April "+dateArr[0]
        break;
      case "05":
        dateText = dateArr[2]+" Mei "+dateArr[0]
        break;
      case "06":
        dateText = dateArr[2]+" Juni "+dateArr[0]
        break;
      case "07":
        dateText = dateArr[2]+" Juli "+dateArr[0]
        break;
      case "08":
        dateText = dateArr[2]+" Agustus "+dateArr[0]
        break;
      case "09":
        dateText = dateArr[2]+" September "+dateArr[0]
        break;
      case "10":
        dateText = dateArr[2]+" Oktober "+dateArr[0]
        break;
      case "11":
        dateText = dateArr[2]+" November "+dateArr[0]
        break;
      case "12":
        dateText = dateArr[2]+" Desember "+dateArr[0]
        break;
      default:
        break;
    }
    this.bod = dateText;
  }
  doInputFile(element) {
    switch (element) {
      case 'foto':
        $('#input-avatar').click()
        break;
      case 'ktp':
        $('#input-ktp').click()
        break;
      default:
        break;
    }
  }

  openCalendar() {
    $('#cal-hide').click()
  }

  doUpdate() {
    let storeLocal = localStorage.getItem('_USER');
    let id = JSON.parse(storeLocal)._ID;
    let statusActive = JSON.parse(storeLocal).status
    let formUpdate: any;
    formUpdate = {
      address: this.formUpdate.address,
      birth: this.formUpdate.birth,
      gender: this.formUpdate.gender,
      hp: this.formUpdate.hp,
      name: this.formUpdate.name,
      _id: this.formUpdate._id
    }
    if(this.fileKtp) {
      formUpdate.ktp = this.fileKtp
    } 
    if(this.file) {
      formUpdate.avatar = this.file
    }
    this.userApi.updateProfile(formUpdate)
    .subscribe((res: any) => {
      this.userApi.getUser(id).subscribe((ress: any) => {
        ress.status = 0;
        this.userApi.updateUser(ress).subscribe(async (resp: any) => {
          localStorage.removeItem('_USER')
          let updated = JSON.parse(storeLocal)
          updated.status = 0;
          await localStorage.setItem('_USER', JSON.stringify(updated))
          if(statusActive == 3) {
            this.router.navigateByUrl('modify-form')
          } else {
            
            this.router.navigateByUrl('home')
          }
        })
      })
      this.socket.emit('patient-update')
    })
  }

}
