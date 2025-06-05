import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RepairService } from '../../../servicios/repair/repair.service';
import { Repair } from '../../../modelos/repair.model';
import { PartService } from '../../../servicios/part/part.service';
import { Part } from '../../../modelos/part.model';
import { MechanicService } from '../../../servicios/mechanic/mechanic.service';
import { Mechanic } from '../../../modelos/mechanic.model';
import { VehicleService } from '../../../servicios/vehicle/vehicle.service';
import { Vehicle } from '../../../modelos/vehicle.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../sidebar/sidebar.component';

@Component({
  selector: 'app-edit-repair',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent],
  templateUrl: './edit-repair.component.html',
  styleUrls: ['./edit-repair.component.css']
})
export class EditRepairComponent implements OnInit {
  repairId: string | null = null;
  repair: Repair = {
    id: 0,
    description: '',
    total_cost: 0,
    mechanic_id: 0,
    parts: [],
    vehicle_id: 0,
    client_id: 0,
    repair_date: '',
    hours_spent: 0  
  };

  parts: Part[] = [];
  mechanics: Mechanic[] = [];
  vehicles: Vehicle[] = []; 
  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private repairService: RepairService,
    private partService: PartService,
    private mechanicService: MechanicService,
    private vehicleService: VehicleService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.repairId = this.route.snapshot.paramMap.get('id');
    if (this.repairId) {
      this.loadParts();
      this.loadMechanics();
      this.loadVehicles(); 
      this.getRepairDetails(this.repairId);
    }
  }

  loadParts(): void {
    this.partService.getParts().subscribe(
      (data: Part[]) => {
        this.parts = data;
      },
      () => {
        this.errorMessage = 'No se pudieron cargar las piezas.';
      }
    );
  }

  loadMechanics(): void {
    this.mechanicService.getMechanics().subscribe(
      (data: Mechanic[]) => {
        this.mechanics = data;
      },
      () => {
        this.errorMessage = 'No se pudieron cargar los mecánicos.';
      }
    );
  }

  loadVehicles(): void {
    this.vehicleService.getVehicles().subscribe(
      (data: Vehicle[]) => {
        this.vehicles = data;
      },
      () => {
        this.errorMessage = 'No se pudieron cargar los vehículos.';
      }
    );
  }

  getRepairDetails(id: string): void {
    this.repairService.getRepair(parseInt(id)).subscribe(
      (data) => {
        this.repair = {
          ...data,
          hours_spent: data.hours_spent || 0 
        };
      },
      () => {
        this.errorMessage = 'No se pudo cargar la reparación.';
      }
    );
  }

  updateRepair(): void {
    this.repair.mechanic_id = Number(this.repair.mechanic_id);
    this.repair.vehicle_id = Number(this.repair.vehicle_id);
    this.repair.hours_spent = Number(this.repair.hours_spent);
    // Eliminar el campo total_cost antes de enviar
    const { total_cost, ...repairToSend } = this.repair;
    this.repairService.updateRepair(repairToSend as Repair).subscribe({
      next: (updatedRepair) => {
        console.log('Reparación actualizada', updatedRepair);
        this.router.navigate(['/repairs']);
      },
      error: (error) => {
        console.error('Error al actualizar la reparación', error);
        this.errorMessage = 'Error al actualizar la reparación';
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/repairs']);
  }
}
