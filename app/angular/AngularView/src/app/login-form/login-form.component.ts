import { LoginService } from './../model-service/users/login.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {

  returnUrl: string;

  hide = true;

  loginForm = new FormGroup({
    username: new FormControl(''),
    password: new FormControl('')
  });

  constructor(
    private loginService: LoginService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    console.log(loginService.currentUserValue);
  }

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/';
  }

  get form() {
    return this.loginForm.controls;
  }

  onSubmit(): void {
    this.loginService.login({
      username: this.form.username.value,
      password: this.form.password.value
    })
      .subscribe((status: boolean) => {
        if (status) {
          this.router.navigate([this.returnUrl]);
        }
      });
  }

}
