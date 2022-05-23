import { catchError, Observable, retry, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserData } from '../models/userinfo.model';

@Injectable({
  providedIn: 'root'
})
export class InfoIpService {

  constructor(private _httpClient:HttpClient) { }

  get(ip:string):Observable<UserData> {

    return this._httpClient
        //I Noticed that APIs Sometimes get a Connection Error So I Used Retry Operator
               .get<UserData>(`https://ipapi.co/${ip}/json/`)
               .pipe(
                retry(2),
                catchError((err:HttpErrorResponse) =>{
                  console.log(err.error)
                  return throwError(() => new Error('Something went wrong with Get Information Service'))
                })
              )
  }
}
