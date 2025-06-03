import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PartService } from '../../../servicios/part/part.service';
import { Part } from '../../../modelos/part.model';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../sidebar/sidebar.component';

@Component({
  selector: 'app-part-detail',
  standalone: true,
  imports: [CommonModule,SidebarComponent],
  templateUrl: './part-detail.component.html',
  styleUrls: ['./part-detail.component.css']
})
export class PartDetailComponent implements OnInit {
  part: Part | null = null;
  errorMessage: string = '';

  constructor(
    private partService: PartService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const partId = this.route.snapshot.paramMap.get('id');
    if (partId) {
      this.getPartDetail(Number(partId));
    }
  }

  getPartDetail(id: number): void {
    this.partService.getPart(id).subscribe({
      next: (data) => {
        this.part = data;
      },
      error: () => {
        this.errorMessage = 'Error al obtener la pieza';
      }
    });
  }

  printPartDetails(): void {
    if (this.part) {
      const doc = new jsPDF();

      doc.setFont('Arial', 'bold');
      doc.setTextColor(7, 65, 173);
      doc.setFontSize(22);
      doc.text('Ficha de la Pieza', 20, 20);

      doc.setFontSize(14);
      doc.text('Detalles de la pieza', 20, 40);

      autoTable(doc, {
        startY: 50,
        head: [['Descripción', 'Valor']],
        body: [
          ['ID', this.part.id.toString()],
          ['Nombre', this.part.name],
          ['Precio', `${this.part.price} €`],
          ['Stock', this.part.stock.toString()],
          ['Margen de Beneficio', `${this.part.profit_margin} %`],
        ],
        theme: 'grid',
        styles: {
          fontSize: 12,
          cellPadding: 4,
          valign: 'middle',
          halign: 'center',
        },
        headStyles: {
          fillColor: [7, 65, 173],
          textColor: [255, 255, 255],
          fontStyle: 'bold'
        },
        bodyStyles: {
          fillColor: [240, 240, 240],
          textColor: [0, 0, 0],
        },
      });

      doc.setFontSize(12);
      doc.text('Generado por el sistema de gestión TallerMate', 20, doc.internal.pageSize.height - 20);

      doc.save(`${this.part.name}_ficha.pdf`);
    }
  }

  goToEditPage(): void {
    if (this.part) {
      this.router.navigate(['/edit-part', this.part.id]);
    }
  }

  goBack(): void {
    this.router.navigate(['/parts']);
  }
}