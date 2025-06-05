import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RepairService } from '../../../servicios/repair/repair.service';
import { VehicleService } from '../../../servicios/vehicle/vehicle.service';
import { MechanicService } from '../../../servicios/mechanic/mechanic.service';
import { IvaService } from '../../../servicios/iva.service';
import { Repair } from '../../../modelos/repair.model';
import { Vehicle } from '../../../modelos/vehicle.model';
import { Mechanic } from '../../../modelos/mechanic.model';
import { jsPDF } from 'jspdf';
import { SidebarComponent } from '../../sidebar/sidebar.component';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-repair-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, CurrencyPipe, SidebarComponent],
  templateUrl: './repair-detail.component.html',
  styleUrls: ['./repair-detail.component.css']
})
export class RepairDetailComponent implements OnInit {
  repair: Repair | null = null;
  vehicle: Vehicle | null = null;
  mechanic: Mechanic | null = null;
  ivaPercent: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private repairService: RepairService,
    private vehicleService: VehicleService,
    private mechanicService: MechanicService,
    private ivaService: IvaService
  ) {
    this.ivaPercent = this.ivaService.getIva();
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    console.log(id);
    if (id) this.getRepairDetail(Number(id));
    
  }

  getRepairDetail(id: number): void {
    this.repairService.getRepair(id).subscribe({
      next: (repair) => {
        console.log(repair);
        this.repair = repair;
        console.log(this.repair.parts);
        this.loadRelatedData(repair);
      },
      error: (err) => console.error('Error al obtener reparación', err)
    });
  }

  loadRelatedData(repair: Repair): void {
    if (repair.vehicle_id) {
      this.vehicleService.getVehicle(repair.vehicle_id).subscribe({
        next: (vehicle) => this.vehicle = vehicle,
        error: (err) => console.error('Error al obtener vehículo', err)
      });
    }
    if (repair.mechanic_id) {
      this.mechanicService.getMechanics().subscribe({
        next: (mechanics) => {
          this.mechanic = mechanics.find(m => m.id === repair.mechanic_id) ?? null;
        },
        error: (err) => console.error('Error al obtener mecánico', err)
      });
    }
  }

  printInvoice(): void {
    if (this.repair && this.vehicle && this.mechanic) {
      const doc = new jsPDF();
  
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(22);
      doc.setTextColor(13, 71, 161);
      doc.text('Factura de Reparación', 20, 20);
  
      doc.setFontSize(11);
      doc.setTextColor(0, 0, 0);
      doc.text('TallerMate - Gestión de Talleres', 20, 30);
      doc.text('Calle Ficticia, 123 - Ciudad', 20, 35);
      doc.text('Tel: 123 456 789 | Email: info@tallermate.com', 20, 40);
  
      doc.line(20, 45, 190, 45);
  
      // Vehículo
      doc.setFontSize(13);
      doc.setTextColor(33, 33, 33);
      doc.text('Datos del Vehículo:', 20, 55);
  
      doc.setFontSize(11);
      doc.setTextColor(0, 0, 0);
      doc.text(`${this.vehicle.model} (${this.vehicle.year}) - Matrícula: ${this.vehicle.license_plate}`, 20, 62);
  
      // Mecánico
      doc.setFontSize(13);
      doc.setTextColor(33, 33, 33);
      doc.text('Mecánico:', 20, 75);
  
      doc.setFontSize(11);
      doc.setTextColor(0, 0, 0);
      doc.text(`${this.mechanic.name} - ${this.mechanic.email}`, 20, 82);
      doc.text(`Tarifa por hora: ${this.mechanic.hourly_rate} €`, 20, 88);
  
      doc.line(20, 95, 190, 95);
  
      // Reparación
      doc.setFontSize(13);
      doc.setTextColor(33, 33, 33);
      doc.text('Detalles de la reparación:', 20, 105);
  
      doc.setFontSize(11);
      doc.setTextColor(0, 0, 0);
      doc.text(this.repair.description ?? 'Sin descripción', 20, 112);
  
      doc.setFontSize(13);
      doc.setTextColor(33, 33, 33);
      doc.text('Fecha de la reparación:', 20, 125);
  
      doc.setFontSize(11);
      doc.setTextColor(0, 0, 0);
      const repairDate = new Date(this.repair.repair_date).toLocaleDateString();
      doc.text(repairDate ?? 'Sin fecha', 20, 132);
  
      // Tabla de piezas
      const tableStartY = 145;
      autoTable(doc, {
        startY: tableStartY,
        head: [['Piezas Utilizadas', 'Precio']],  
        body: this.repair.parts.map((part: any) => [`${part.name}`, `${parseFloat(part.sale_price).toFixed(2)} €`]),
        theme: 'striped',
        headStyles: {
          fillColor: [13, 71, 161],
          textColor: 255,
          fontStyle: 'bold',
          halign: 'center'
        },
        bodyStyles: {
          halign: 'center',
          fontSize: 11
        }
      });
  
      // Explicación del cálculo 
      const totalCalculationY = tableStartY + (this.repair.parts.length * 10) + 10;
      doc.setFontSize(12);
      doc.setTextColor(33, 33, 33);
      doc.text('Cálculo del Coste Total:', 20, totalCalculationY);
  
      doc.setFontSize(11);
      doc.setTextColor(0, 0, 0);
      const partsTotal = this.repair.parts.reduce((acc: number, part: any) => acc + parseFloat(part.sale_price), 0);
      const laborCost = this.repair.hours_spent * this.mechanic.hourly_rate;
      const totalCost = partsTotal + laborCost;
      const iva = (totalCost * this.ivaPercent) / 100;
      const totalConIva = totalCost + iva;
      doc.text(`Total Piezas: ${partsTotal.toFixed(2)} €`, 20, totalCalculationY + 8);
      doc.text(`Mano de obra (${this.repair.hours_spent} horas x ${this.mechanic.hourly_rate} €): ${laborCost.toFixed(2)} €`, 20, totalCalculationY + 16);
      doc.text(`Coste Total: ${totalCost.toFixed(2)} €`, 20, totalCalculationY + 24);
      doc.text(`+ IVA (${this.ivaPercent}%): ${iva.toFixed(2)} €`, 20, totalCalculationY + 32);
      doc.text(`Total con IVA: ${totalConIva.toFixed(2)} €`, 20, totalCalculationY + 40);
  
      // Pie de página
      const finalY = totalCalculationY + 40;
      doc.setFontSize(10);
      doc.setTextColor(150);
      doc.text('Factura generada automáticamente por TallerMate', 20, finalY + 15);
  
      doc.save(`factura_${this.repair.id}.pdf`);
    }
  }

  goBack(): void {
    window.history.back();
  }

  getTotalWithIva(total: any, iva: number): string {
    const num = Number(total);
    if (isNaN(num)) return '-';
    const totalConIva = num + (num * iva / 100);
    return totalConIva.toFixed(2);
  }
}



