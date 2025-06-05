import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Mechanic } from '../../modelos/mechanic.model';

@Injectable({
  providedIn: 'root',
})
export class MechanicService {
  private apiUrl = 'http://localhost:8000/api/mechanics';

  constructor(private http: HttpClient) {}

  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return token ? { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) } : {};
  }

  getMechanics(): Observable<Mechanic[]> {
    return this.http.get<Mechanic[]>(this.apiUrl, this.getAuthHeaders());
  }

  getMechanic(id: number): Observable<Mechanic> {
    return this.http.get<Mechanic>(`${this.apiUrl}/${id}`, this.getAuthHeaders());
  }

  createMechanic(mechanic: Mechanic): Observable<Mechanic> {
    return this.http.post<Mechanic>(this.apiUrl, mechanic, this.getAuthHeaders());
  }

  updateMechanic(id: number, mechanic: Mechanic): Observable<Mechanic> {
    return this.http.put<Mechanic>(`${this.apiUrl}/${id}`, mechanic, this.getAuthHeaders());
  }

  deleteMechanic(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, this.getAuthHeaders());
  }

  getRepairsByMechanic(mechanicId: number) {
    return this.http.get<any[]>(`http://localhost:8000/api/repairs/mechanic/${mechanicId}`, this.getAuthHeaders());
  }
}