import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { UserIP } from '../models/ip.model';

@Injectable({
  providedIn: 'root'
})
export class GetIPService {

  constructor(private _httpClient:HttpClient) {}

  getIP():Observable<UserIP>{
    return this._httpClient
    //I Noticed that APIs Sometimes get a Connection Error So I Used Retry Operator
            .get<UserIP>('https://api.ipify.org/?format=json')
            .pipe(
              retry(2),
              catchError((err:HttpErrorResponse) =>{
                console.log(err.error)
                return throwError(() => new Error('Something went wrong with Get IP Service'))
              })
            )
  }
}
