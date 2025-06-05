import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VehicleService } from '../../../servicios/vehicle/vehicle.service';
import { ClientService } from '../../../servicios/client/client.service';
import { Vehicle } from '../../../modelos/vehicle.model';
import { Client } from '../../../modelos/client.model';
import { Router } from '@angular/router';
import { SidebarComponent } from '../../sidebar/sidebar.component';

@Component({
  selector: 'app-create-vehicle',
  standalone: true,
  imports: [CommonModule, FormsModule,SidebarComponent],
  templateUrl: './create-vehicle.component.html',
  styleUrls: ['./create-vehicle.component.css']
})
export class CreateVehicleComponent implements OnInit {
  clients: Client[] = [];
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
  currentYear: number = new Date().getFullYear();

  constructor(
    private vehicleService: VehicleService,
    private clientService: ClientService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this.clientService.getClients().subscribe({
      next: data => this.clients = data,
      error: () => console.error('Error al cargar clientes')
    });
  }

  createVehicle(): void {
    this.vehicleService.createVehicle(this.newVehicle).subscribe({
      next: () => {
        this.successMessage = 'Vehículo creado correctamente';
        this.errorMessage = '';
        // Navega automáticamente al listado de vehículos
        this.router.navigate(['/vehicles']);
      },
      error: () => {
        this.errorMessage = 'Error al crear vehículo';
        this.successMessage = '';
        // Permanece en el formulario si hay error
      }
    });
  }

  onImageChange(event: any): void {
    const file = event.target.files[0];
    if (!file) return;
  
    if (!file.type.startsWith('image/')) {
      alert('Selecciona un archivo de imagen válido');
      return;
    }
  
    const reader = new FileReader();
    reader.onload = () => {
      this.newVehicle.image = reader.result as string; 
    };
    reader.readAsDataURL(file);
  }

  goBack(): void {
    this.router.navigate(['/vehicles']);
  }
}
