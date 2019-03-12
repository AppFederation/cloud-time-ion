import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/auth.service'

@Component({
  selector: 'app-user-sign-in',
  templateUrl: './user-sign-in.component.html',
  styleUrls: ['./user-sign-in.component.scss']
})
export class UserSignInComponent implements OnInit {

  constructor(
    public authService: AuthService
  ) { }

  ngOnInit() {
  }

  requestSignIn() {
    this.authService.requestSignIn()
  }
}
