import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../servicios/auth.service';
import { Router } from '@angular/router';
import { SidebarComponent } from '../../sidebar/sidebar.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule, SidebarComponent],
  templateUrl: './create-mechanic.component.html',
  styleUrls: ['./create-mechanic.component.css']
})
export class CreateMechanicComponent {
  name = '';
  email = '';
  password = '';
  hourly_rate = 0;
  image = '';
  role: 'admin' | 'mechanic' = 'mechanic'; 
  successMessage = '';
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  handleImageUpload(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => this.image = reader.result as string;
      reader.readAsDataURL(file);
    }
  }

  submit() {
    const user = {
      name: this.name,
      email: this.email,
      password: this.password,
      hourly_rate: this.hourly_rate,
      image: this.image,
      role: this.role
    };

    this.authService.register(user).subscribe({
      next: response => {
        console.log('Usuario registrado:', response);
        this.successMessage = 'Mecánico creado correctamente';
        this.clearForm();
        this.router.navigate(['/mechanics']);
      },
      error: err => {
        this.errorMessage = 'Error al crear el mecánico';
      }
    });
  }

  clearForm() {
    this.name = '';
    this.email = '';
    this.password = '';
    this.hourly_rate = 0;
    this.image = '';
    this.role = 'mechanic';
  }

  goBack() {
    this.router.navigate(['/mechanics']);
  }
}
