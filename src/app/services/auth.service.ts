import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  //private baseUrl = 'http://localhost:8000';
  private loggedIn = new BehaviorSubject<boolean>(false);

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    })
  };


  constructor(private http: HttpClient) {
    let accesstoken = localStorage.getItem('access_token')
  }

  login(username: string, password: string): Observable<any> {
     const payload: { [key: string]: string } = {
      grant_type: "password",
      username: username,
      password: password,
      scope:""
    };
    const body = new URLSearchParams();
    for (const key in payload) {
      body.set(key, payload[key]);
    }
    return this.http.post<any>(`${environment.API_BASE_URL}login`, body.toString(), this.httpOptions)
      .pipe(
        tap(response => {
          const token = response.access_token;
          const role = response.role;
          localStorage.setItem('access_token', token);
          localStorage.setItem('role',role);
          this.loggedIn.next(true);
        })
      );
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('role');
    this.loggedIn.next(false);
  }

  getToken(): string {
    return localStorage.getItem('access_token') || '';
  }

  getRole(): string {
    return localStorage.getItem('role') || '';
  }

  isLoggedIn(): Observable<boolean> {
    const token = this.getToken();
    if (token) {
      this.loggedIn.next(true);
    } else {
      this.loggedIn.next(false);
    }
    return this.loggedIn.asObservable();
  }
  changePassword(old_password: string, new_password: string, token: string) {
    return this.http.put(environment.API_BASE_URL+'update_password', { old_password, new_password, token }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  //forgot password

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${environment.API_BASE_URL}forget-password`, { email });
  }

  resetPassword(reset_token: string, new_password: string) {
    return this.http.post(`${environment.API_BASE_URL}reset-password`, { reset_token, new_password });
  }
}
