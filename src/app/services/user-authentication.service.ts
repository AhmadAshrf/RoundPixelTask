import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserAuthenticationService {

  logInStatus:BehaviorSubject<boolean>

  constructor() {
    this.logInStatus = new BehaviorSubject<boolean>(this.isLoggedIn())
   }


  signup(fullName:string, email:string, password:string){
    localStorage.setItem('fullName', fullName)
    localStorage.setItem('email', email)
    localStorage.setItem('password', password)

    //Handling BehaviorSubject Observable
    this.logInStatus.next(true)
  }

  logout(){
    localStorage.removeItem('fullName')
    localStorage.removeItem('email')
    localStorage.removeItem('password')

    this.logInStatus.next(false)
  }

  isLoggedIn():boolean{
    let email = localStorage.getItem('email')
    return email != null
  }







}
