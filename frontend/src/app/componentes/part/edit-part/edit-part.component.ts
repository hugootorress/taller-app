import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PartService } from '../../../servicios/part/part.service';
import { Part } from '../../../modelos/part.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../sidebar/sidebar.component';

@Component({
  selector: 'app-edit-part',
  templateUrl: './edit-part.component.html',
  standalone: true,
  imports: [FormsModule, CommonModule, SidebarComponent],
  styleUrls: ['./edit-part.component.css']
})
export class EditPartComponent implements OnInit {
  partId: string | null = null;
  part: Part = { id: '', name: '', price: 0, stock: 0, profit_margin: 0 };
  successMessage: string = '';
  errorMessage: string = '';
  showProfitMargin = false;

  constructor(
    private route: ActivatedRoute,
    private partService: PartService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.partId = this.route.snapshot.paramMap.get('id');
    if (this.partId) {
      this.getPartDetails(this.partId);
    }
  }

  getPartDetails(id: string): void {
    this.partService.getPart(Number(id)).subscribe(
      (data) => {
        this.part = data;
        this.showProfitMargin = !!(this.part.profit_margin && this.part.profit_margin > 0);
      },
      () => {
        this.errorMessage = 'No se pudo cargar la pieza.';
      }
    );
  }

  updatePart(): void {
    if (!this.showProfitMargin) {
      this.part.profit_margin = 0;
    }
    this.partService.updatePart(Number(this.part.id), this.part).subscribe({
      next: () => {
        this.successMessage = 'Pieza actualizada con éxito.';
        this.router.navigate(['/parts']);
      },
      error: () => {
        this.errorMessage = 'Error al actualizar la pieza.';
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/parts']);
  }
}