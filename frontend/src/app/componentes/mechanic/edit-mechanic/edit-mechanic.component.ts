import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MechanicService } from '../../../servicios/mechanic/mechanic.service';
import { Mechanic } from '../../../modelos/mechanic.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../sidebar/sidebar.component';

@Component({
  selector: 'app-edit-mechanic',
  templateUrl: './edit-mechanic.component.html',
  standalone: true,
  imports: [FormsModule, CommonModule, SidebarComponent],
  styleUrls: ['./edit-mechanic.component.css']
})
export class EditMechanicComponent implements OnInit {
  mechanicId: string | null = null;
  mechanic: Mechanic = { id: 0, name: '', password: '', email: '', hourly_rate: 0, image: '', role: 'mechanic' };
  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private mechanicService: MechanicService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.mechanicId = this.route.snapshot.paramMap.get('id');
    if (this.mechanicId) {
      this.getMechanicDetails(this.mechanicId);
    }
  }

  getMechanicDetails(id: string): void {
    this.mechanicService.getMechanic(parseInt(id)).subscribe(
      (data) => {
        this.mechanic = data;
      },
      () => {
        this.errorMessage = 'No se pudo cargar el mecánico.';
      }
    );
  }

  updateMechanic(): void {
    this.mechanicService.updateMechanic(this.mechanic.id, this.mechanic).subscribe({
      next: () => {
        this.successMessage = 'Mecánico actualizado con éxito.';
        this.router.navigate(['/mechanics']);
      },
      error: () => {
        this.errorMessage = 'Error al actualizar el mecánico.';
      }
    });
  }

  handleImageUpload(event: any) {
    const file = event.target.files[0];
    if (file) {
      const maxSizeMB = 2;
      if (file.size > maxSizeMB * 1024 * 1024) {
        this.errorMessage = 'Imagen subida que pesa mucho (máx. 2MB)';
        return;
      }
      const reader = new FileReader();
      reader.onload = () => this.mechanic.image = reader.result as string;
      reader.readAsDataURL(file);
    }
  }
  goBack(): void {
    this.router.navigate(['/mechanics']);
  }
}