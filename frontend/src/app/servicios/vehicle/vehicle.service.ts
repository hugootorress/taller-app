import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Vehicle } from '../../modelos/vehicle.model';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {
  private baseUrl = 'http://localhost:8000/api/vehicles';

  constructor(private http: HttpClient) {}

  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return token ? { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) } : {};
  }

  getVehicles(): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(this.baseUrl, this.getAuthHeaders());
  }

  getVehicle(id: number): Observable<Vehicle> {
    return this.http.get<Vehicle>(`${this.baseUrl}/${id}`, this.getAuthHeaders());
  }

  createVehicle(vehicle: Vehicle): Observable<Vehicle> {
    return this.http.post<Vehicle>(this.baseUrl, vehicle, this.getAuthHeaders());
  }

  updateVehicle(vehicle: Vehicle): Observable<Vehicle> {
    return this.http.put<Vehicle>(`${this.baseUrl}/${vehicle.id}`, vehicle, this.getAuthHeaders());
  }

  getVehicleWithRepairs(id: number) {
    return this.http.get<{ message: string, repairs: any[] }>(`${this.baseUrl}/${id}/with-repairs`, this.getAuthHeaders());
  }
  
  deleteVehicleAndRepairs(id: number) {
    return this.http.delete(`${this.baseUrl}/${id}/delete-and-repairs`, this.getAuthHeaders());
  }
  
  deleteVehicle(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`, this.getAuthHeaders());
  }
}