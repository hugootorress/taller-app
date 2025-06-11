import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Client } from '../../modelos/client.model';
import { Repair } from '../../modelos/repair.model';
import { Vehicle } from '../../modelos/vehicle.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  private baseUrl = 'http://tallermatehtorres.zapto.org:8000/api/clients';

  constructor(private http: HttpClient) {}

  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return token ? { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) } : {};
  }

  getClients(): Observable<Client[]> {
    return this.http.get<Client[]>(this.baseUrl, this.getAuthHeaders());
  }

  getClient(id: number): Observable<Client> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<Client>(url, this.getAuthHeaders());
  }

  createClient(client: Client): Observable<Client> {
    return this.http.post<Client>(this.baseUrl, client, this.getAuthHeaders());
  }

  updateClient(client: Client): Observable<Client> {
    return this.http.put<Client>(`${this.baseUrl}/${client.id}`, client, this.getAuthHeaders());
  }

  deleteClient(id: number): Observable<void> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.delete<void>(url, this.getAuthHeaders());
  }

  getVehiclesByClientId(clientId: number): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(`http://localhost:8000/api/clients/${clientId}/vehicles`, this.getAuthHeaders());
  }

  getRepairsByVehicleId(vehicleId: number): Observable<Repair[]> {
    return this.http.get<Repair[]>(`http://localhost:8000/api/vehicles/${vehicleId}/repairs`, this.getAuthHeaders());
  }  
}