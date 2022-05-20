import { LogoutComponent } from './components/logout/logout.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { SignupComponent } from './components/signup/signup.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {path:'signup', component:SignupComponent},
  {path:'welcome', component:WelcomeComponent},
  {path:'logout', component:LogoutComponent},
  {path:'', redirectTo:'/signup',pathMatch:'full'},
  {path:'**', component:NotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
