import { Stack } from "expo-router";
import { SensorProvider } from "../context/sensorcontext";
import { ThemeProvider } from "../context/themecontext";
import TabsLayout from "./(tabs)/_layout"; // Import TabsLayout directly

export default function RootLayout() {
  return (
    <ThemeProvider>
      <SensorProvider>
        <Stack screenOptions={{ headerShown: false }}>
          {/* Login screen */}
          <Stack.Screen name="login/index" />

          {/* Main tabs */}
          <Stack.Screen
            name="tabs"
            component={TabsLayout} // Fixed: reference the actual TabsLayout component
          />
        </Stack>
      </SensorProvider>
    </ThemeProvider>
  );
}
