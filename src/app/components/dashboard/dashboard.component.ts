import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Inject, OnInit, inject } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { Observable, catchError, switchMap, throwError } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent  implements OnInit {
  private apiUrl = 'https://www.googleapis.com/oauth2/v1/userinfo';
  private readonly oidcSecurityService = inject(OidcSecurityService);
  private readonly http = inject(HttpClient);
  public userData: any = null;
  public isAuthenticated: any = null;

  ngOnInit() {
    this.oidcSecurityService.checkAuth().subscribe(({ isAuthenticated, userData}) => {
      this.isAuthenticated = isAuthenticated;
      this.userData = userData;
    });

    // this.getProfileInfo().subscribe({
    //   next: (result) => {
    //     console.log(result);
    //   },
    //   error: (error) => {
    //     console.log(error);
    //   }
    // });
  }

  getProfileInfo(): Observable<any> {
    return this.oidcSecurityService.getAccessToken().pipe(
      catchError((error) => {
        console.error('Error getting access token:', error);
        return throwError('Unable to retrieve access token');
      }),
      switchMap((accessToken) => {
        const headers = new HttpHeaders({
          Authorization: `Bearer ${accessToken}`,
        });

        return this.http.get(this.apiUrl, { headers }).pipe(
          catchError((apiError) => {
            console.error('Error fetching profile info:', apiError);
            return throwError('Error fetching profile info');
          })
        );
      })
    );
  }

  logout() {
    this.oidcSecurityService.logoff().subscribe((result) => console.log('Logout successful'));
  }
}