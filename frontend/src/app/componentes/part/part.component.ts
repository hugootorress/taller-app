import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PartService } from '../../servicios/part/part.service';
import { Part } from '../../modelos/part.model';
import { Router } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-part',
  standalone: true, 
  imports: [CommonModule, RouterModule, FormsModule, SidebarComponent],
  templateUrl: './part.component.html',
  styleUrls: ['./part.component.css']
})
export class PartComponent implements OnInit {
  parts: Part[] = [];
  filteredParts: Part[] = [];  
  successMessage: string = '';
  errorMessage: string = '';
  searchTerm: string = ''; 
  loading = true;


  constructor(private partService: PartService, private router: Router) {}

  ngOnInit(): void {
    this.loading = true;
    this.getParts();
  }

  getParts(): void {
    this.partService.getParts().subscribe({
      next: (data) => {
        this.parts = data;
        this.filteredParts = data; 
        this.loading = false;
        console.log(this.successMessage); 
      },
      error: (error) => {
        console.error('Error al obtener piezas', error);
        this.errorMessage = 'Hubo un error al cargar las piezas';
        this.loading = false;
        console.error(this.errorMessage); 
      }
    });

    setTimeout(() => {
      this.successMessage = '';
      this.errorMessage = '';
    }, 3000); 
  }

  searchParts(): void {
    if (this.searchTerm) {
      this.filteredParts = this.parts.filter(part => 
        part.name.toLowerCase().includes(this.searchTerm.toLowerCase()));
    } else {
      this.filteredParts = this.parts; 
    }
  }

  deletePart(id: string): void { 
    if (confirm('¿Estás seguro de que quieres eliminar esta pieza?')) {
      this.partService.deletePart(id).subscribe({
        next: () => {
          this.parts = this.parts.filter(part => part.id !== id);
          this.filteredParts = this.filteredParts.filter(part => part.id !== id);
          console.log('Pieza eliminada correctamente');
          this.successMessage = '';
        },
        error: (error) => {
          console.error('Error al eliminar pieza', error);
          this.errorMessage = 'Hubo un error al eliminar la pieza';
          console.error(this.errorMessage); 
        }
      });
    }

    setTimeout(() => {
      this.successMessage = '';
      this.errorMessage = '';
    }, 3000); 
  }

  goBack(): void {
    this.router.navigate(['/dashboard']); 
  }

  goToCreatePartPage(): void {
    this.router.navigate(['/create-part']); 
  }

  gotoDetailPartPage(id: string): void {
    this.router.navigate([`/part/${id}`]);
  }

  getStockClass(stock: number): string {
    if (stock <= 10) {
      return 'red'; 
    } else if (stock <= 20) {
      return 'yellow'; 
    } else {
      return 'green'; 
    }
  }
}
