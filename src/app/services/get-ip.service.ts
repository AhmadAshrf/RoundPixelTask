import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserIP } from '../models/ip.model';

@Injectable({
  providedIn: 'root'
})
export class GetIPService {

  constructor(private _httpClient:HttpClient) {}

  getIP():Observable<UserIP>{
    return this._httpClient.get<UserIP>('https://api.ipify.org/?format=json')
  }
}
