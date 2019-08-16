import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment'
const ENV = environment.apiUrl;


@Injectable({
  providedIn: 'root'
})
export class ServicesService {
  
  constructor(private  httpClient:  HttpClient) { }

  register(newUser: any) {
    console.log(newUser)
    let form = new FormData();
    if(newUser.avatar) {
      form.append("avatar", newUser.avatar, newUser.avatar.name);
    }
    form.append("ktp", newUser.ktp, newUser.ktp.name);
    form.append("email", newUser.email);
    form.append("role", newUser.role);
    form.append("password", newUser.password);
    form.append("name", newUser.name);
    form.append("hp", newUser.hp);
    form.append("gender", newUser.gender);
    form.append("birth", newUser.birth);
    form.append("address", newUser.address);
    
    return this.httpClient.post(`${ENV}/regist`, form);
  }

  login(user: any) {
    return this.httpClient.post(`${ENV}/login`, user)
  }

  getUser(id) {
    return this.httpClient.get(`${ENV}/user/`+id)
  }

  async logout() {
    localStorage.clear()
  }

  sendEmail(form) {
    return this.httpClient.post(`${ENV}/forget-password/send-email`, form)
  }

  updateUser(form) {
    return this.httpClient.put(`${ENV}/user/update/${form._id}`, form)
  }

  updateProfile(profile: any) {
    let form = new FormData();
    if(profile.avatar) {
      form.append("avatar", profile.avatar, profile.avatar.name);
    }
    if(profile.ktp) {
      form.append("ktp", profile.ktp, profile.ktp.name);
    }
    form.append("email", profile.email);
    form.append("role", profile.role);
    form.append("password", profile.password);
    form.append("name", profile.name);
    form.append("hp", profile.hp);
    form.append("gender", profile.gender);
    form.append("birth",profile.birth);
    form.append("address", profile.address);
    
    return this.httpClient.put(`${ENV}/profile/${profile._id}`, form)
  }

  getProfile(id) {
    return this.httpClient.get(`${ENV}/profile/${id}`);
  }
}
