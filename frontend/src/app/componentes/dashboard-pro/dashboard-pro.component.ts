import { Component, OnInit } from '@angular/core';
import { DashboardService, DashboardStats } from '../../servicios/dashboard/dashboard.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent} from '../sidebar/sidebar.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule,SidebarComponent],
  templateUrl: './dashboard-pro.component.html',
  styleUrls: ['./dashboard-pro.component.css']
})
export class DashboardProComponent implements OnInit {
  stats: DashboardStats | null = null;
  isAdmin = localStorage.getItem('mechanicIsAdmin') === 'true';
  constructor(private dashSvc: DashboardService) {}

  ngOnInit(): void {
    this.dashSvc.getStats().subscribe(data => this.stats = data);
  }
}
