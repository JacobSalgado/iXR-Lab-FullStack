import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private api = 'http:192.168.184.130:3000/api/auth';
  
  constructor (private http: HttpClient) {}
  
  register(data: any) {
    return this.http.post('${this.api}/register', data);
  }
  
  login(data: any) {
    return this.http.post('${this.api}/login', data);
  }
  
  saveToken(token: string) {
    localStorage.setItem('ixr_token', token);
  }
  
  getToken() {
    return localStorage.getItem('ixr_token');
  }
  
  logout() {
    localStorage.removeItem('ixr_token');
  }
  
  isLoggedIn() {
    return !!this.getToken();
  }
}
