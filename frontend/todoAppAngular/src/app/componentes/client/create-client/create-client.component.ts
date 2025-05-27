import { Component, OnInit } from '@angular/core';
import { ClientService } from '../../../servicios/client/client.service';
import { Router } from '@angular/router';
import { Client } from '../../../modelos/client.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../sidebar/sidebar.component';

@Component({
  selector: 'app-create-client',
  templateUrl: './create-client.component.html',
  standalone: true,
  imports: [FormsModule, CommonModule,SidebarComponent],
  styleUrls: ['./create-client.component.css']
})
export class CreateClientComponent implements OnInit {
  newClient = {
    id: 0,
    name: '',
    email: '',
    phone: '',
    address: ''
  };

  successMessage = '';
  errorMessage = '';

  constructor(
    private clientService: ClientService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  createClient(client: Client): void {
    this.clientService.createClient(client).subscribe({
      next: () => {
        this.successMessage = 'Cliente creado correctamente';
        this.errorMessage = '';
        this.newClient = { id: 0, name: '', email: '', phone: '', address: '' };
      },
      error: () => {
        this.errorMessage = 'Error al crear cliente';
        this.successMessage = '';
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/clients']);
  }
}
