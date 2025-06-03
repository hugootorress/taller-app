import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { VehicleService } from '../../../servicios/vehicle/vehicle.service';
import { ClientService } from '../../../servicios/client/client.service';
import { Vehicle } from '../../../modelos/vehicle.model';
import { Client } from '../../../modelos/client.model';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../../sidebar/sidebar.component';

@Component({
  selector: 'app-vehicle-detail',
  standalone: true,
  imports: [CommonModule, RouterModule,SidebarComponent],
  templateUrl: './vehicle-detail.component.html',
  styleUrls: ['./vehicle-detail.component.css']
})
export class VehicleDetailComponent implements OnInit {
  vehicle: Vehicle | null = null;
  client: Client | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private vehicleService: VehicleService,
    private clientService: ClientService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.vehicleService.getVehicle(id).subscribe({
      next: (v) => {
        this.vehicle = v;
        this.loadClient(v.client_id);
      },
      error: () => console.error('Error al cargar vehículo')
    });
  }

  loadClient(id: number): void {
    this.clientService.getClient(id).subscribe({
      next: (c) => this.client = c,
      error: () => console.error('Error al cargar cliente')
    });
  }

  goBack(): void {
    this.router.navigate(['/vehicles']);
  }
}
