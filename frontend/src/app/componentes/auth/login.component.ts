import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../servicios/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; 
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  imports: [FormsModule, CommonModule, RouterModule], 
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  loading: boolean = false;
  loadingText: string = 'Accediendo';
  intervalId: any;
  constructor(private authService: AuthService, private router: Router) {}

  login(): void {
    this.loading = true;
    this.startLoadingDots();

    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (response) => {
        this.stopLoadingDots();
        if (response && response.respuesta) {
          console.log('Login exitoso');
          const isAdmin = this.authService.isAdmin();
          localStorage.setItem('mechanicIsAdmin', isAdmin ? 'true' : 'false');
          this.router.navigate(['/admin-dashboard']);  
          
        } else {
          console.log('Login fallido');
          this.errorMessage = 'Error al intentar iniciar sesión. Verifica tus credenciales.';
        }
      },
      error: (error) => {
        this.stopLoadingDots();
        console.log('Error en el login:', error);
        this.errorMessage = 'Error al intentar iniciar sesión. Verifica tus credenciales.';
      }
    });
  }

  startLoadingDots() {
    let dots = '';
    this.intervalId = setInterval(() => {
      dots = dots.length < 3 ? dots + '.' : '';
      this.loadingText = 'Accediendo' + dots;
    }, 500);
  }

  stopLoadingDots() {
    this.loading = false;
    clearInterval(this.intervalId);
    this.loadingText = 'Accediendo';
  }
}
