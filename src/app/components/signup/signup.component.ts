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
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit, OnDestroy {

  currentIP: UserIP[] = []

  allCountries!: Countries[]
  isPageLoaded: boolean = true
  isLogged: boolean = false
  signUpForm: FormGroup
  userInfooo!: UserData

  //Handle Unsubscription
  private componentSub: Subscription[] = []

  private namePattern: string = '^[a-zA-Z0-9]+$'
  private emailPattern: string = '^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$';
  private passwordPattern: string = '^[a-zA-Z0-9]+$'
  private arabicRegExpPattern = /[\u0600-\u06FF]+/i;


  constructor(private _getIP: GetIPService,
    private _userInfo: InfoIpService,
    private _AllCountries: GetAllCountriesService,
    private _formBuilder: FormBuilder,
    private _userAuthService: UserAuthenticationService,
    private _router: Router,
    private _auth: UserAuthenticationService
  ) {

    //Reactive Forms
    this.signUpForm = this._formBuilder.group({
      username: [null, [Validators.required,
      Validators.maxLength(15),
      Validators.minLength(4),
      Validators.pattern(this.namePattern)
      ]],
      email: ['', [Validators.required,
      Validators.maxLength(20),
      Validators.minLength(7),
      Validators.pattern(this.emailPattern)
      ]],
      password: ['', [Validators.required,
      Validators.maxLength(15),
      Validators.minLength(8),
      Validators.pattern(this.passwordPattern)
      ]],
      confPassword: ['', [Validators.required]]
    }, { validators: this.isPasswordMathc('password', 'confPassword') })
  }

  ngOnInit(): void {
    this._auth.logInStatus.subscribe(status => {
      this.isLogged = status
    })
    //Another Solution For Input Checker
    this.signUpForm.get('username')?.valueChanges.subscribe(username => {
      const match = username.match(this.arabicRegExpPattern);
      if (match) this.signUpForm.get('username')?.setValue(this.username?.value.replace(match, ''));
    })

    let IpObserv = this._getIP.getIP().subscribe(
      {
        next: (data: any) => {
          this.currentIP.push(data)
          for (let ipAddress of this.currentIP) {
            this.getData(ipAddress.ip)
          }
          this.isPageLoaded = false
        }, error: (error: any) => {
          console.log(error.message)
        }
      })


    this.componentSub.push(IpObserv)

    let countryObs = this._AllCountries.getAllCoutries().subscribe({
      next: (data: any) => {
        this.allCountries = data
        this.isPageLoaded = false
      },
      error: (error: any) => { console.log(error.message) }
    })

    this.componentSub.push(countryObs)
  }

  getData(ip: string) {

    let getDataObser = this._userInfo.get(ip).subscribe(
      {
        next: (data: any) => {
          this.userInfooo = data
          this.isPageLoaded = false
        }, error: (err: any) => { console.log(err.message) }
      })

    this.componentSub.push(getDataObser)
  }


  get username() { //Dealing with Methods as Properties in DOM
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


  // //Custom Validator on Input
  // isInputValid(ev: any) {
  //   return (formGroup: FormGroup) => {
  //     const strControl = formGroup.controls[ev.target.value]
  //     if (strControl.errors && !strControl.errors['isInputValid']) return
  //     let pattern = new RegExp(/^[\u0621-\u064A]+$/)
  //     if (pattern.test(ev.target.value)) {
  //       ev.preventDefault()
  //       strControl.setErrors(null)
  //     } else {
  //       strControl.setErrors({ isInputValid: true })
  //     }
  //   }
  // }

  // //Input Validation with Event
  // InputChecker(ev: any) {
  //   let pattern = new RegExp(/^[\u0621-\u064A]+$/)
  //   if (pattern.test(ev.target.value)) ev.preventDefault()
  // }

  //Another way For disable Arabic on Input
  // InputChecker(ev: any){
  //   const eventWhich = ev.which
  //   console.log(eventWhich)
  //   if(eventWhich == 32) return true;
  //   if(48 <= eventWhich && eventWhich <= 57) return true;
  //   if(65 <= eventWhich && eventWhich <= 90) return true;
  //   if(97 <= eventWhich && eventWhich <= 122) return true;
  //   return false;
  // }



  signUp(name: string, email: string, password: string) {
    this._userAuthService.signup(name, email, password)
    this._router.navigateByUrl('/welcome')
  }

  goBack() {
    this._router.navigateByUrl('/welcome')

  }

  ngOnDestroy(): void {
    for (let subscription of this.componentSub) {
      subscription.unsubscribe()
    }
  }


}
