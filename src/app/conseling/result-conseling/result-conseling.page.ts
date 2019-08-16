import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ComplaintService } from 'src/app/services/complaint.service';

@Component({
  selector: 'app-result-conseling',
  templateUrl: './result-conseling.page.html',
  styleUrls: ['./result-conseling.page.scss'],
})
export class ResultConselingPage implements OnInit {
  @Input() dataConseling: any;
  category: any;
  @Input() categories = []
  constructor(private modalCtrl: ModalController, private apiComplaint: ComplaintService) { }

  ngOnInit() {
    console.log(this.category)
    this.apiComplaint.getComplaintId(this.dataConseling.complaint_id)
    .subscribe((resp: any) => {
      console.log(resp)
      this.category = this.getCategory(resp.data.category_id)
    })
  }
  getCategory(id) {
    let category;
    this.categories.forEach(element => {
      if(element._id == id) {
        category = element.category
      }
    });
    return category;  
  }  
  closeModal() {
    this.modalCtrl.dismiss()
  }

}
