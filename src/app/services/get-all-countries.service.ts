import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Countries } from '../models/countries.model';

@Injectable({
  providedIn: 'root'
})
export class GetAllCountriesService {

  constructor(private _httpClient:HttpClient) { }

  getAllCoutries():Observable<Countries>{
    return this._httpClient.get<Countries>('https://backofficeapi.online-tkt.com/api/GetAllCountriesByLangName?LangCode=en')
  }
}
