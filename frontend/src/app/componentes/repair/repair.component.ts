import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RepairService } from '../../servicios/repair/repair.service';
import { VehicleService } from '../../servicios/vehicle/vehicle.service';
import { Repair } from '../../modelos/repair.model';
import { Vehicle } from '../../modelos/vehicle.model';
import { Router } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-repair',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent],
  templateUrl: './repair.component.html',
  styleUrls: ['./repair.component.css']
})
export class RepairComponent implements OnInit {
  repairs: Repair[] = [];
  filteredRepairs: Repair[] = [];
  vehicles: Vehicle[] = [];
  searchTerm = {
    description: '',
    date: '',
    vehicleModel: ''
  };
  selectedFilter: string = 'description'; 
  successMessage = '';
  errorMessage = '';
  loading = true;


  constructor(
    private repairService: RepairService,
    private vehicleService: VehicleService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadRepairs();
    this.loadVehicles();
  }

  loadRepairs(): void {
    this.repairService.getRepairs().subscribe({
      next: data => {
        console.log('Reparaciones cargadas:', data);
        this.repairs = data;
        this.filteredRepairs = data;
        this.loading = false;
      },
       error: () => {
      this.filteredRepairs = [];
      this.loading = false;
    }
    });
  }

  loadVehicles(): void {
    this.vehicleService.getVehicles().subscribe({
      next: data => {
        console.log('Vehículos cargados:', data);
        this.vehicles = data;
      },
      error: () => this.errorMessage = 'Error al cargar vehículos'
    });
  }

  getVehicleById(vehicleId: number): Vehicle | undefined {
    return this.vehicles.find(vehicle => vehicle.id === vehicleId);
  }

  onFilterChange(): void {
    this.searchTerm = {
      description: '',
      date: '',
      vehicleModel: ''
    };
    this.searchRepairs();
  }
  
  searchRepairs(): void {
    this.filteredRepairs = this.repairs.filter(repair => {
      let matchesDescription = true;
      let matchesDate = true;
      let matchesVehicleModel = true;
  
      if (this.selectedFilter === 'description') {
        matchesDescription = repair.description.toLowerCase().includes(this.searchTerm.description.toLowerCase());
      }
      if (this.selectedFilter === 'date' && this.searchTerm.date) {
        matchesDate = repair.repair_date.includes(this.searchTerm.date);
      }
      if (this.selectedFilter === 'vehicleModel' && this.searchTerm.vehicleModel) {
        const vehicle = this.getVehicleById(repair.vehicle_id);
        if (vehicle) {
          matchesVehicleModel = vehicle.model.toLowerCase().includes(this.searchTerm.vehicleModel.toLowerCase());
        } else {
          matchesVehicleModel = false; 
        }
      }
  
      return matchesDescription && matchesDate && matchesVehicleModel;
    });
  }

  viewRepair(id: number): void {
    this.router.navigate([`/repair/${id}`]);
  }

  deleteRepair(id: number): void {
    this.repairService.deleteRepair(id).subscribe({
      next: () => {
        this.loadRepairs();
        console.log('Reparación eliminada correctamente');
        this.successMessage = '';
        this.errorMessage = '';
      },
      error: () => {
        this.errorMessage = 'Error al eliminar reparación';
        this.successMessage = '';
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }

  goToCreateRepairPage(): void {
    this.router.navigate(['/create-repair']);
  }
}
