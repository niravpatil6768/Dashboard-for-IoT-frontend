import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { AuthGuard } from 'src/app/guards/auth.guards';


const routes: Routes = [

  {path: 'dashboard', component: DashboardComponent, canActivate:[AuthGuard]},
  {path: '', component: LoginComponent, pathMatch:'full'},
  {path: 'signup', component: SignupComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
  
 }
