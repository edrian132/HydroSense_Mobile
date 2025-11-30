
import { useRouter } from "expo-router";
import React, { useContext, useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import Svg, { Path } from "react-native-svg";
import { ThemeContext } from "../context/themecontext";

const cardWidth = 160;

// ✅ Custom Broken Chain Icon
const DisconnectedIcon = ({ size = 40, color = "#888" }) => (
  <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <Path
      d="M22 30l-4 4a8 8 0 0 1-11 0 8 8 0 0 1 0-11l10-10a8 8 0 0 1 11 0 8 8 0 0 1 0 11l-3 3 3 3 3-3a12 12 0 0 0 0-17 12 12 0 0 0-17 0l-10 10a12 12 0 0 0 0 17 12 12 0 0 0 17 0l4-4-3-3zm20 4l4-4a8 8 0 0 1 11 0 8 8 0 0 1 0 11l-10 10a8 8 0 0 1-11 0 8 8 0 0 1 0-11l3-3-3-3-3 3a12 12 0 0 0 0 17 12 12 0 0 0 17 0l10-10a12 12 0 0 0 0-17 12 12 0 0 0-17 0l-4 4 3 3zm-7-8l-2 8 8-2-6-6z"
      fill={color}
    />
  </Svg>
);

const StatusCard = ({ title, value, unit, fill, status, sensorKey }) => {
  const { theme } = useContext(ThemeContext);
  const router = useRouter();

  // 🚫 Check if disconnected
  const isDisconnected = value === null || value === undefined;

  // ⚙️ Pulse animation for disconnected state
  const pulseAnim = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    if (isDisconnected) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 0.3,
            duration: 700,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 700,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isDisconnected]);

  // 🎨 Status color
  let displayColor;
  if (isDisconnected) displayColor = "#888888";
  else if (status === "Warning") displayColor = "#FFA500";
  else if (status === "Critical") displayColor = "#F44336";
  else displayColor = "#4CAF50";

  // 🧭 Navigate to sensor detail page
  const handlePress = () => {
    if (!isDisconnected) {
      router.push(`/dashboard/${sensorKey}`);
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={isDisconnected ? 1 : 0.7}
      onPress={handlePress}
      style={[styles.card, { backgroundColor: theme.colors.card }]}
    >
      <Text style={[styles.cardTitle, { color: theme.colors.text }]}>{title}</Text>

      {isDisconnected ? (
        <>
          <View style={styles.centerContent}>
            <Animated.View style={{ opacity: pulseAnim }}>
              <DisconnectedIcon size={40} color={displayColor} />
            </Animated.View>
          </View>
          <Text style={[styles.statusText, { color: displayColor, marginTop: 5 }]}>
            Disconnected
          </Text>
        </>
      ) : (
        <>
          <AnimatedCircularProgress
            size={cardWidth * 0.5}
            width={8}
            fill={fill}
            tintColor={displayColor}
            backgroundColor={
              theme.colors.background === "#121212" ? "#333" : "#e0e0e0"
            }
            rotation={0}
            lineCap="round"
          >
            {() => (
              <View style={styles.centerContent}>
                <Text style={[styles.value, { color: theme.colors.text }]}>
                  {value}
                  <Text style={[styles.unit, { color: theme.colors.text }]}>{unit}</Text>
                </Text>
              </View>
            )}
          </AnimatedCircularProgress>
          <Text style={[styles.statusText, { color: displayColor }]}>{status}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: cardWidth,
    height: cardWidth,
    borderRadius: 16,
    padding: 10,
    alignItems: "center",
    justifyContent: "space-between",
    margin: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
  },
  cardTitle: { fontSize: 13, fontWeight: "600" },
  centerContent: { flex: 1, alignItems: "center", justifyContent: "center" },
  value: { fontSize: 15, fontWeight: "bold" },
  unit: { fontSize: 10, fontWeight: "400" },
  statusText: { fontWeight: "600", fontSize: 12 },
});

export default StatusCard;
