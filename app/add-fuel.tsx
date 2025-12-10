import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, Alert, Switch, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Colors from '@/constants/colors';
import { useVehicleStore } from '@/store/vehicleStore';
import { useFuelEntryStore } from '@/store/fuelEntryStore';
import { useSettingsStore } from '@/store/settingsStore';
import Input from '@/components/Input';
import Button from '@/components/Button';
import Card from '@/components/Card';
import SuccessModal from '@/components/SuccessModal';
import { pickImage } from '@/utils/helpers';
import { formatCurrency, getCurrencySymbol } from '@/utils/calculations';
import { Calendar, Camera, Car, Droplet, X, Zap, BatteryCharging, Wind } from 'lucide-react-native';
import { Vehicle } from '@/types';

export default function AddFuelScreen() {
  const { vehicles, selectedVehicleId } = useVehicleStore();
  const { addEntry, getLatestEntryByVehicleId } = useFuelEntryStore();
  const { settings } = useSettingsStore();

  const [vehicleId, setVehicleId] = useState(selectedVehicleId || '');
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState('');
  const [odometer, setOdometer] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [fuelType, setFuelType] = useState<'regular' | 'premium' | 'diesel' | 'electricity' | 'cng'>('regular');
  const [isFull, setIsFull] = useState(true);
  const [notes, setNotes] = useState('');
  const [receiptImage, setReceiptImage] = useState<string | null>(null);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [totalCost, setTotalCost] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    // Pre-fill odometer with the latest entry's odometer reading if available
    if (vehicleId) {
      const latestEntry = getLatestEntryByVehicleId(vehicleId);
      if (latestEntry) {
        setOdometer(latestEntry.odometer.toString());
      } else {
        const vehicle = vehicles.find(v => v.id === vehicleId);
        if (vehicle) {
          setOdometer(vehicle.initialOdometer.toString());
        }
      }

      // Set appropriate fuel type based on vehicle type
      const vehicle = vehicles.find(v => v.id === vehicleId);
      if (vehicle) {
        if (vehicle.type === 'electric') {
          setFuelType('electricity');
        } else if (vehicle.type === 'diesel') {
          setFuelType('diesel');
        } else if (vehicle.type === 'cng') {
          // CNG vehicles can use either CNG or petrol
          setFuelType('cng');
        } else {
          setFuelType('regular');
        }
      }
    }
  }, [vehicleId]);

  useEffect(() => {
    // Calculate total cost
    const amountValue = parseFloat(amount) || 0;
    const priceValue = parseFloat(price) || 0;
    setTotalCost(amountValue * priceValue);
  }, [amount, price]);

  const handlePickImage = async () => {
    const result = await pickImage();
    if (result) {
      setReceiptImage(result);
    }
  };

  const handleRemoveImage = () => {
    setReceiptImage(null);
  };

  const handleFuelTypeSelect = (selectedType: 'regular' | 'premium' | 'diesel' | 'electricity' | 'cng') => {
    setFuelType(selectedType);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!vehicleId) {
      newErrors.vehicleId = 'Please select a vehicle';
    }

    if (!amount.trim()) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      newErrors.amount = 'Enter a valid amount';
    }

    if (!price.trim()) {
      newErrors.price = 'Price is required';
    } else if (isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
      newErrors.price = 'Enter a valid price';
    }

    if (!odometer.trim()) {
      newErrors.odometer = 'Odometer reading is required';
    } else if (isNaN(parseFloat(odometer)) || parseFloat(odometer) < 0) {
      newErrors.odometer = 'Enter a valid odometer reading';
    }

    // Check if odometer reading is greater than the previous entry
    if (vehicleId) {
      const latestEntry = getLatestEntryByVehicleId(vehicleId);
      if (latestEntry && parseFloat(odometer) <= latestEntry.odometer) {
        newErrors.odometer = 'Odometer reading must be greater than the previous entry';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    const entryData = {
      vehicleId,
      date: new Date(date).getTime(),
      amount: parseFloat(amount),
      price: parseFloat(price),
      odometer: parseFloat(odometer),
      fuelType,
      totalCost,
      isFull,
      notes: notes.trim() || undefined,
      receiptImage: receiptImage || undefined,
    };

    try {
      const id = addEntry(entryData);

      // Show success modal
      setShowSuccess(true);
    } catch (error) {
      console.error('Error adding fuel entry:', error);
      Alert.alert('Error', 'Failed to add fuel entry. Please try again.');
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    router.replace('/');
  };

  const selectedVehicle = vehicles.find(v => v.id === vehicleId);

  const getVehicleIcon = (vehicle: Vehicle) => {
    const iconColor = vehicleId === vehicle.id ? Colors.dark.background : Colors.dark.text;
    switch (vehicle.type) {
      case 'electric':
        return <Zap size={20} color={iconColor} />;
      case 'hybrid':
        return <BatteryCharging size={20} color={iconColor} />;
      case 'cng':
        return <Wind size={20} color={iconColor} />;
      default:
        return <Car size={20} color={iconColor} />;
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.formSection}>
          <Text style={styles.label}>Select Vehicle</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.vehicleScroll}
            contentContainerStyle={styles.vehicleScrollContent}
          >
            {vehicles.map(vehicle => (
              <TouchableOpacity
                key={vehicle.id}
                style={[
                  styles.vehicleButton,
                  vehicleId === vehicle.id && styles.vehicleButtonSelected
                ]}
                onPress={() => setVehicleId(vehicle.id)}
              >
                {getVehicleIcon(vehicle)}
                <Text
                  style={[
                    styles.vehicleButtonText,
                    vehicleId === vehicle.id && styles.vehicleButtonTextSelected
                  ]}
                >
                  {vehicle.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          {errors.vehicleId && <Text style={styles.errorText}>{errors.vehicleId}</Text>}

          <View style={styles.row}>
            <View style={styles.halfColumn}>
              <Input
                label={`Amount (${settings.volumeUnit})`}
                value={amount}
                onChangeText={setAmount}
                placeholder="e.g. 45"
                keyboardType="numeric"
                error={errors.amount}
              />
            </View>

            <View style={styles.halfColumn}>
              <Input
                label={`Price per ${settings.volumeUnit} (${getCurrencySymbol(settings.currency)})`}
                value={price}
                onChangeText={setPrice}
                placeholder="e.g. 100"
                keyboardType="numeric"
                error={errors.price}
              />
            </View>
          </View>

          <Input
            label={`Odometer (${settings.distanceUnit})`}
            value={odometer}
            onChangeText={setOdometer}
            placeholder="e.g. 12500"
            keyboardType="numeric"
            error={errors.odometer}
          />

          <Text style={styles.label}>Fuel Type</Text>
          <View style={styles.typeContainer}>
            {/* Allow petrol for CNG vehicles too */}
            {(selectedVehicle?.type !== 'electric' && selectedVehicle?.type !== 'diesel') && (
              <>
                <TouchableOpacity
                  style={[styles.typeButton, fuelType === 'regular' && styles.typeButtonSelected]}
                  onPress={() => handleFuelTypeSelect('regular')}
                >
                  <Text style={[styles.typeButtonText, fuelType === 'regular' && styles.typeButtonTextSelected]}>
                    Regular
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.typeButton, fuelType === 'premium' && styles.typeButtonSelected]}
                  onPress={() => handleFuelTypeSelect('premium')}
                >
                  <Text style={[styles.typeButtonText, fuelType === 'premium' && styles.typeButtonTextSelected]}>
                    Premium
                  </Text>
                </TouchableOpacity>
              </>
            )}

            {selectedVehicle?.type === 'diesel' && (
              <TouchableOpacity
                style={[styles.typeButton, fuelType === 'diesel' && styles.typeButtonSelected]}
                onPress={() => handleFuelTypeSelect('diesel')}
              >
                <Text style={[styles.typeButtonText, fuelType === 'diesel' && styles.typeButtonTextSelected]}>
                  Diesel
                </Text>
              </TouchableOpacity>
            )}

            {selectedVehicle?.type === 'cng' && (
              <TouchableOpacity
                style={[styles.typeButton, fuelType === 'cng' && styles.typeButtonSelected]}
                onPress={() => handleFuelTypeSelect('cng')}
              >
                <Text style={[styles.typeButtonText, fuelType === 'cng' && styles.typeButtonTextSelected]}>
                  CNG
                </Text>
              </TouchableOpacity>
            )}

            {(selectedVehicle?.type === 'electric' || selectedVehicle?.type === 'hybrid') && (
              <TouchableOpacity
                style={[styles.typeButton, fuelType === 'electricity' && styles.typeButtonSelected]}
                onPress={() => handleFuelTypeSelect('electricity')}
              >
                <Text style={[styles.typeButtonText, fuelType === 'electricity' && styles.typeButtonTextSelected]}>
                  Electricity
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Full Tank/Charge</Text>
            <Switch
              value={isFull}
              onValueChange={setIsFull}
              trackColor={{ false: Colors.dark.border, true: Colors.dark.tint }}
              thumbColor="#FFFFFF"
            />
          </View>

          <Input
            label="Notes (optional)"
            value={notes}
            onChangeText={setNotes}
            placeholder="Add any notes about this refill"
            multiline
            numberOfLines={3}
          />

          <Text style={styles.label}>Receipt Image (optional)</Text>
          {receiptImage ? (
            <View style={styles.imageContainer}>
              <Image source={{ uri: receiptImage }} style={styles.receiptImage} />
              <TouchableOpacity style={styles.removeImageButton} onPress={handleRemoveImage}>
                <X size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.imagePlaceholder} onPress={handlePickImage}>
              <Camera size={32} color={Colors.dark.textSecondary} />
              <Text style={styles.imagePlaceholderText}>Add Receipt Photo</Text>
            </TouchableOpacity>
          )}
        </View>

        <Card style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Cost:</Text>
            <Text style={styles.summaryValue}>
              {formatCurrency(totalCost, settings.currency)}
            </Text>
          </View>
        </Card>

        <View style={styles.buttonContainer}>
          <Button
            title="Add Fuel Entry"
            onPress={handleSubmit}
            variant="primary"
            icon={<Droplet size={18} color={Colors.dark.background} />}
            fullWidth
          />
        </View>
      </ScrollView>

      <SuccessModal
        visible={showSuccess}
        title="Fuel Entry Added!"
        message="Your fuel entry has been recorded successfully."
        type="fuel"
        onClose={handleSuccessClose}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 32 : 24,
  },
  formSection: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.dark.text,
    marginBottom: 8,
  },
  vehicleScroll: {
    marginBottom: 16,
  },
  vehicleScrollContent: {
    paddingRight: 16,
  },
  vehicleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: Colors.dark.cardAlt,
    marginRight: 8,
  },
  vehicleButtonSelected: {
    backgroundColor: Colors.dark.text,
  },
  vehicleButtonText: {
    color: Colors.dark.text,
    fontWeight: '500',
    marginLeft: 8,
  },
  vehicleButtonTextSelected: {
    color: Colors.dark.background,
  },
  row: {
    flexDirection: 'row',
    marginHorizontal: -8,
  },
  halfColumn: {
    flex: 1,
    paddingHorizontal: 8,
  },
  typeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  typeButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: Colors.dark.cardAlt,
    marginRight: 8,
    marginBottom: 8,
  },
  typeButtonSelected: {
    backgroundColor: Colors.dark.text,
  },
  typeButtonText: {
    color: Colors.dark.text,
    fontWeight: '500',
  },
  typeButtonTextSelected: {
    color: Colors.dark.background,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.dark.text,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  receiptImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 16,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePlaceholder: {
    width: '100%',
    height: 150,
    borderRadius: 12,
    backgroundColor: Colors.dark.cardAlt,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.dark.border,
    borderStyle: 'dashed',
    marginBottom: 16,
  },
  imagePlaceholderText: {
    color: Colors.dark.textSecondary,
    marginTop: 8,
    fontSize: 14,
  },
  summaryCard: {
    marginBottom: 24,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.dark.text,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.dark.text,
  },
  buttonContainer: {
    marginTop: 16,
  },
  errorText: {
    fontSize: 14,
    color: Colors.dark.danger,
    marginTop: -12,
    marginBottom: 16,
  },
});