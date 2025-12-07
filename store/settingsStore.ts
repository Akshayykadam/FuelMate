import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Currency, DistanceUnit, Settings, VolumeUnit } from '@/types';

interface SettingsState {
  settings: Settings;
  setSettings: (settings: Partial<Settings>) => void;
  setCurrency: (currency: Currency) => void;
  setDistanceUnit: (unit: DistanceUnit) => void;
  setVolumeUnit: (unit: VolumeUnit) => void;
  setUserName: (name: string) => void;
  setUserImage: (imageUri: string) => void;
}

const defaultSettings: Settings = {
  currency: 'INR',
  distanceUnit: 'km',
  volumeUnit: 'l',
  theme: 'dark',
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      settings: defaultSettings,
      
      setSettings: (newSettings) => 
        set((state) => ({ 
          settings: { ...state.settings, ...newSettings } 
        })),
      
      setCurrency: (currency) => 
        set((state) => ({ 
          settings: { ...state.settings, currency } 
        })),
      
      setDistanceUnit: (distanceUnit) => 
        set((state) => ({ 
          settings: { ...state.settings, distanceUnit } 
        })),
      
      setVolumeUnit: (volumeUnit) => 
        set((state) => ({ 
          settings: { ...state.settings, volumeUnit } 
        })),
      
      setUserName: (userName) => 
        set((state) => ({ 
          settings: { ...state.settings, userName } 
        })),
      
      setUserImage: (userImage) => 
        set((state) => ({ 
          settings: { ...state.settings, userImage } 
        })),
    }),
    {
      name: 'fuelmate-settings',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);