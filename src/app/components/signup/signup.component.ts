import { Countries } from './../../models/countries.model';
import { GetAllCountriesService } from './../../services/get-all-countries.service';
import { UserAuthenticationService } from './../../services/user-authentication.service';
import { UserData } from './../../models/userinfo.model';
import { GetIPService } from './../../services/get-ip.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserIP } from 'src/app/models/ip.model';
import { InfoIpService } from 'src/app/services/info-ip.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { mergeMap, Subject, Subscription, takeUntil } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit, OnDestroy {

  //Class Properties
  public currentIP: UserIP[] = [];
  public allCountries!: Countries[];
  public isPageLoaded: boolean = true;
  public isLogged: boolean = false;
  public signUpForm: FormGroup;
  public userInfooo!: UserData;
  public selectedCountry: any;

  //Handle Unsubscription using RxJS
  private componentSubscription

  constructor(private _getIP: GetIPService,
    private _userInfo: InfoIpService,
    private _AllCountries: GetAllCountriesService,
    private _formBuilder: FormBuilder,
    private _userAuthService: UserAuthenticationService,
    private _router: Router,
    private _auth: UserAuthenticationService) {

    //Best Practice is Initialize any Property in Constractor
    this.componentSubscription = new Subject<void>()
    //Subjects is an Impelementaion of RxJS that acts both as an Observer & Observable

    //Reactive Forms
    this.signUpForm = this._formBuilder.group({
      username: ['', [Validators.required,
      Validators.maxLength(15),
      Validators.minLength(4),
      Validators.pattern('^[a-zA-Z0-9]+$')
      ]],
      email: ['', [Validators.required,
      Validators.maxLength(20),
      Validators.minLength(7),
      Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ]],
      password: ['', [Validators.required,
      Validators.maxLength(15),
      Validators.minLength(8),
      Validators.pattern('^[a-zA-Z0-9]+$')
      ]],
      confPassword: ['', [Validators.required]]
    }, { validators: this.isPasswordMathc('password', 'confPassword') })
  }

  ngOnInit(): void {
    this._auth.logInStatus.pipe(
      takeUntil(this.componentSubscription)
    ).subscribe(status => {
      this.isLogged = status
    })
    // this.componentSubscription.push(logStatusObserv)

    //Another Solution For Input Checker
    this.signUpForm.get('username')?.valueChanges.pipe(
      takeUntil(this.componentSubscription)
    ).subscribe(username => {
      const match = username.match(/[\u0600-\u06FF]+/i);
      if (match) this.signUpForm.get('username')?.setValue(this.username?.value.replace(match, ''));
    })

    this._AllCountries.getAllCoutries().pipe(
      takeUntil(this.componentSubscription)
    ).subscribe({
      next: (data: any) => {
        this.allCountries = data
        this.isPageLoaded = false
      },
      error: (error: Error) => { console.log(error.message) }
    })
    // this.componentSubscription.push(countryObs)

    //Merge two APIs with [MergeMap] Observable Operators
    this._getIP.getIP().pipe(
      mergeMap((data) => {
        //MergeMap Must Return an Observable
        this.currentIP.push(data)
        return this._userInfo.get(data.ip)
      }), takeUntil(this.componentSubscription)
    ).subscribe({
      next: (data: any) => {
        this.userInfooo = data
        this.selectedCountry = this.allCountries.find(el => el.countryName == this.userInfooo.country_name)
        this.isPageLoaded = false
      },
      error: (err: Error) => { console.log(err.message) }
    })
    // this.componentSubscription.push(nestedObservable)
  }

  //Dealing with Methods as Properties
  get username() {
    return this.signUpForm.get('username')
  }
  get email() {
    return this.signUpForm.get('email')
  }
  get password() {
    return this.signUpForm.get('password')
  }
  get confPassword() {
    return this.signUpForm.get('confPassword')
  }

  //Custom Validator on Passwords!
  isPasswordMathc(password: any, confPassword: any) {
    return (formGroup: FormGroup) => {
      const PassControl = formGroup.controls[password]
      const ConfPassControl = formGroup.controls[confPassword]
      if (ConfPassControl.errors && !ConfPassControl.errors['isPasswordMathc']) return
      if (PassControl.value != ConfPassControl.value) {
        ConfPassControl.setErrors({ isPasswordMathc: true })
      } else {
        ConfPassControl.setErrors(null)
      }
    }
  }

  signUp(name: string, email: string, password: string) {
    this._userAuthService.signup(name, email, password)
    this._router.navigateByUrl('/welcome')
  }

  goBack() {
    this._router.navigateByUrl('/welcome')
  }

  ngOnDestroy(): void {
    this.componentSubscription.next()
    this.componentSubscription.complete()

    // for (let subscription of this.componentSubscription) {
    //   subscription.unsubscribe()
    // }    
  }
}


  //This is a Nested Subscriptions in Production May Cause a Huge Performance ERROR

  // let IpObserv = this._getIP.getIP().subscribe(
  //   {
  //     next: (data: any) => {
  //       this.currentIP.push(data)
  //       for (let ipAddress of this.currentIP) {
  //         // this.getData(ipAddress.ip)
  //       }
  //       this.isPageLoaded = false
  //     }, error: (error: any) => {console.log(error.message)}
  //   })
  // this.componentSub.push(IpObserv)

  // getData(ip: string) {
  //   let getDataObser = this._userInfo.get(ip).pipe().subscribe(
  //     {
  //       next: (data: any) => {
  //         this.userInfooo = data
  //         this.selectedCountry = this.allCountries.find(el => el.countryName == this.userInfooo.country_name)
  //         this.isPageLoaded = false
  //       }, error: (err: any) => { console.log(err.message) }
  //     })
  //   this.componentSub.push(getDataObser)
  // }

/************************************************************ */
/************************************************************ */

  // Input Validation with Event :

  // InputChecker(ev: any) {
  //   let pattern = new RegExp(/^[\u0621-\u064A]+$/)
  //   if (pattern.test(ev.target.value)) ev.preventDefault()
  // }

/************************************************************ */
/************************************************************ */

  //Another way For disable Arabic on Input :

  // InputChecker(ev: any){
  //   const eventWhich = ev.which
  //   console.log(eventWhich)
  //   if(eventWhich == 32) return true;
  //   if(48 <= eventWhich && eventWhich <= 57) return true;
  //   if(65 <= eventWhich && eventWhich <= 90) return true;
  //   if(97 <= eventWhich && eventWhich <= 122) return true;
  //   return false;
  // }