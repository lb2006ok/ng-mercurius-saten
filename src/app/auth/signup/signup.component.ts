import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  constructor() { }

  ngOnInit() {
    this.signupForm = new FormGroup({
      "email": new FormControl(null, [Validators.email, Validators.required]),
      "password": new FormControl(null, [Validators.minLength(6)])
    })
  }
  onSubmit() {
    console.log(this.signupForm)
  }
}
