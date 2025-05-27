import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientService } from '../../../servicios/client/client.service';
import { Client } from '../../../modelos/client.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../sidebar/sidebar.component';

@Component({
  selector: 'app-edit-client',
  templateUrl: './edit-client.component.html',
  standalone: true,
  imports: [FormsModule, CommonModule, SidebarComponent],
  styleUrls: ['./edit-client.component.css']
})
export class EditClientComponent implements OnInit {
  clientId: string | null = null;
  client: Client = { id: 0, name: '', email: '', phone: '', address: '' };
  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private clientService: ClientService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.clientId = this.route.snapshot.paramMap.get('id');
    if (this.clientId) {
      this.getClientDetails(this.clientId);
    }
  }

  getClientDetails(id: string): void {
    this.clientService.getClient(parseInt(id)).subscribe(
      (data) => {
        this.client = data;
      },
      () => {
        this.errorMessage = 'No se pudo cargar el cliente.';
      }
    );
  }

  updateClient(): void {
    this.clientService.updateClient(this.client).subscribe(
      () => {
        this.successMessage = 'Cliente actualizado con éxito.';
        this.router.navigate(['/clients']);
      },
      () => {
        this.errorMessage = 'Error al actualizar el cliente.';
      }
    );
  }

  goBack(): void {
    this.router.navigate(['/clients']);
  }
}

