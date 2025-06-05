import { Component, OnInit } from '@angular/core';
import { DashboardService, DashboardStats } from '../../servicios/dashboard/dashboard.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent} from '../sidebar/sidebar.component';
import { IvaService } from '../../servicios/iva.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent, FormsModule],
  templateUrl: './dashboard-pro.component.html',
  styleUrls: ['./dashboard-pro.component.css']
})
export class DashboardProComponent implements OnInit {
  stats: DashboardStats | null = null;
  isAdmin = localStorage.getItem('mechanicIsAdmin') === 'true';
  ivaPercent: number;

  constructor(private dashSvc: DashboardService, private ivaService: IvaService) {
    this.ivaPercent = this.ivaService.getIva();
  }

  ngOnInit(): void {
    this.dashSvc.getStats().subscribe(data => this.stats = data);
    this.ivaPercent = this.ivaService.getIva();
  }

  onIvaChange(newIva: number) {
    this.ivaService.setIva(newIva);
    this.ivaPercent = newIva;
  }
}
