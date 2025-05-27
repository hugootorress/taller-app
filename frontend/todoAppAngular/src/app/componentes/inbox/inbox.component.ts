import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { Email } from '../../modelos/email.model';

@Component({
  selector: 'app-inbox',
  standalone: true,
  imports: [CommonModule, SidebarComponent],
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.css']
})
export class InboxComponent {
  received: Email[] = [];
  sent: Email[] = [];
  loading = true;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    const token = localStorage.getItem('token');
    this.loading = true;
    this.http.get<any>('http://localhost:8000/api/inbox', {
      headers: {
        'Authorization': `Bearer ${token}`
      },
    }).subscribe({
      next: (data) => {
        this.received = data.received || [];
        this.sent = data.sent || [];
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.received = [];
        this.sent = [];
        this.loading = false;
      }
    });
  }
}