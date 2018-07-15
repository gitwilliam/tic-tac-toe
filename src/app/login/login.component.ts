import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  private email: string;
  private password: string;

  constructor(private auth: AuthService) { }

  ngOnInit() {
  }

  signInWithEmail() {
    this.auth.signInWithEmail(this.email, this.password)
      .then(u => console.log(u.user.uid + " is authenticated!"))
      .catch(err => console.log(err));
  }

}
