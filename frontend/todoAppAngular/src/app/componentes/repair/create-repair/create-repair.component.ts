import { Component, OnInit } from '@angular/core';
import { RepairService } from '../../../servicios/repair/repair.service';
import { AuthService } from '../../../servicios/auth.service';
import { VehicleService } from '../../../servicios/vehicle/vehicle.service';
import { PartService } from '../../../servicios/part/part.service';
import { MechanicService } from '../../../servicios/mechanic/mechanic.service'; 
import { Router } from '@angular/router'; 
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../sidebar/sidebar.component';

@Component({
  selector: 'app-create-repair',
  standalone: true,
  imports: [CommonModule, FormsModule,SidebarComponent],
  templateUrl: './create-repair.component.html',
  styleUrls: ['./create-repair.component.css']
})
export class CreateRepairComponent implements OnInit {
  mechanics: any[] = [];
  vehicles: any[] = [];
  parts: any[] = [];
  repair: any = {
    mechanic_id: null,
    vehicle_id: null,
    description: '',
    repair_date: '',
    hours_spent: 0, 
    parts: []
  };
  loading: boolean = true;
  loadingText: string = 'Cargando datos disponibles';
  intervalId: any;

  constructor(
    private repairService: RepairService,
    private authService: AuthService,
    private vehicleService: VehicleService,
    private partService: PartService,
    private mechanicService: MechanicService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.startLoadingDots();
    this.loadMechanics();
    this.loadVehicles();
    this.loadParts();
  }

  loadMechanics(): void {
    this.mechanicService.getMechanics().subscribe((mechanics) => {
      this.mechanics = mechanics; 
      this.checkLoading(); 
    });
  }

  loadVehicles(): void {
    this.vehicleService.getVehicles().subscribe((vehicles) => {
      this.vehicles = vehicles;
      this.checkLoading();  
    });
  }

  loadParts(): void {
    this.partService.getParts().subscribe((parts) => {
      this.parts = parts;
      this.checkLoading(); 
    });
  }

  createRepair(): void {
    if (!this.repair.hours_spent) {
      this.repair.hours_spent = 0; 
    }
    this.repairService.createRepair(this.repair).subscribe((newRepair) => {
      console.log('Reparación creada', newRepair);
      this.router.navigate(['/repairs']);
    });
  }

  checkLoading(): void {
    if (this.mechanics.length > 0 && this.vehicles.length > 0 && this.parts.length > 0) {
      this.stopLoadingDots();
    }
  }

  startLoadingDots(): void {
    let dots = '';
    this.intervalId = setInterval(() => {
      dots = dots.length < 3 ? dots + '.' : '';
      this.loadingText = 'Cargando datos disponibles' + dots;
    }, 500);
  }

  stopLoadingDots(): void {
    this.loading = false;
    clearInterval(this.intervalId);
    this.loadingText = '';
  }

  goBack(): void {
    this.router.navigate(['/repairs']);
  }
}
