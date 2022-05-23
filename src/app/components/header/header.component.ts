import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { UserAuthenticationService } from './../../services/user-authentication.service';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  isLogged:boolean = false
  componentSubscription:Subscription[] = []
  
  constructor(private _auth:UserAuthenticationService) {}
  ngOnInit(): void {
    let hedaerLogStatus = this._auth.logInStatus.subscribe(status => {
      this.isLogged = status
    })
    this.componentSubscription.push(hedaerLogStatus)
  }

  ngOnDestroy(): void {
    for(let sub of this.componentSubscription){
      sub.unsubscribe()
    }
  }
}
