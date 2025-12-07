import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { FuelEntry } from '@/types';
import Colors from '@/constants/colors';
import { Droplet, Receipt, Zap, Wind } from 'lucide-react-native';
import Card from './Card';
import { useSettingsStore } from '@/store/settingsStore';
import { useVehicleStore } from '@/store/vehicleStore';
import { formatCurrency, formatDistance, formatVolume } from '@/utils/calculations';
import { formatDate } from '@/utils/helpers';

interface FuelEntryCardProps {
  entry: FuelEntry;
  onPress: () => void;
}

const FuelEntryCard: React.FC<FuelEntryCardProps> = ({ entry, onPress }) => {
  const { settings } = useSettingsStore();
  const { getVehicleById } = useVehicleStore();

  const vehicle = getVehicleById(entry.vehicleId);

  const getFuelTypeLabel = () => {
    if (vehicle?.type === 'electric') return 'Electricity';

    switch (entry.fuelType) {
      case 'regular': return 'Regular';
      case 'premium': return 'Premium';
      case 'diesel': return 'Diesel';
      case 'electricity': return 'Electricity';
      case 'cng': return 'CNG';
      default: return 'Fuel';
    }
  };

  const getFuelIcon = () => {
    if (entry.fuelType === 'electricity' || vehicle?.type === 'electric') {
      return <Zap size={24} color={Colors.dark.aqua} />;
    }
    if (entry.fuelType === 'cng' || vehicle?.type === 'cng') {
      return <Wind size={24} color={Colors.dark.neonGreen} />;
    }
    return <Droplet size={24} color={Colors.dark.tint} />;
  };

  return (
    <Card onPress={onPress}>
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <View style={styles.icon}>
            {getFuelIcon()}
          </View>
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.headerRow}>
            <Text style={styles.date}>{formatDate(entry.date)}</Text>
            <Text style={styles.totalCost}>
              {formatCurrency(entry.totalCost, settings.currency)}
            </Text>
          </View>

          <View style={styles.detailsContainer}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Vehicle</Text>
              <Text style={styles.detailValue}>{vehicle?.name || 'Unknown'}</Text>
            </View>

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
              <Text style={styles.detailLabel}>Type</Text>
              <Text style={styles.detailValue}>{getFuelTypeLabel()}</Text>
            </View>

            {entry.isFull && (
              <View style={styles.fullTankBadge}>
                <Text style={styles.fullTankText}>Full Tank</Text>
              </View>
            )}
          </View>

          {entry.notes && (
            <Text style={styles.notes}>{entry.notes}</Text>
          )}

          {entry.receiptImage && (
            <View style={styles.receiptContainer}>
              <Receipt size={16} color={Colors.dark.textSecondary} />
              <Text style={styles.receiptText}>Receipt available</Text>
            </View>
          )}
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  iconContainer: {
    marginRight: 16,
  },
  icon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(38, 223, 208, 0.15)', // Gold with transparency
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(38, 223, 208, 0.15)', // Gold border with transparency
  },
  infoContainer: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  date: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.dark.text,
  },
  totalCost: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.dark.tint,
  },
  detailsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  detailItem: {
    marginRight: 16,
    marginBottom: 8,
    minWidth: 80,
  },
  detailLabel: {
    fontSize: 12,
    color: Colors.dark.textSecondary,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    color: Colors.dark.text,
    fontWeight: '500',
  },
  fullTankBadge: {
    backgroundColor: 'rgba(43, 243, 239, 0.54)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: Colors.dark.success,
  },
  fullTankText: {
    fontSize: 12,
    color: Colors.dark.success,
    fontWeight: '600',
  },
  notes: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
    marginTop: 4,
    fontStyle: 'italic',
  },
  receiptContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  receiptText: {
    fontSize: 12,
    color: Colors.dark.textSecondary,
    marginLeft: 4,
  },
});

export default FuelEntryCard;