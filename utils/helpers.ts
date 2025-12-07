import { Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ExpenseType } from '@/types';

export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

export const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatDateTime = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatMonthYear = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
  });
};

export const getMonthsArray = (months: number = 6): { label: string; timestamp: number }[] => {
  const result = [];
  const now = new Date();
  
  for (let i = 0; i < months; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    result.push({
      label: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      timestamp: date.getTime(),
    });
  }
  
  return result.reverse();
};

export const pickImage = async (): Promise<string | null> => {
  try {
    // Request permissions
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permission to access media library was denied');
        return null;
      }
    }

    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      return result.assets[0].uri;
    }
    
    return null;
  } catch (error) {
    console.error('Error picking image:', error);
    return null;
  }
};

export const getExpenseTypeLabel = (type: ExpenseType): string => {
  const labels: Record<ExpenseType, string> = {
    fuel: 'Fuel',
    maintenance: 'Maintenance',
    insurance: 'Insurance',
    tax: 'Tax',
    other: 'Other',
  };
  
  return labels[type] || type;
};

export const getExpenseTypeIcon = (type: ExpenseType): string => {
  const icons: Record<ExpenseType, string> = {
    fuel: 'droplet',
    maintenance: 'wrench',
    insurance: 'shield',
    tax: 'landmark',
    other: 'more-horizontal',
  };
  
  return icons[type] || 'circle';
};

export const getVehicleTypeIcon = (type: string): string => {
  const icons: Record<string, string> = {
    petrol: 'fuel',
    diesel: 'fuel',
    electric: 'zap',
    hybrid: 'battery-charging',
  };
  
  return icons[type] || 'car';
};

export const truncateText = (text: string, maxLength: number): string => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const groupByMonth = <T extends { date: number }>(items: T[]): Record<string, T[]> => {
  const grouped: Record<string, T[]> = {};
  
  items.forEach(item => {
    const date = new Date(item.date);
    const key = `${date.getFullYear()}-${date.getMonth()}`;
    
    if (!grouped[key]) {
      grouped[key] = [];
    }
    
    grouped[key].push(item);
  });
  
  return grouped;
};

export const sortByDate = <T extends { date: number }>(items: T[], ascending: boolean = false): T[] => {
  return [...items].sort((a, b) => {
    return ascending ? a.date - b.date : b.date - a.date;
  });
};