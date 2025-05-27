export interface Repair {
    id?: number;
    mechanic_id: number;
    vehicle_id: number;
    client_id: number;
    description: string;
    repair_date: string;
    total_cost: number; 
    parts: number[];   
    hours_spent: number; 
  }
  