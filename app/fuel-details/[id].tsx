import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams, Stack } from 'expo-router';
import Colors from '@/constants/colors';
import { useFuelEntryStore } from '@/store/fuelEntryStore';
import { useVehicleStore } from '@/store/vehicleStore';
import { useSettingsStore } from '@/store/settingsStore';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { calculateFuelEfficiency, calculateCostPerDistance, formatCurrency, formatDistance, formatVolume } from '@/utils/calculations';
import { formatDate, formatDateTime } from '@/utils/helpers';
import { 
  Calendar, 
  Car, 
  Droplet, 
  Edit2, 
  MoreVertical, 
  Receipt, 
  Trash2, 
  TrendingUp,
  Wind,
  Zap
} from 'lucide-react-native';

export default function FuelDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { entries, getEntryById, getPreviousEntryByVehicleId, deleteEntry } = useFuelEntryStore();
  const { getVehicleById } = useVehicleStore();
  const { settings } = useSettingsStore();
  
  const [entry, setEntry] = useState(getEntryById(id));
  const [vehicle, setVehicle] = useState(entry ? getVehicleById(entry.vehicleId) : null);
  const [previousEntry, setPreviousEntry] = useState(
    entry ? getPreviousEntryByVehicleId(entry.vehicleId, entry.id) : null
  );
  
  useEffect(() => {
    const currentEntry = getEntryById(id);
    setEntry(currentEntry);
    
    if (currentEntry) {
      setVehicle(getVehicleById(currentEntry.vehicleId));
      setPreviousEntry(getPreviousEntryByVehicleId(currentEntry.vehicleId, currentEntry.id));
    }
  }, [id, entries]);
  
  if (!entry || !vehicle) {
    router.replace('/expenses' as any);
    return null;
  }
  
  const efficiency = previousEntry && entry.isFull && previousEntry.isFull
    ? calculateFuelEfficiency(entry, previousEntry, settings.distanceUnit, settings.volumeUnit)
    : null;
  
  const costPerDistance = previousEntry && entry.isFull && previousEntry.isFull
    ? calculateCostPerDistance(entry, previousEntry, settings.distanceUnit)
    : null;
  
  const handleDeleteEntry = () => {
    Alert.alert(
      'Delete Fuel Entry',
      'Are you sure you want to delete this fuel entry?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            try {
              deleteEntry(entry.id);
              // Navigate back
              router.replace('/');
            } catch (error) {
              console.error('Error deleting fuel entry:', error);
              Alert.alert('Error', 'Failed to delete fuel entry. Please try again.');
            }
          }
        },
      ]
    );
  };
  
  const getFuelTypeLabel = () => {
    if (vehicle.type === 'electric') return 'Electricity';
    
    switch (entry.fuelType) {
      case 'regular': return 'Regular';
      case 'premium': return 'Premium';
      case 'diesel': return 'Diesel';
      case 'electricity': return 'Electricity';
      case 'cng': return 'CNG';
      default: return 'Fuel';
    }
  };

  const getFuelTypeIcon = () => {
    switch (entry.fuelType) {
      case 'electricity': 
        return <Zap size={24} color={Colors.dark.tint} />;
      case 'cng':
        return <Wind size={24} color={Colors.dark.tint} />;
      default:
        return <Droplet size={24} color={Colors.dark.tint} />;
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen 
        options={{
          title: 'Fuel Entry Details',
          headerRight: () => (
            <TouchableOpacity onPress={handleDeleteEntry} style={styles.headerButton}>
              <Trash2 size={20} color={Colors.dark.danger} />
            </TouchableOpacity>
          ),
        }}
      />
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <Card style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <View>
              <Text style={styles.summaryLabel}>Total Cost</Text>
              <Text style={styles.summaryValue}>
                {formatCurrency(entry.totalCost, settings.currency)}
              </Text>
            </View>
            <View>
              <Text style={styles.summaryLabel}>Date</Text>
              <Text style={styles.summaryDate}>{formatDate(entry.date)}</Text>
            </View>
          </View>
        </Card>
        
        <Card title="Vehicle" style={styles.card}>
          <View style={styles.vehicleContainer}>
            {vehicle.image ? (
              <Image source={{ uri: vehicle.image }} style={styles.vehicleImage} />
            ) : (
              <View style={styles.vehicleImagePlaceholder}>
                <Car size={24} color={Colors.dark.text} />
              </View>
            )}
            <View style={styles.vehicleInfo}>
              <Text style={styles.vehicleName}>{vehicle.name}</Text>
              <Text style={styles.vehicleDetails}>
                {vehicle.make} {vehicle.model} {vehicle.year}
              </Text>
            </View>
          </View>
        </Card>
        
        <Card title="Fuel Details" style={styles.card}>
          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Amount</Text>
              <Text style={styles.detailValue}>
                {formatVolume(entry.amount, settings.volumeUnit)}
              </Text>
            </View>
            
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Price</Text>
              <Text style={styles.detailValue}>
                {formatCurrency(entry.price, settings.currency)}/{settings.volumeUnit}
              </Text>
            </View>
            
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Odometer</Text>
              <Text style={styles.detailValue}>
                {formatDistance(entry.odometer, settings.distanceUnit)}
              </Text>
            </View>
            
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Fuel Type</Text>
              <Text style={styles.detailValue}>{getFuelTypeLabel()}</Text>
            </View>
            
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Full Tank</Text>
              <Text style={styles.detailValue}>{entry.isFull ? 'Yes' : 'No'}</Text>
            </View>
            
            {previousEntry && (
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Distance Traveled</Text>
                <Text style={styles.detailValue}>
                  {formatDistance(entry.odometer - previousEntry.odometer, settings.distanceUnit)}
                </Text>
              </View>
            )}
          </View>
        </Card>
        
        {efficiency && costPerDistance && (
          <Card title="Efficiency" style={styles.card}>
            <View style={styles.efficiencyContainer}>
              <View style={styles.efficiencyItem}>
                <View style={styles.efficiencyIconContainer}>
                  <TrendingUp size={24} color={Colors.dark.tint} />
                </View>
                <Text style={styles.efficiencyValue}>
                  {efficiency} {settings.distanceUnit}/{settings.volumeUnit}
                </Text>
                <Text style={styles.efficiencyLabel}>Fuel Efficiency</Text>
              </View>
              
              <View style={styles.efficiencyItem}>
                <View style={[styles.efficiencyIconContainer, { backgroundColor: 'rgba(48, 209, 88, 0.1)' }]}>
                  <Droplet size={24} color={Colors.dark.success} />
                </View>
                <Text style={styles.efficiencyValue}>
                  {formatCurrency(costPerDistance, settings.currency)}/{settings.distanceUnit}
                </Text>
                <Text style={styles.efficiencyLabel}>Cost per Distance</Text>
              </View>
            </View>
          </Card>
        )}
        
        {entry.notes && (
          <Card title="Notes" style={styles.card}>
            <Text style={styles.notes}>{entry.notes}</Text>
          </Card>
        )}
        
        {entry.receiptImage && (
          <Card title="Receipt" style={styles.card}>
            <Image source={{ uri: entry.receiptImage }} style={styles.receiptImage} />
          </Card>
        )}
        
        <View style={styles.metaInfo}>
          <Text style={styles.metaText}>Created: {formatDateTime(entry.createdAt)}</Text>
          {entry.updatedAt !== entry.createdAt && (
            <Text style={styles.metaText}>Updated: {formatDateTime(entry.updatedAt)}</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  headerButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 24,
  },
  summaryCard: {
    marginBottom: 16,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.dark.tint,
  },
  summaryDate: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.dark.text,
  },
  card: {
    marginBottom: 16,
  },
  vehicleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vehicleImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
  },
  vehicleImagePlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: Colors.dark.cardAlt,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  vehicleInfo: {
    flex: 1,
  },
  vehicleName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.dark.text,
    marginBottom: 2,
  },
  vehicleDetails: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  detailItem: {
    width: '50%',
    marginBottom: 16,
  },
  detailLabel: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 16,
    color: Colors.dark.text,
    fontWeight: '500',
  },
  efficiencyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  efficiencyItem: {
    alignItems: 'center',
  },
  efficiencyIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(76, 217, 100, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  efficiencyValue: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.dark.text,
    marginBottom: 4,
  },
  efficiencyLabel: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
  },
  notes: {
    fontSize: 16,
    color: Colors.dark.text,
    lineHeight: 22,
  },
  receiptImage: {
    width: '100%',
    height: 300,
    borderRadius: 8,
    resizeMode: 'contain',
  },
  metaInfo: {
    marginTop: 8,
    marginBottom: 16,
  },
  metaText: {
    fontSize: 12,
    color: Colors.dark.textSecondary,
    marginBottom: 4,
  },
});