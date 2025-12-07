export type Vehicle = {
  id: string;
  name: string;
  type: 'petrol' | 'diesel' | 'electric' | 'hybrid' | 'cng' | 'bike' | 'petrol_cng';
  vehicleClass?: 'car' | 'bike';
  make: string;
  model: string;
  year: number;
  image?: string;
  tankCapacity?: number; // in liters
  cngTankCapacity?: number; // in kg
  batteryCapacity?: number; // in kWh for electric vehicles
  initialOdometer: number;
  createdAt: number;
  updatedAt: number;
};

export type FuelEntry = {
  id: string;
  vehicleId: string;
  date: number;
  amount: number; // liters or kWh
  price: number; // per unit
  odometer: number;
  fuelType?: 'regular' | 'premium' | 'diesel' | 'electricity' | 'cng';
  totalCost: number;
  receiptImage?: string;
  isFull: boolean;
  notes?: string;
  createdAt: number;
  updatedAt: number;
};

export type ExpenseType = 'fuel' | 'maintenance' | 'insurance' | 'tax' | 'other';

export type Expense = {
  id: string;
  vehicleId: string;
  type: ExpenseType;
  amount: number;
  date: number;
  description: string;
  receiptImage?: string;
  createdAt: number;
  updatedAt: number;
};

export type DistanceUnit = 'km' | 'mi';
export type VolumeUnit = 'l' | 'gal';
export type Currency = 'INR' | 'USD' | 'EUR' | 'GBP' | 'JPY' | 'CAD' | 'AUD';

export type Settings = {
  currency: Currency;
  distanceUnit: DistanceUnit;
  volumeUnit: VolumeUnit;
  userName?: string;
  userImage?: string;
  theme: 'dark';
};

export type FuelEfficiency = {
  date: number;
  efficiency: number; // km/l, mi/gal, km/kWh
  cost: number; // cost per distance unit
};

export type MonthlyStats = {
  month: string;
  year: number;
  totalCost: number;
  totalFuel: number;
  totalDistance: number;
  efficiency: number | null;
  costPerDistance: number | null;
  timestamp: number;
};