import { Router } from '@angular/router';
import { UserAuthenticationService } from './../../services/user-authentication.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {
  constructor(private _auth:UserAuthenticationService, private _router:Router) { }

  ngOnInit(): void {
    
    this._auth.logout()
    this._router.navigateByUrl('/signup')
  }

}
