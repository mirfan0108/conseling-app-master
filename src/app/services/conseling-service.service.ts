import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment'
const ENV = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class ConselingServiceService {
  statusConselor = 0;
  constructor(private httpClient: HttpClient) { 
  }

  getWeekly(id) {
    return this.httpClient.get(`${ENV}/schedule/weekly/${id}`)
  }
  getScheduleByDate(date) {
    return this.httpClient.get(`${ENV}/schedule/${date}`);
  }

  createConseling(req) {
    return this.httpClient.post(`${ENV}/conseling`, req)
  }

  getPatientConseling(id) {
    return this.httpClient.get(`${ENV}/conseling/patient/${id}`);
  }

  getScheduleConseling(id) {
    return this.httpClient.get(`${ENV}/schedule/conselings/${id}`);
  }

  getPatientSchedule(id) {
    return this.httpClient.get(`${ENV}/schedule/conselings/patient/${id}`);
  }

  updateSchedule(req) {
    return this.httpClient.put(`${ENV}/schedule/id/${req._id}`, req);
  }

  updateConseling(req) {
    return this.httpClient.put(`${ENV}/conseling/${req._id}`, req);
  }
  
  getChat(id) {
    return this.httpClient.get(`${ENV}/log/chat/${id}`);
  }
  sendChat(req) {
    return this.httpClient.post(`${ENV}/log/chat`, req)
  }

  updateStatusComplaintToConsult(req) {
    let form = {
      _id: req._id,
      status: 9,
      title: req.title,
      description: req.description,
      scheduleId: req.scheduleId,
      patientId: req.patientId,
      conselorId: req.conselorId,
      created_on: req.created_on
    }
    return this.httpClient.put(`${ENV}/complaint/${req._id}`,form);
  }

  getScheduleConselor(id) {
    return this.httpClient.get(`${ENV}/new/schedule/${id}`);
  }

  updateScheduleConselor(req) {
    return this.httpClient.put(`${ENV}/new/schedule/${req._id}`, req);
  } 
}
