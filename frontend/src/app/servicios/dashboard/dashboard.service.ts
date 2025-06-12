// src/app/services/dashboard.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DashboardStats {
  totalClients: number;
  totalVehicles: number;
  totalRepairs: number;
  monthlyRepairs: number;
  totalHours: number;
  avgHoursPerRep: number;
  totalRevenue: number;
  monthlyRevenue: number;
  avgCost: number;
  avgRepairsPerClient: number;
  lowStockParts: number;
  inventoryValue: number;
  avgPartMargin: number;
  topClients: { id: number; name: string; repairs_count: number }[];
  topVehicles: { id: number; license_plate: string; repairs_count: number }[];
  repairsByYear: { year: number; count: number }[];
}

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private url = '/api/stats';

  constructor(private http: HttpClient) {}

  getStats(): Observable<DashboardStats> {
    const token = localStorage.getItem('token');
    const headers = token
      ? new HttpHeaders({ Authorization: `Bearer ${token}` })
      : undefined;
    return this.http.get<DashboardStats>(this.url, { headers });
  }
}
