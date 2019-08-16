import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment'
import { Observable } from 'rxjs';
import { CategoriesResponse } from '../_types/categories-response';
const ENV = environment.apiUrl;


@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private httpClient: HttpClient) { }
  
  getCategories(): Observable<CategoriesResponse> {
    return this.httpClient.get<CategoriesResponse>(`${ENV}/category`)
  }
}
