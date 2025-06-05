// Servicio para gestionar el IVA de la app
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class IvaService {
  private ivaKey = 'ivaPercent';
  private defaultIva = 21;

  getIva(): number {
    const stored = localStorage.getItem(this.ivaKey);
    return stored ? parseFloat(stored) : this.defaultIva;
  }

  setIva(percent: number) {
    localStorage.setItem(this.ivaKey, percent.toString());
  }
}
