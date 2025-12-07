import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { Platform, StatusBar, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ErrorBoundary } from "./error-boundary";
import Colors from "@/constants/colors";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) {
      console.error(error);
      throw error;
    }
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <View style={{ flex: 1, backgroundColor: Colors.dark.background }}>
          <StatusBar barStyle="light-content" backgroundColor={Colors.dark.background} />
          <RootLayoutNav />
        </View>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}

function RootLayoutNav() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.dark.background,
        },
        headerTintColor: Colors.dark.text,
        headerTitleStyle: {
          fontWeight: '600',
        },
        headerShadowVisible: false,

        contentStyle: {
          backgroundColor: Colors.dark.background,
        },
      }}
    >
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
          title: 'Back',
          headerBackTitle: 'Back'
        }}
      />
      <Stack.Screen
        name="add-vehicle"
        options={{
          title: "Add Vehicle",
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="add-fuel"
        options={{
          title: "Add Fuel Entry",
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="vehicle-details/[id]"
        options={{
          title: "Vehicle Details",
        }}
      />
      <Stack.Screen
        name="fuel-details/[id]"
        options={{
          title: "Fuel Entry Details",
        }}
      />
      <Stack.Screen
        name="onboarding"
        options={{
          headerShown: false,
          gestureEnabled: false,
        }}
      />
    </Stack>
  );
}