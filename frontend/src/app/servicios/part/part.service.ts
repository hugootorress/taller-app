import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Part } from '../../modelos/part.model';

@Injectable({
  providedIn: 'root'
})
export class PartService {
private apiUrl = '/api/parts';

  constructor(private http: HttpClient) {}

  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return token ? { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) } : {};
  }

  getParts(): Observable<Part[]> {
    return this.http.get<Part[]>(this.apiUrl, this.getAuthHeaders());
  }

  getPart(id: number): Observable<Part> {
    return this.http.get<Part>(`${this.apiUrl}/${id}`, this.getAuthHeaders());
  }

  addPart(part: Part): Observable<Part> {
    return this.http.post<Part>(this.apiUrl, part, this.getAuthHeaders());
  }

  updatePart(id: number, part: Part): Observable<Part> {
    return this.http.put<Part>(`${this.apiUrl}/${id}`, part, this.getAuthHeaders());
  }

  deletePart(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, this.getAuthHeaders());
  }
}