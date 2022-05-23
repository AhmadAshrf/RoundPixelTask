import { catchError, Observable, retry, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Countries } from '../models/countries.model';

@Injectable({
  providedIn: 'root'
})
export class GetAllCountriesService {

  constructor(private _httpClient:HttpClient) { }

  getAllCoutries():Observable<Countries>{
    return this._httpClient
        //I Noticed that APIs Sometimes get a Connection Error So I Used Retry Operator
               .get<Countries>('https://backofficeapi.online-tkt.com/api/GetAllCountriesByLangName?LangCode=en')
               .pipe(
                retry(2),
                catchError((err:HttpErrorResponse) =>{
                  console.log(err.error)
                  return throwError(() => new Error('Something went wrong with Get All Countries Service'))
                })
              )
  }
}
