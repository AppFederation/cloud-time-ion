import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup-email-password',
  templateUrl: './signup-email-password.component.html',
  styleUrls: ['./signup-email-password.component.sass'],
})
export class SignupEmailPasswordComponent implements OnInit {
  constructor(
    public afAuth: AngularFireAuth,
    private AuthService: AuthService
  ) {}

  ngOnInit() {}

  signupEmailAndPassword(form: NgForm) {
    const email = form.value.email;
    const password = form.value.password;
    const password2 = form.value.password2;
    if (password === password2) {
      this.AuthService.signUpWithEmailAndPassword(email, password);
    } else {
      // To finish: Adding cutom validators
      console.log("Passwords don't match");
    }
  }
}
