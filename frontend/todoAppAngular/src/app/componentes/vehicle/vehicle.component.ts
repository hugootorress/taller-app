import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VehicleService } from '../../servicios/vehicle/vehicle.service';
import { ClientService } from '../../servicios/client/client.service';
import { Vehicle } from '../../modelos/vehicle.model';
import { Client } from '../../modelos/client.model';
import { Router } from '@angular/router';
import { SidebarComponent} from '../sidebar/sidebar.component';

@Component({
  selector: 'app-vehicle',
  standalone: true,
  imports: [CommonModule, FormsModule,SidebarComponent],
  templateUrl: './vehicle.component.html',
  styleUrls: ['./vehicle.component.css']
})
export class VehicleComponent implements OnInit {
  vehicles: Vehicle[] = [];
  filteredVehicles: Vehicle[] = [];
  clients: Client[] = [];
  searchTerm: string = '';  
  loading = true;
  newVehicle: Vehicle = {
    id: 0,
    license_plate: '',
    model: '',
    year: new Date().getFullYear(),
    client_id: 0,
    image: ''
  };
  successMessage = '';
  errorMessage = '';
  searchFilter: keyof Vehicle = 'license_plate';

  constructor(
    private vehicleService: VehicleService,
    private clientService: ClientService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadVehicles();
    this.loadClients();
    this.loading = true;
  }

  loadVehicles(): void {
    this.vehicleService.getVehicles().subscribe({
      next: data => {
        this.vehicles = data;
        this.filteredVehicles = data; 
        this.loading = false;
      },
       error: () => {
         this.errorMessage = 'Error al cargar vehículos'
         this.loading = false;
      }
    });
  }

  loadClients(): void {
    this.clientService.getClients().subscribe({
      next: data => this.clients = data,
      error: () => console.error('Error al cargar clientes para selector')
    });
  }

  searchVehicles(): void {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) {
      this.filteredVehicles = this.vehicles;
      return;
    }
  
    this.filteredVehicles = this.vehicles.filter(vehicle => {
      const value = vehicle[this.searchFilter];
      return value !== undefined && value.toString().toLowerCase().includes(term);
    });
  }

  viewVehicle(id: number): void {
    this.router.navigate([`/vehicle/${id}`]);
  }

  deleteVehicle(vehicleId: number) {
    this.vehicleService.getVehicleWithRepairs(vehicleId).subscribe(response => {
      if (response.repairs.length > 0) {
        const confirmDelete = confirm(response.message); 
        if (confirmDelete) {
          this.vehicleService.deleteVehicleAndRepairs(vehicleId).subscribe(() => {
            this.loadVehicles();
          });
        }
      } else {
        this.vehicleService.deleteVehicleAndRepairs(vehicleId).subscribe(() => {
          this.loadVehicles();
        });
      }
    });
  }
  
  goToCreateVehiclePage(): void {
    this.router.navigate(['/create-vehicle']);
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}

