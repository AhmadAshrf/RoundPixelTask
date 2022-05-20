import { Router } from '@angular/router';
import { UserAuthenticationService } from './../../services/user-authentication.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  isLogged:boolean = false
  constructor(private _auth:UserAuthenticationService) {
    
   }

  ngOnInit(): void {

    this._auth.logInStatus.subscribe(status => {
      this.isLogged = status
    })
  
  }

}
