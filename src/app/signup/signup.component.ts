import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { WebService } from 'src/app/web.service';
import Validation from '../comman-validators';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  password: string = '';
  confirmPassword: string = '';
 
  form: FormGroup = new FormGroup({
    
    fullname: new FormControl(''),
    username: new FormControl(''),
    email: new FormControl(''),
    password: new FormControl(''),
    confirmPassword: new FormControl(''),
    acceptTerms: new FormControl(false),
  });
  submitted = false;

  constructor(private formBuilder: FormBuilder, private webService: WebService, private router: Router) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group(
      {
        fullname: ['', [Validators.required]],
        username: ['', [Validators.required, Validators.minLength(6)]],
        email: ['', [Validators.required, Validators.email]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(40)
          ]
        ],
       
        confirmPassword: ['', Validators.required],
        acceptTerms: [false, Validators.requiredTrue]
      },
      {
        validators: [Validation.match('password', 'confirmPassword')]
      }
    );
  }


  get formControl(): { [key: string]: AbstractControl } {
    return this.form.controls;    
  }

  onSubmit(): void {
    console.log("in signup");
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }

    console.log("in signup 1");
    const {fullname, username,  email, password } = this.form.value;
    console.log("in signup 2");
    
    this.webService.signup(fullname, username, email, password).subscribe(
      {
        next: (data) => { 

          const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
            customClass: 'swal-wide',
            didOpen: (toast) => {
              toast.addEventListener('mouseenter', Swal.stopTimer)
              toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
          })
          Toast.fire({
            icon: 'success',
            title: 'Signup in successfully'
          })
      
          this.router.navigate(['/']);
          
        },
        error: (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'User already exists with this email!',
            
          })
          console.log(err);
        }
      }
    );

  }

  onReset(): void {
    this.submitted = false;
    this.form.reset();   
  }

}
