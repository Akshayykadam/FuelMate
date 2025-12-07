import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Vehicle } from '@/types';
import { generateId } from '@/utils/helpers';

interface VehicleState {
  vehicles: Vehicle[];
  selectedVehicleId: string | null;
  addVehicle: (vehicle: Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateVehicle: (id: string, updates: Partial<Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'>>) => void;
  deleteVehicle: (id: string) => void;
  selectVehicle: (id: string | null) => void;
  getVehicleById: (id: string) => Vehicle | undefined;
}

export const useVehicleStore = create<VehicleState>()(
  persist(
    (set, get) => ({
      vehicles: [],
      selectedVehicleId: null,
      
      addVehicle: (vehicleData) => {
        const id = generateId();
        const timestamp = Date.now();
        
        const newVehicle: Vehicle = {
          id,
          ...vehicleData,
          createdAt: timestamp,
          updatedAt: timestamp,
        };
        
        set((state) => ({
          vehicles: [...state.vehicles, newVehicle],
          selectedVehicleId: state.selectedVehicleId || id, // Select this vehicle if none selected
        }));
        
        return id;
      },
      
      updateVehicle: (id, updates) => {
        set((state) => ({
          vehicles: state.vehicles.map((vehicle) => 
            vehicle.id === id
              ? { ...vehicle, ...updates, updatedAt: Date.now() }
              : vehicle
          ),
        }));
      },
      
      deleteVehicle: (id) => {
        set((state) => {
          const newVehicles = state.vehicles.filter((vehicle) => vehicle.id !== id);
          const newSelectedId = state.selectedVehicleId === id
            ? (newVehicles.length > 0 ? newVehicles[0].id : null)
            : state.selectedVehicleId;
            
          return {
            vehicles: newVehicles,
            selectedVehicleId: newSelectedId,
          };
        });
      },
      
      selectVehicle: (id) => {
        set({ selectedVehicleId: id });
      },
      
      getVehicleById: (id) => {
        return get().vehicles.find((vehicle) => vehicle.id === id);
      },
    }),
    {
      name: 'fuelmate-vehicles',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);