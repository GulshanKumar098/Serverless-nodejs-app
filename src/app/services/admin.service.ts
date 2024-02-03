import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiHandlerService } from './api-handler.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  constructor(private apiService: ApiHandlerService,private http:HttpClient ) {
  }

  get(endpoint:string){
    return this.http.get<any[]>(`${environment.API_BASE_URL}`+endpoint)
  }

  post(endpoint:string,body?:any){
    return this.http.post(`${environment.API_BASE_URL}`+endpoint,body)
  }

  put(endpoint:string,body?:any){
    return this.apiService.Put(`${environment.API_BASE_URL}`+endpoint,body)
  }

  delete(endpoint:string){
    return this.apiService.Delete(`${environment.API_BASE_URL}`+endpoint,null)
  }



}
