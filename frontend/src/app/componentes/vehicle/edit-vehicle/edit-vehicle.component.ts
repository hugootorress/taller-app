import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VehicleService } from '../../../servicios/vehicle/vehicle.service'; 
import { Vehicle } from '../../../modelos/vehicle.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ClientService } from '../../../servicios/client/client.service';
import { Client } from '../../../modelos/client.model';
import { SidebarComponent } from '../../sidebar/sidebar.component';

@Component({
  selector: 'app-edit-vehicle',
  templateUrl: './edit-vehicle.component.html',
  standalone: true,
  imports: [FormsModule, CommonModule,SidebarComponent],
  styleUrls: ['./edit-vehicle.component.css']
})
export class EditVehicleComponent implements OnInit {
  vehicleId: string | null = null;
  vehicle: Vehicle = { id: 0, license_plate: '', model: '', year: 0, client_id: 0, image: '' };
  clients: Client[] = [];
  successMessage: string = '';
  errorMessage: string = '';
  currentYear: number = new Date().getFullYear();

  constructor(
    private route: ActivatedRoute,
    private vehicleService: VehicleService,
    private clientService: ClientService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.vehicleId = this.route.snapshot.paramMap.get('id');
    this.loadClients(); 
    if (this.vehicleId) {
      this.getVehicleDetails(this.vehicleId);
    }
  }

  loadClients(): void {
    this.clientService.getClients().subscribe(
      (data: Client[]) => {
        this.clients = data;
      },
      () => {
        this.errorMessage = 'No se pudieron cargar los clientes.';
      }
    );
  }

  getVehicleDetails(id: string): void {
    this.vehicleService.getVehicle(parseInt(id)).subscribe(
      (data) => {
        this.vehicle = data;
      },
      () => {
        this.errorMessage = 'No se pudo cargar el vehículo.';
      }
    );
  }

  updateVehicle(): void {
    this.vehicleService.updateVehicle(this.vehicle).subscribe({
      next: () => {
        this.successMessage = 'Vehículo actualizado con éxito.';
        this.router.navigate(['/vehicles']);
      },
      error: () => {
        this.errorMessage = 'Error al actualizar el vehículo.';
      }
    });
  }

  onImageChange(event: any): void {
    const file = event.target.files?.[0];
    if (!file) return;
  
    if (!file.type.startsWith('image/')) {
      alert('Selecciona un archivo de imagen válido');
      return;
    }
  
    const reader = new FileReader();
    reader.onload = () => {
      this.vehicle.image = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  goBack() {
    this.router.navigate(['/vehicles']);
  }
}

