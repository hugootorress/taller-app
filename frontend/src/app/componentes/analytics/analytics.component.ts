import { Component, OnInit } from '@angular/core';
import { RepairService } from '../../servicios/repair/repair.service';
import { ChartData, ChartOptions, ChartType } from 'chart.js';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgChartsModule } from 'ng2-charts';
import { Router } from '@angular/router';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, RouterModule, NgChartsModule],
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css']
})
export class AnalyticsComponent implements OnInit {
  totalRevenue: number = 0;
  revenueByDate: { date: string, revenue: number }[] = [];
  isLoading: boolean = true;
  selectedPeriod: string = 'lastMonth'; 

  public lineChartData: ChartData<'line'> = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Ingresos por Fecha',
        fill: false,
        borderColor: '#42A5F5',
        tension: 0.1
      }
    ]
  };
  
  
  public lineChartOptions: ChartOptions = {
    responsive: true,
  };
  public lineChartLegend = true;
  public lineChartType: ChartType = 'line';
  public lineChartPlugins = [];

  constructor(private router: Router, private repairService: RepairService) {}

  ngOnInit(): void {
    this.loadRevenueData();
  }

  loadRevenueData(): void {
    this.repairService.getRepairs().subscribe(repairs => {
      const filteredRepairs = this.filterRepairsByPeriod(repairs, this.selectedPeriod);
      const groupedByDate = this.groupRepairsByDate(filteredRepairs);
  
      this.revenueByDate = groupedByDate.map(group => {
        const revenue = group.repairs.reduce((sum, repair) => {
          return sum + (repair.total_cost || 0);  
        }, 0);
  
        return { date: group.date, revenue };
      });
  
      this.totalRevenue = this.revenueByDate.reduce((sum, entry) => sum + entry.revenue, 0);
  
      this.prepareChartData();
      this.isLoading = false;  
    });
  }
  
  

  filterRepairsByPeriod(repairs: any[], period: string): any[] {
    const now = new Date();
    return repairs.filter(repair => {
      const repairDate = new Date(repair.repair_date);
      if (period === 'lastMonth') {
        return repairDate.getMonth() === now.getMonth() && repairDate.getFullYear() === now.getFullYear();
      } else if (period === 'lastYear') {
        return repairDate.getFullYear() === now.getFullYear();
      }
      return false;
    });
  }

  groupRepairsByDate(repairs: any[]): { date: string, repairs: any[] }[] {
    const grouped: { [key: string]: any[] } = {};

    repairs.forEach(repair => {
      const date = new Date(repair.repair_date).toLocaleDateString(); 
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(repair);
    });

    return Object.keys(grouped).map(date => ({ date, repairs: grouped[date] }));
  }

  prepareChartData(): void {
    this.lineChartData = {
      labels: this.revenueByDate.map(entry => entry.date).reverse(),
      datasets: [
        {
          data: this.revenueByDate.map(entry => entry.revenue).reverse(), 
          label: 'Ingresos por Fecha',
          fill: false,
          borderColor: '#42A5F5',
          tension: 0.1
        }
      ]
    };
  }
  
  goBack(): void {
    this.router.navigate(['/dashboard']);
  }

  onPeriodChange(period: string): void {
    this.selectedPeriod = period;
    this.loadRevenueData(); 
  }
}
