import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-email-compose',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent],
  templateUrl: './emailcompose.component.html',
  styleUrls: ['./emailcompose.component.css']
})
export class EmailComposeComponent {
  toEmail = '';
  subject = '';
  body = '';
  success = false;
  error = '';

  fromEmail = '';
  fromName = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {
    this.toEmail = decodeURIComponent(this.route.snapshot.paramMap.get('email') || '');

    const mechanicData = localStorage.getItem('mechanic');
    if (mechanicData) {
      try {
        const mechanic = JSON.parse(mechanicData);
        this.fromEmail = mechanic.email;
        this.fromName = mechanic.name;
      } catch (e) {
        this.error = 'Error leyendo los datos del mecánico.';
      }
    }
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
      from_name: this.fromName
    };

    this.http.post('/api/send-email', payload).subscribe({
      next: () => {
        this.success = true;
        this.error = '';
        this.subject = '';
        this.body = '';
      },
      error: (err) => {
        this.success = false;
        this.error = err.error?.message || 'Error al enviar el correo.';
      }
    });
  }

  cancel() {
    this.router.navigate(['/clients']);
  }
}

