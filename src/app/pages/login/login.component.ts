import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  username: string;
  password: string;

  constructor(
    private router: Router,
    private apiService: ApiService
  ) {
  }

  ngOnInit() {
  }

  async login() {
    console.log(this.apiService);
    const data = {
      username: this.username,
      password: this.password
    };
    const res = await this.apiService.login(data);
    console.log(res)
    // this.router.navigate(['/tabs/overview'], { replaceUrl: true });
    this.router.navigate(['/tabs/overview']);
  }
}
