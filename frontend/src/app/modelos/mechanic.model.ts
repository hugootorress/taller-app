export interface Mechanic {
  id: number;
  name: string;
  password: string;
  email: string;
  hourly_rate: number;
  image: string;
  role: 'admin' | 'mechanic';
}
