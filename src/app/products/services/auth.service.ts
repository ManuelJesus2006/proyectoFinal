import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environment';
import { User } from '../interface/user.interface';

const API_URL = environment.apiUrl
@Injectable({ providedIn: 'root' })
export class AuthService {
    
    constructor() {

    }

    private http = inject(HttpClient)
    isLoggedIn = signal<boolean>(localStorage.getItem('session_active') === 'true');

    login(email: string, pass: string) {
        const headers = new HttpHeaders()
            .set('api_key', environment.apiKey)
        return this.http.post<User>(`${API_URL}/auth/login`, { 'email': email, 'pass': pass }, { headers })

    }

    logout() {
        localStorage.removeItem('session_active');
        this.isLoggedIn.set(false);
    }
    register(name: string, email: string, pass: string) {
      const headers = new HttpHeaders()
            .set('api_key', environment.apiKey)
        return this.http.post<User>(`${API_URL}/auth/signup`, {'name':name, 'email': email, 'pass': pass }, { headers })
    }
}