import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Colors from '@/constants/colors';
import { useVehicleStore } from '@/store/vehicleStore';
import Input from '@/components/Input';
import Button from '@/components/Button';
import SuccessModal from '@/components/SuccessModal';
import { pickImage } from '@/utils/helpers';
import { Camera, Car, Bike, X } from 'lucide-react-native';

export default function AddVehicleScreen() {

  const { addVehicle } = useVehicleStore();
  // Name field removed as per request, auto-generated from make+model
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [vehicleClass, setVehicleClass] = useState<'car' | 'bike'>('bike');
  const [type, setType] = useState<'petrol' | 'diesel' | 'electric' | 'hybrid' | 'cng' | 'bike' | 'petrol_cng'>('petrol');
  const [initialOdometer, setInitialOdometer] = useState('');
  const [tankCapacity, setTankCapacity] = useState('');
  const [cngTankCapacity, setCngTankCapacity] = useState(''); // New state for CNG tank
  const [batteryCapacity, setBatteryCapacity] = useState('');
  const [image, setImage] = useState<string | null>(null);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSuccess, setShowSuccess] = useState(false);

  const handlePickImage = async () => {
    const result = await pickImage();
    if (result) {
      setImage(result);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
  };

  const handleTypeSelect = (selectedType: 'petrol' | 'diesel' | 'petrol_cng' | 'electric' | 'hybrid' | 'cng' | 'bike') => {
    setType(selectedType);
  };

  const handleClassSelect = (cls: 'car' | 'bike') => {
    setVehicleClass(cls);
    if (cls === 'bike') {
      setType('petrol');
    } else {
      // Reset to petrol when switching to car, or keep if valid for car
      setType('petrol');
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};



    if (!make.trim()) {
      newErrors.make = 'Make is required';
    }

    if (!model.trim()) {
      newErrors.model = 'Model is required';
    }

    if (!year.trim()) {
      newErrors.year = 'Year is required';
    } else if (!/^\d{4}$/.test(year) || parseInt(year) < 1900 || parseInt(year) > new Date().getFullYear() + 1) {
      newErrors.year = 'Enter a valid year';
    }

    if (!initialOdometer.trim()) {
      newErrors.initialOdometer = 'Initial odometer reading is required';
    } else if (isNaN(parseFloat(initialOdometer)) || parseFloat(initialOdometer) < 0) {
      newErrors.initialOdometer = 'Enter a valid odometer reading';
    }

    if (type !== 'electric' && tankCapacity.trim() && (isNaN(parseFloat(tankCapacity)) || parseFloat(tankCapacity) <= 0)) {
      newErrors.tankCapacity = 'Enter a valid tank capacity';
    }

    if (type === 'petrol_cng' && cngTankCapacity.trim() && (isNaN(parseFloat(cngTankCapacity)) || parseFloat(cngTankCapacity) <= 0)) {
      newErrors.cngTankCapacity = 'Enter a valid CNG capacity';
    }

    if ((type === 'electric' || type === 'hybrid') && batteryCapacity.trim() && (isNaN(parseFloat(batteryCapacity)) || parseFloat(batteryCapacity) <= 0)) {
      newErrors.batteryCapacity = 'Enter a valid battery capacity';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }



    const vehicleData = {
      name: `${make} ${model}`, // Auto-generate name
      make,
      model,
      year: parseInt(year),
      type: vehicleClass === 'bike' ? 'petrol' : type, // Force petrol if bike (visual) but store as petrol. 
      // Actually, if it is a bike, we want to store it as a bike for backward compatibility? NO, user wants to choose. 
      // Let's store type='petrol' and vehicleClass='bike'.
      vehicleClass,
      initialOdometer: parseFloat(initialOdometer),
      tankCapacity: tankCapacity ? parseFloat(tankCapacity) : undefined,
      cngTankCapacity: (type === 'petrol_cng' && cngTankCapacity) ? parseFloat(cngTankCapacity) : undefined,
      batteryCapacity: batteryCapacity ? parseFloat(batteryCapacity) : undefined,
      image: image || undefined,
    };

    try {
      const id = addVehicle(vehicleData);

      // Show success modal
      setShowSuccess(true);
    } catch (error) {
      console.error('Error adding vehicle:', error);
      Alert.alert('Error', 'Failed to add vehicle. Please try again.');
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    router.replace('/');
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.imageSection}>
          {image ? (
            <View style={styles.imageContainer}>
              <Image source={{ uri: image }} style={styles.vehicleImage} />
              <TouchableOpacity style={styles.removeImageButton} onPress={handleRemoveImage}>
                <X size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.imagePlaceholder} onPress={handlePickImage}>
              <Camera size={32} color={Colors.dark.textSecondary} />
              <Text style={styles.imagePlaceholderText}>Add Vehicle Photo</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.formSection}>
          <Input
            label="Make"
            value={make}
            onChangeText={setMake}
            placeholder="e.g. Toyota"
            error={errors.make}
            autoCapitalize="words"
          />

          <Input
            label="Model"
            value={model}
            onChangeText={setModel}
            placeholder="e.g. Corolla"
            error={errors.model}
            autoCapitalize="words"
          />

          <Input
            label="Year"
            value={year}
            onChangeText={setYear}
            placeholder="e.g. 2022"
            keyboardType="number-pad"
            error={errors.year}
          />

          <Text style={styles.label}>Vehicle Class</Text>
          <View style={styles.typeContainer}>
            <TouchableOpacity
              style={[styles.typeButton, styles.vehicleClassButton, vehicleClass === 'bike' && styles.typeButtonSelected]}
              onPress={() => handleClassSelect('bike')}
            >
              <Bike size={20} color={vehicleClass === 'bike' ? '#FFFFFF' : Colors.dark.text} style={{ marginRight: 10 }} />
              <Text style={[styles.typeButtonText, vehicleClass === 'bike' && styles.typeButtonTextSelected]}>
                Motorcycle
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.typeButton, styles.vehicleClassButton, vehicleClass === 'car' && styles.typeButtonSelected]}
              onPress={() => handleClassSelect('car')}
            >
              <Car size={20} color={vehicleClass === 'car' ? '#FFFFFF' : Colors.dark.text} style={{ marginRight: 10 }} />
              <Text style={[styles.typeButtonText, vehicleClass === 'car' && styles.typeButtonTextSelected]}>
                Car
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Fuel Type</Text>
          <View style={styles.typeContainer}>
            <TouchableOpacity
              style={[styles.typeButton, type === 'petrol' && styles.typeButtonSelected]}
              onPress={() => handleTypeSelect('petrol')}
            >
              <Text style={[styles.typeButtonText, type === 'petrol' && styles.typeButtonTextSelected]}>
                Petrol
              </Text>
            </TouchableOpacity>

            {vehicleClass === 'car' && (
              <>
                <TouchableOpacity
                  style={[styles.typeButton, type === 'diesel' && styles.typeButtonSelected]}
                  onPress={() => handleTypeSelect('diesel')}
                >
                  <Text style={[styles.typeButtonText, type === 'diesel' && styles.typeButtonTextSelected]}>
                    Diesel
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.typeButton, type === 'petrol_cng' && styles.typeButtonSelected]}
                  onPress={() => handleTypeSelect('petrol_cng')}
                >
                  <Text style={[styles.typeButtonText, type === 'petrol_cng' && styles.typeButtonTextSelected]}>
                    Petrol + CNG
                  </Text>
                </TouchableOpacity>
              </>
            )}

            {/* Keeping existing options just in case, but hiding them if user strictly wants only these 3 for Car. 
                User said: "If car is selected, show petrol, diesel, and petrol + CNG".
                I will hide others for now to be compliant with the request.
            */}
          </View>

          <Input
            label="Initial Odometer Reading"
            value={initialOdometer}
            onChangeText={setInitialOdometer}
            placeholder="e.g. 0"
            keyboardType="numeric"
            error={errors.initialOdometer}
          />

          {(type === 'petrol' || type === 'diesel' || type === 'hybrid' || type === 'cng' || type === 'bike' || type === 'petrol_cng') && (
            <Input
              label="Fuel Tank Capacity (Liters) (optional)"
              value={tankCapacity}
              onChangeText={setTankCapacity}
              placeholder="e.g. 45"
              keyboardType="numeric"
              error={errors.tankCapacity}
            />
          )}

          {type === 'petrol_cng' && (
            <Input
              label="CNG Tank Capacity (kg) (optional)"
              value={cngTankCapacity}
              onChangeText={setCngTankCapacity}
              placeholder="e.g. 10"
              keyboardType="numeric"
              error={errors.cngTankCapacity}
            />
          )}

          {(type === 'electric' || type === 'hybrid') && (
            <Input
              label="Battery Capacity (optional)"
              value={batteryCapacity}
              onChangeText={setBatteryCapacity}
              placeholder="e.g. 60"
              keyboardType="numeric"
              error={errors.batteryCapacity}
            />
          )}
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Add Vehicle"
            onPress={handleSubmit}
            variant="primary"
            icon={vehicleClass === 'bike' ? <Bike size={18} color="#FFFFFF" /> : <Car size={18} color="#FFFFFF" />}
            fullWidth
          />
        </View>
      </ScrollView>

      <SuccessModal
        visible={showSuccess}
        title="Vehicle Added!"
        message={`${make} ${model} has been added to your garage successfully.`}
        type="vehicle"
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
  imageSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  imageContainer: {
    position: 'relative',
  },
  vehicleImage: {
    width: 200,
    height: 150,
    borderRadius: 24,
    borderWidth: 3,
    borderColor: Colors.dark.border,
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
    width: 200,
    height: 150,
    borderRadius: 24,
    backgroundColor: Colors.dark.cardAlt,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.dark.border,
    borderStyle: 'dashed',
  },
  imagePlaceholderText: {
    color: Colors.dark.textSecondary,
    marginTop: 8,
    fontSize: 14,
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
  typeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
    gap: 8, // Use gap instead of margin on children for cleaner layout
  },
  typeButton: {
    paddingHorizontal: 16,
    paddingVertical: 12, // Increased padding for better touch area
    borderRadius: 12, // Slightly less rounded for a more modern look
    backgroundColor: Colors.dark.cardAlt,
    borderWidth: 2,
    borderColor: Colors.dark.border,
    flexDirection: 'row', // Ensure icon and text are in a row
    alignItems: 'center',
    justifyContent: 'center',
  },
  vehicleClassButton: {
    flex: 1, // Make vehicle class buttons take equal width
    flexBasis: 0, // Force them to start at 0 width so they grow equally regardless of content
  },
  typeButtonSelected: {
    backgroundColor: Colors.dark.tint,
    borderColor: '#1a9e94',
  },
  typeButtonText: {
    color: Colors.dark.text,
    fontWeight: '600',
    fontSize: 15,
  },
  typeButtonTextSelected: {
    color: '#FFFFFF',
  },
  buttonContainer: {
    marginTop: 16,
  },
});