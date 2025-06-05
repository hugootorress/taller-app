import { Component, OnInit } from '@angular/core';
import { MechanicService } from '../../servicios/mechanic/mechanic.service';
import { Mechanic } from '../../modelos/mechanic.model';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-mechanic',
  standalone: true,
  imports: [CommonModule, FormsModule,SidebarComponent],
  templateUrl: './mechanic.component.html',
  styleUrls: ['./mechanic.component.css'],
})
export class MechanicComponent implements OnInit {
  mechanics: Mechanic[] = [];
  filteredMechanics: Mechanic[] = [];
  searchTerm: string = '';
  loading = true;
  successMessage = '';
  errorMessage = '';

  newMechanic: Mechanic = {
    id: 0,
    name: '',
    password: '',
    email: '',
    hourly_rate: 0,
    image: '',
    role: 'mechanic',
  };

  constructor(private mechanicService: MechanicService, private router: Router) {}

  ngOnInit(): void {
    this.loadMechanics();
  }

  loadMechanics(): void {
    this.mechanicService.getMechanics().subscribe({
      next: (data) => {
        this.mechanics = data;
        this.filteredMechanics = data;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Error al cargar mecánicos';
        this.loading = false;
      }
    });
  }

  searchMechanics(): void {
    this.filteredMechanics = this.mechanics.filter((mechanic) =>
      mechanic.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  viewMechanic(id: number): void {
    this.router.navigate([`/mechanic/${id}`]);
  }

  deleteMechanic(id: number): void {
    // Consultar reparaciones asociadas antes de eliminar
    this.mechanicService.getMechanic(id).subscribe({
      next: (mechanic) => {
        // Suponiendo que mechanic.repair_count o mechanic.repairs existe, si no, habría que hacer otra petición
        this.mechanicService.getRepairsByMechanic(id).subscribe({
          next: (repairs) => {
            const count = repairs.length;
            let confirmDelete = true;
            if (count > 0) {
              confirmDelete = confirm(`Este mecánico tiene ${count} reparaciones asociadas. ¿Seguro que quieres eliminarlo?`);
            } else {
              confirmDelete = confirm('¿Estás seguro de que deseas eliminar este mecánico?');
            }
            if (confirmDelete) {
              this.mechanicService.deleteMechanic(id).subscribe({
                next: () => {
                  this.loadMechanics();
                  console.log('Mecánico eliminado correctamente');
                  this.successMessage = '';
                  this.errorMessage = '';
                },
                error: () => {
                  this.errorMessage = 'Error al eliminar mecánico';
                  this.successMessage = '';
                },
              });
            }
          },
          error: () => {
            // Si no se pueden obtener reparaciones, preguntar igualmente
            const confirmDelete = confirm('¿Estás seguro de que deseas eliminar este mecánico?');
            if (confirmDelete) {
              this.mechanicService.deleteMechanic(id).subscribe({
                next: () => {
                  this.loadMechanics();
                  console.log('Mecánico eliminado correctamente');
                  this.successMessage = '';
                  this.errorMessage = '';
                },
                error: () => {
                  this.errorMessage = 'Error al eliminar mecánico';
                  this.successMessage = '';
                },
              });
            }
          }
        });
      },
      error: () => {
        this.errorMessage = 'No se pudo cargar el mecánico';
      }
    });
  }

  goToCreateMechanicPage(): void {
    this.router.navigate(['/create-mechanic']);
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}

