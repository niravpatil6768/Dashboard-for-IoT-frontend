import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { WebService } from '../web.service';
import { StorageService } from 'src/app/storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  password: string = '';
  //showPassword: boolean = false;
  isLoggedIn = false;

  errMessage: string = '';
  form: FormGroup = new FormGroup({
    email: new FormControl(''),
    pass: new FormControl('')
  })
  submitted = false;
  errorMessage: string = '';

  constructor(private router : Router,private formBuilder: FormBuilder,
    private webService: WebService,
    private storageService: StorageService) { }

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm(): void {
    this.form = this.formBuilder.group(
         {
          email : ['', [Validators.required, Validators.email]],
          pass : ['', [Validators.required, Validators.minLength(8),
        Validators.maxLength(20)]]
         }
    )
  }

  get formControls(): { [key : string] : AbstractControl} {
    return this.form.controls;
  }

 signIn() : void {
  this.submitted = true;
  if(this.form.invalid){
    return;
  }

  const {email, pass} = this.form.value;

  this.webService.login(email,pass).subscribe (
    {
      next: (data) => {

        console.log(this.storageService.setToken(data.body.token));
        const token = this.storageService.getToken();
        console.log('token : ', token);
        
        this.isLoggedIn = true;

        this.router.navigate(['dashboard']);

      },
      error: (err) => {
        this.errorMessage = err.error.message;
        this.errMessage = 'Email or password not found';

      }
    }
  )
 }

 onReset(): void {
  this.submitted = false;
  this.form.reset();
}

}
