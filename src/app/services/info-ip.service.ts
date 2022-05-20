import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserData } from '../models/userinfo.model';

@Injectable({
  providedIn: 'root'
})
export class InfoIpService {

  constructor(private _httpClient:HttpClient) { }

  get(ip:string):Observable<UserData> {
    return this._httpClient.get<UserData>(`https://ipapi.co/${ip}/json/`)
  }
}
