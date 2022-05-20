import { GetIPService } from './../../services/get-ip.service';
import { InfoIpService } from 'src/app/services/info-ip.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserAuthenticationService } from './../../services/user-authentication.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {

  UserData:string | null = null 
  constructor(private _route:Router) {}

  ngOnInit(): void {
    this.UserData = localStorage.getItem('fullName')
  }


  redirect(){
    this._route.navigateByUrl('/signup')
  }

}
