import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgxUiLoaderHttpModule, NgxUiLoaderModule } from 'ngx-ui-loader';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    LoginComponent,
    SignupComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    CommonModule,
    FormsModule,
    NgxUiLoaderModule,
    ReactiveFormsModule,
    NgxUiLoaderHttpModule.forRoot({ 
      showForeground: true,
    }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
