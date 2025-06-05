import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClientService } from '../../servicios/client/client.service';
import { Client } from '../../modelos/client.model';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { SidebarComponent} from '../sidebar/sidebar.component';

@Component({
  selector: 'app-client',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent],
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})
export class ClientComponent implements OnInit {
  clients: Client[] = [];
  filteredClients: Client[] = [];
  searchTerm: string = '';  
  loading = true;

  successMessage = '';
  errorMessage = '';

  newClient: Client = {
    id: 0,
    name: '',
    email: '',
    phone: '',
    address: ''
  };

  constructor(
    private clientService: ClientService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadClients();
    this.loading = true;
  }

  loadClients(): void {
    this.clientService.getClients().subscribe({
      next: data => {
        console.log('Clientes cargados:', data);
        this.clients = data;
        this.filteredClients = data; 
        this.loading = false;

      },
      error: () => { 
        this.errorMessage = 'Error al cargar clientes'
        this.loading = false;
      }
    });
  }

  searchClients(): void {
    this.filteredClients = this.clients.filter(client => 
      client.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  viewClient(id: number): void {
    this.router.navigate([`/client/${id}`]);
  }

  deleteClient(id: number): void {
    this.clientService.getClient(id).subscribe({
      next: (client) => {
        this.clientService.getVehiclesByClientId(id).subscribe({
          next: (vehicles) => {
            if (vehicles.length === 0) {
              this.confirmDeleteClient(id); 
              return;
            }
  
            let totalRepairs = 0;
            let vehicleIds = vehicles.map(v => v.id);
            
            const repairRequests = vehicleIds.map(vid => this.clientService.getRepairsByVehicleId(vid));
            
            forkJoin(repairRequests).subscribe({
              next: (repairsArrays) => {
                repairsArrays.forEach(repairs => totalRepairs += repairs.length);
  
                const confirmDelete = confirm(
                  `Este cliente tiene ${vehicles.length} vehículo(s) y ${totalRepairs} reparación(es).\n¿Deseas eliminar todo junto al cliente?`
                );
  
                if (confirmDelete) {
                  this.proceedToDeleteClientAndRepairs(id); 
                }
              },
              error: () => this.errorMessage = 'Error al verificar reparaciones del cliente'
            });
          },
          error: () => this.errorMessage = 'Error al verificar vehículos del cliente'
        });
      },
      error: () => this.errorMessage = 'Error al cargar cliente'
    });
  }
  
  confirmDeleteClient(clientId: number): void {
    const confirmDelete = confirm('Este cliente no tiene vehículos ni reparaciones. ¿Deseas eliminarlo?');
    if (confirmDelete) {
      this.proceedToDeleteClient(clientId);  
    }
  }
  
  proceedToDeleteClient(clientId: number): void {
    this.clientService.deleteClient(clientId).subscribe({
      next: () => {
        this.loadClients();
        console.log('Cliente eliminado correctamente');
        this.successMessage = '';
        this.errorMessage = '';
      },
      error: () => {
        this.errorMessage = 'Error al eliminar cliente';
        this.successMessage = '';
      }
    });
  }
  
  proceedToDeleteClientAndRepairs(clientId: number): void {
    this.clientService.deleteClient(clientId).subscribe({
      next: () => {
        this.loadClients();
        console.log('Cliente, vehículos y reparaciones eliminados correctamente');
        this.successMessage = '';
        this.errorMessage = '';
      },
      error: () => {
        this.errorMessage = 'Error al eliminar cliente';
        this.successMessage = '';
      }
    });
  }
  

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }

  goToCreateClientPage(): void {
    this.router.navigate(['/create-client']);
  }
}
