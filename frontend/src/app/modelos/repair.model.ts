export interface Repair {
    id?: number;
    mechanic_id: number;
    vehicle_id: number;
    client_id: number;
    description: string;
    repair_date: string;
    total_cost: number; 
    parts: any[];   // Cambiado de number[] a any[] para permitir objetos
    hours_spent: number; 
    mechanic?: any; // Añadido para que Angular reconozca mechanic en la respuesta
    vehicle?: any;  // Añadido para que Angular reconozca vehicle en la respuesta
  }
