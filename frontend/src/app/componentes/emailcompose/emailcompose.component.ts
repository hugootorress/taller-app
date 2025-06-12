import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-email-compose',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent],
  templateUrl: './emailcompose.component.html',
  styleUrls: ['./emailcompose.component.css']
})
export class EmailComposeComponent {
  toEmail = 'hugales2005@gmail.com';
  subject = '';
  body = '';
  success = false;
  error = '';
  fromEmail = 'onboarding@resend.dev';
  fromName = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {
    this.fromName = localStorage.getItem('mechanicName') || 'Mecánico';
  }

  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return token ? { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) } : {};
  }

  send() {
    if (!this.subject.trim() || !this.body.trim()) {
      this.error = 'Por favor completa todos los campos.';
      return;
    }
    const payload = {
      to: this.toEmail,
      subject: this.subject,
      body: this.body,
      from_email: this.fromEmail,
      from_name: this.fromName,
    };
    this.http.post('/api/send-email', payload, this.getAuthHeaders()).subscribe({
      next: () => {
        this.success = true;
        this.error = '';
        this.subject = '';
        this.body = '';
      },
      error: (err: any) => {
        this.success = false;
        // Mostrar mensaje detallado de Resend si existe
        if (err.error?.error) {
          this.error = err.error.message + ': ' + JSON.stringify(err.error.error);
        } else {
          this.error = err.error?.message || 'Error al enviar el correo';
        }
      }
    });
  }

  cancel() {
    this.router.navigate(['/dashboardpro']);
  }
}

