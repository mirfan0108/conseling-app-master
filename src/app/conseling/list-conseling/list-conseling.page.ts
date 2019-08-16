import { Component, OnInit, Input } from '@angular/core';
import { CategoryService } from 'src/app/services/category.service';
import { ModalController } from '@ionic/angular';
import { ResultConselingPage } from '../result-conseling/result-conseling.page';
import { ComplaintService } from 'src/app/services/complaint.service';

@Component({
  selector: 'app-list-conseling',
  templateUrl: './list-conseling.page.html',
  styleUrls: ['./list-conseling.page.scss'],
})
export class ListConselingPage implements OnInit {
  @Input() conseling: any;
  categories = []
  category: any;
  constructor(private apiCategory: CategoryService, private modalCtrl: ModalController) { }

  ngOnInit() {
    console.log(this.conseling)
    this.apiCategory.getCategories().subscribe((resp: any) => {
      this.categories = resp.data;
    })
  }

  

  async openResult(data) {
    console.log(data)
    const modal = await this.modalCtrl.create({
      component: ResultConselingPage,
      componentProps: {
        dataConseling: data,
        categories: this.categories
      }
    });
    modal.onDidDismiss().then((res: any) => {
      if(res.data) {
        data = res.data
      }
    })
    return await modal.present();
    
  }

}
