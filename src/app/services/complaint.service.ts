import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment'
const ENV = environment.apiUrl;


@Injectable({
  providedIn: 'root'
})
export class ComplaintService {

  constructor(private httpClient: HttpClient) { }

  postComplain(req) {
    return this.httpClient.post(`${ENV}/complaint`,req);
  }

  getPatientComplaint(id) {
    return this.httpClient.get(`${ENV}/complaint/patient/${id}`);
  }

  updateComplaint(req) {
    return this.httpClient.put(`${ENV}/complaint/${req._id}`,req);
    
  }
  getComplaintId(id){
    return this.httpClient.get(`${ENV}/complaint/id/${id}`);
  }
}
