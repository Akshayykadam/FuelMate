import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { Vehicle } from '@/types';
import Colors from '@/constants/colors';
import { Car, Droplet, Zap, BatteryCharging, Wind, Bike } from 'lucide-react-native';
import Card from './Card';
import { useSettingsStore } from '@/store/settingsStore';
import { useFuelEntryStore } from '@/store/fuelEntryStore';
import { calculateFuelEfficiency, formatCurrency, formatDistance } from '@/utils/calculations';
import { formatDate } from '@/utils/helpers';

interface VehicleCardProps {
  vehicle: Vehicle;
  onPress: () => void;
  selected?: boolean;
}

const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle, onPress, selected = false }) => {
  const { settings } = useSettingsStore();
  const { entries, getLatestEntryByVehicleId, getPreviousEntryByVehicleId } = useFuelEntryStore();
  
  const latestEntry = getLatestEntryByVehicleId(vehicle.id);
  const previousEntry = latestEntry ? getPreviousEntryByVehicleId(vehicle.id, latestEntry.id) : undefined;
  
  const efficiency = latestEntry && previousEntry
    ? calculateFuelEfficiency(latestEntry, previousEntry, settings.distanceUnit, settings.volumeUnit)
    : null;
  
  const getVehicleIcon = () => {
    switch (vehicle.type) {
      case 'electric':
        return <Zap size={24} color={Colors.dark.aqua} />;
      case 'hybrid':
        return <BatteryCharging size={24} color={Colors.dark.neonGreen} />;
      case 'cng':
        return <Wind size={24} color={Colors.dark.tint} />;
      case 'bike':
        return <Bike size={24} color={Colors.dark.hotPink} />;
      default:
        return <Droplet size={24} color={Colors.dark.tint} />;
    }
  };
  
  const getEfficiencyLabel = () => {
    if (!efficiency) return 'No data';
    
    if (vehicle.type === 'electric') {
      return `${efficiency} ${settings.distanceUnit}/kWh`;
    }
    
    return `${efficiency} ${settings.distanceUnit}/${settings.volumeUnit}`;
  };

  return (
    <Card
      onPress={onPress}
      style={[
        styles.card,
        selected && styles.selectedCard
      ]}
    >
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          {vehicle.image ? (
            <Image source={{ uri: vehicle.image }} style={styles.vehicleImage} />
          ) : (
            <View style={styles.vehicleIconContainer}>
              {vehicle.type === 'bike' ? <Bike size={32} color={Colors.dark.text} /> : <Car size={32} color={Colors.dark.text} />}
            </View>
          )}
        </View>
        
        <View style={styles.infoContainer}>
          <Text style={styles.vehicleName}>{vehicle.name}</Text>
          <Text style={styles.vehicleDetails}>
            {vehicle.make} {vehicle.model} {vehicle.year}
          </Text>
          
          {latestEntry ? (
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Last Refill</Text>
                <Text style={styles.statValue}>{formatDate(latestEntry.date)}</Text>
              </View>
              
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Efficiency</Text>
                <Text style={styles.statValue}>{getEfficiencyLabel()}</Text>
              </View>
              
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Odometer</Text>
                <Text style={styles.statValue}>
                  {formatDistance(latestEntry.odometer, settings.distanceUnit)}
                </Text>
              </View>
            </View>
          ) : (
            <Text style={styles.noDataText}>No fuel entries yet</Text>
          )}
        </View>
        
        <View style={styles.typeContainer}>
          {getVehicleIcon()}
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    padding: 0,
    overflow: 'hidden',
  },
  selectedCard: {
    borderWidth: 3,
    borderColor: Colors.dark.tint,
  },
  container: {
    flexDirection: 'row',
    padding: 16,
  },
  iconContainer: {
    marginRight: 16,
  },
  vehicleImage: {
    width: 60,
    height: 60,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.dark.border,
  },
  vehicleIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: Colors.dark.cardAlt,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.dark.border,
  },
  infoContainer: {
    flex: 1,
  },
  vehicleName: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.dark.text,
    marginBottom: 4,
  },
  vehicleDetails: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
    marginBottom: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  statItem: {
    marginRight: 16,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.dark.textSecondary,
  },
  statValue: {
    fontSize: 14,
    color: Colors.dark.text,
    fontWeight: '500',
  },
  noDataText: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
    fontStyle: 'italic',
  },
  typeContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 8,
  },
});

export default VehicleCard;