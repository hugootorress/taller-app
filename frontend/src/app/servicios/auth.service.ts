import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
private apiUrl = 'http://tallermatehtorres.zapto.org:8000/api';  isLoggedIn = signal(!!localStorage.getItem('token')); 

  constructor(private http: HttpClient, private router: Router) {}

  login(credentials: { email: string; password: string }) {
    console.log('Haciendo solicitud POST para login');
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response) => {
        console.log('Respuesta recibida:', response);
        if (response.token && response.mechanic) {
          localStorage.setItem('token', response.token);
           localStorage.setItem('mechanic', JSON.stringify(response.mechanic));
          localStorage.setItem('mechanicName', response.mechanic.name);
          localStorage.setItem('mechanicImage', response.mechanic.image);
          localStorage.setItem('mechanicIsAdmin', response.mechanic.role === 'admin' ? 'true' : 'false');
          this.isLoggedIn.set(true);
          this.router.navigate(['/dashboardpro']);
        }
      }),
      catchError((error) => {
        console.error('Error en el login', error);
        alert('Error al intentar iniciar sesión. Verifica tus credenciales.');
        return of(null); 
      })
    );
  }

  register(user: { name: string; email: string; password: string; hourly_rate: number }) {
    return this.http.post(`${this.apiUrl}/register`, user).pipe(
      catchError((error) => {
        console.error('Error en el registro', error);
        alert('Error al registrar el usuario.');
        return of(null);
      })
    );
  }

  logout() {
  const token = this.getToken();
  if (token) {
    this.http.post(
      `${this.apiUrl}/logout`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    ).subscribe({
      next: () => {
      },
      error: (err) => {
        console.error('Error al cerrar sesión en el backend', err);
      },
      complete: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('mechanicName');
        localStorage.removeItem('mechanicImage');
        localStorage.removeItem('mechanicIsAdmin');
        localStorage.removeItem('mechanic');
        this.isLoggedIn.set(false);
        this.router.navigate(['/login']);
      }
    });
  } else {
    localStorage.removeItem('token');
    localStorage.removeItem('mechanicName');
    localStorage.removeItem('mechanicImage');
    localStorage.removeItem('mechanicIsAdmin');
    localStorage.removeItem('mechanic');
    this.isLoggedIn.set(false);
    this.router.navigate(['/login']);
  }
}

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAdmin(): boolean {
    return localStorage.getItem('mechanicIsAdmin') === 'true';
  }

  getName(): string | null {
    return localStorage.getItem('mechanicName');
  }

  getImage(): string | null {
    return localStorage.getItem('mechanicImage');
  }

  getCurrentMechanic(): any {
  const mechanic = localStorage.getItem('mechanic');
  return mechanic ? JSON.parse(mechanic) : null;
}

}
