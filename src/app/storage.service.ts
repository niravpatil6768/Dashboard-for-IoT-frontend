import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  public setToken(jwtToken:string){
    console.log("21"+jwtToken);
    localStorage.setItem("token",jwtToken);
  }

  public getToken(){
    return localStorage.getItem("token");
  }

  public getResetToken(){
    return localStorage.getItem("resetToken");
  }

  public clear(){
    localStorage.clear();
  }

  public isLoggedIn(){
    return  this.getToken();
  }
}
