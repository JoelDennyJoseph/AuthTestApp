import { Component, OnInit, inject } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  private readonly oidcSecurityService = inject(OidcSecurityService);
  public userData: any = null;
  public isAuthenticated: any = null;
  public origin: any = window.location.origin;

  ngOnInit() {
    this.oidcSecurityService.checkAuth().subscribe(({ isAuthenticated, userData}) => {
      this.isAuthenticated = isAuthenticated;
      this.userData = userData;
    });
  }

  login() {
    this.oidcSecurityService.authorize();
  }
}