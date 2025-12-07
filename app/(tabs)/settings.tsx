import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Alert, Platform, Image, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Colors from '@/constants/colors';
import { useSettingsStore } from '@/store/settingsStore';
import { useVehicleStore } from '@/store/vehicleStore';
import { useFuelEntryStore } from '@/store/fuelEntryStore';
import { SettingsItem } from '@/components/SettingsItem';
import Button from '@/components/Button';
import Card from '@/components/Card';
import Input from '@/components/Input';
import { Currency, DistanceUnit, VolumeUnit } from '@/types';
import { pickImage } from '@/utils/helpers';
import {
  User,
  DollarSign,
  Ruler,
  Droplet,
  FileText,
  HelpCircle,
  Info,
  LogOut,
  Trash2,
  Camera,
  Plus,
  Check,
  X,
  Heart,
} from 'lucide-react-native';

export default function SettingsScreen() {
  const { settings, setCurrency, setDistanceUnit, setVolumeUnit, setUserName, setUserImage } = useSettingsStore();
  const { vehicles, deleteVehicle } = useVehicleStore();
  const { entries, deleteEntry } = useFuelEntryStore();

  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(settings.userName || '');

  const handleCurrencyChange = () => {
    Alert.alert(
      'Select Currency',
      'Choose your preferred currency',
      [
        { text: 'Indian Rupee (₹)', onPress: () => setCurrency('INR') },
        { text: 'US Dollar ($)', onPress: () => setCurrency('USD') },
        { text: 'Euro (€)', onPress: () => setCurrency('EUR') },
        { text: 'British Pound (£)', onPress: () => setCurrency('GBP') },
        { text: 'Japanese Yen (¥)', onPress: () => setCurrency('JPY') },
        { text: 'Canadian Dollar (C$)', onPress: () => setCurrency('CAD') },
        { text: 'Australian Dollar (A$)', onPress: () => setCurrency('AUD') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleDistanceUnitChange = () => {
    Alert.alert(
      'Select Distance Unit',
      'Choose your preferred distance unit',
      [
        { text: 'Kilometers (km)', onPress: () => setDistanceUnit('km') },
        { text: 'Miles (mi)', onPress: () => setDistanceUnit('mi') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleVolumeUnitChange = () => {
    Alert.alert(
      'Select Volume Unit',
      'Choose your preferred volume unit',
      [
        { text: 'Liters (l)', onPress: () => setVolumeUnit('l') },
        { text: 'Gallons (gal)', onPress: () => setVolumeUnit('gal') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handlePickImage = async () => {
    const imageUri = await pickImage();
    if (imageUri) {
      setUserImage(imageUri);
    }
  };

  const handleProfileNameChange = () => {
    setIsEditingName(true);
  };

  const handleSaveName = () => {
    if (nameInput.trim()) {
      setUserName(nameInput.trim());
    }
    setIsEditingName(false);
  };

  const handleCancelNameEdit = () => {
    setNameInput(settings.userName || '');
    setIsEditingName(false);
  };

  const handleExportData = () => {
    Alert.alert(
      'Export Data',
      'This feature will export all your data as CSV or PDF.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Export as CSV', onPress: () => console.log('Export as CSV') },
        { text: 'Export as PDF', onPress: () => console.log('Export as PDF') },
      ]
    );
  };

  const handleResetData = () => {
    Alert.alert(
      'Reset All Data',
      'This will permanently delete all your vehicles, fuel entries, and expenses. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            // Reset all data by deleting all entries and vehicles
            entries.forEach(entry => {
              deleteEntry(entry.id);
            });

            vehicles.forEach(vehicle => {
              deleteVehicle(vehicle.id);
            });

            Alert.alert('Success', 'All data has been reset.');
          }
        },
      ]
    );
  };

  const getCurrencyLabel = (currency: Currency): string => {
    const labels: Record<Currency, string> = {
      'INR': 'Indian Rupee (₹)',
      'USD': 'US Dollar ($)',
      'EUR': 'Euro (€)',
      'GBP': 'British Pound (£)',
      'JPY': 'Japanese Yen (¥)',
      'CAD': 'Canadian Dollar (C$)',
      'AUD': 'Australian Dollar (A$)',
    };

    return labels[currency] || currency;
  };

  const getDistanceUnitLabel = (unit: DistanceUnit): string => {
    return unit === 'km' ? 'Kilometers (km)' : 'Miles (mi)';
  };

  const getVolumeUnitLabel = (unit: VolumeUnit): string => {
    return unit === 'l' ? 'Liters (l)' : 'Gallons (gal)';
  };

  return (
    <SafeAreaView style={styles.container} edges={[]}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
        </View>

        <View style={styles.profileSection}>
          <TouchableOpacity
            style={styles.profileImageContainer}
            onPress={handlePickImage}
          >
            {settings.userImage ? (
              <Image source={{ uri: settings.userImage }} style={styles.profileImage} />
            ) : (
              <View style={styles.profileImagePlaceholder}>
                <User size={40} color={Colors.dark.textSecondary} />
              </View>
            )}
            <View style={styles.cameraButton}>
              <Camera size={16} color="#FFFFFF" />
            </View>
          </TouchableOpacity>

          {isEditingName ? (
            <View style={styles.nameEditContainer}>
              <TextInput
                style={styles.nameInput}
                value={nameInput}
                onChangeText={setNameInput}
                placeholder="Enter your name"
                placeholderTextColor={Colors.dark.textSecondary}
                autoFocus
              />
              <View style={styles.nameEditButtons}>
                <TouchableOpacity
                  style={styles.nameEditButton}
                  onPress={handleCancelNameEdit}
                >
                  <X size={20} color={Colors.dark.danger} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.nameEditButton}
                  onPress={handleSaveName}
                >
                  <Check size={20} color={Colors.dark.success} />
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <>
              <Text style={styles.profileName}>
                {settings.userName || 'Set your name'}
              </Text>

              <Button
                title={settings.userName ? "Change Name" : "Set Name"}
                onPress={handleProfileNameChange}
                variant="outline"
                size="small"
                style={styles.profileButton}
              />
            </>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Units & Currency</Text>
          <View style={styles.card}>
            <SettingsItem
              icon={<DollarSign size={24} color={Colors.dark.tint} />}
              title="Currency"
              subtitle={getCurrencyLabel(settings.currency)}
              onPress={handleCurrencyChange}
            />
            <SettingsItem
              icon={<Ruler size={24} color={Colors.dark.tint} />}
              title="Distance Unit"
              subtitle={getDistanceUnitLabel(settings.distanceUnit)}
              onPress={handleDistanceUnitChange}
            />
            <SettingsItem
              icon={<Droplet size={24} color={Colors.dark.tint} />}
              title="Volume Unit"
              subtitle={getVolumeUnitLabel(settings.volumeUnit)}
              onPress={handleVolumeUnitChange}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data</Text>
          <View style={styles.card}>
            <SettingsItem
              icon={<FileText size={24} color={Colors.dark.tint} />}
              title="Export Data"
              subtitle="Export as CSV or PDF"
              onPress={handleExportData}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <View style={styles.card}>
            <SettingsItem
              icon={<Info size={24} color={Colors.dark.tint} />}
              title="About FuelMate"
              subtitle="Version 1.0.0"
              onPress={() => { }}
            />
            <SettingsItem
              icon={<HelpCircle size={24} color={Colors.dark.tint} />}
              title="Help & Support"
              subtitle="Get help with the app"
              onPress={() => { }}
            />
            <SettingsItem
              icon={<Heart size={24} color={Colors.dark.tint} />}
              title="Made with Love"
              subtitle="Thanks for using our app!"
              onPress={() => { }}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Button
            title="Reset All Data"
            onPress={handleResetData}
            variant="danger"
            icon={<Trash2 size={18} color="#FFFFFF" />}
            style={styles.resetButton}
          />
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
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.dark.text,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 24,
    marginBottom: 16,
  },
  profileImageContainer: {
    position: 'relative',
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
  },
  profileImagePlaceholder: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
    backgroundColor: Colors.dark.cardAlt,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: Colors.dark.border,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Colors.dark.tint,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.dark.background,
  },
  profileName: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.dark.text,
    marginBottom: 8,
  },
  profileButton: {
    minWidth: 120,
  },
  nameEditContainer: {
    width: '80%',
    marginBottom: 16,
  },
  nameInput: {
    backgroundColor: Colors.dark.cardAlt,
    borderRadius: 20,
    padding: 12,
    fontSize: 16,
    color: Colors.dark.text,
    borderWidth: 2,
    borderColor: Colors.dark.border,
    textAlign: 'center',
  },
  nameEditButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  nameEditButton: {
    padding: 8,
    marginHorizontal: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.dark.text,
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: Colors.dark.card,
    borderRadius: 24,
    overflow: 'hidden',
    marginHorizontal: 16,
    borderWidth: 2,
    borderColor: Colors.dark.border,
  },
  resetButton: {
    marginHorizontal: 16,
  },
});