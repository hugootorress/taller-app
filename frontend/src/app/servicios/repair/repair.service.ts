import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Repair } from '../../modelos/repair.model';

@Injectable({
  providedIn: 'root'
})
export class RepairService {
  private baseUrl = '/api/repairs';

  constructor(private http: HttpClient) {}

  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return token ? { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) } : {};
  }

  getRepairs(): Observable<Repair[]> {
    return this.http.get<Repair[]>(this.baseUrl, this.getAuthHeaders());
  }

  getRepair(id: number): Observable<Repair> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<Repair>(url, this.getAuthHeaders());
  }

  createRepair(repair: Repair): Observable<Repair> {
    return this.http.post<Repair>(this.baseUrl, repair, this.getAuthHeaders());
  }

  updateRepair(repair: Repair): Observable<Repair> {
    return this.http.put<Repair>(`${this.baseUrl}/${repair.id}`, repair, this.getAuthHeaders());
  }

  deleteRepair(id: number): Observable<void> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.delete<void>(url, this.getAuthHeaders());
  }

  getRepairsByVehicle(vehicleId: number): Observable<Repair[]> {
    return this.http.get<Repair[]>(`${this.baseUrl}/vehicle/${vehicleId}`, this.getAuthHeaders());
  }
}