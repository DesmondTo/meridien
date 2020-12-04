import { LoginService } from './../model-service/users/login.service';
import { Component, OnInit, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {
  public loginStatus: BehaviorSubject<boolean>;

  constructor(
    private loginService: LoginService,
    private router: Router
  ) {
    this.loginStatus = new BehaviorSubject<boolean>(false);
    this.loginService.observableUser.subscribe({
      next: (user) => this.loginStatus.next(user != null),
    });
  }

  ngOnInit(): void {

  }

  logout() {
    this.loginService.logout();
  }

}
