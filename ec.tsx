// app/(tabs)/dashboard/[sensor].tsx
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useSearchParams } from "expo-router";
import React, { useContext, useMemo } from "react";
import {
  Dimensions,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import { SafeAreaView } from "react-native-safe-area-context";
import { SensorContext } from "../../../context/sensorcontext";
import { ThemeContext } from "../../../context/themecontext";

export default function SensorPage() {
  const router = useRouter();
  const { sensor } = useSearchParams(); // 'ph', 'temperature', 'humidity', 'ec'
  const { sensorData, statusMap } = useContext(SensorContext);
  const { theme } = useContext(ThemeContext);

  // Current value
  const currentValue = sensorData[sensor];
  const status = statusMap[sensor] ?? "Offline";

  // History array (ensure all numbers)
  const rawHistory = sensorData[`${sensor}History`] || [];
  const history = rawHistory.map((v) => (typeof v === "number" ? v : 0));

  // Average value
  const averageValue =
    history.length > 0
      ? history.reduce((sum, val) => sum + val, 0) / history.length
      : currentValue ?? 0;

  // Chart data
  const chartData = useMemo(() => {
    const labels = history.map((_, i) => `${i + 1}h`);
    return { labels, datasets: [{ data: history }] };
  }, [history]);

  // Maps for title and units
  const titleMap = {
    ph: "pH Level",
    temperature: "Temperature",
    humidity: "Humidity",
    ec: "EC Level",
  };
  const unitMap = { ph: "pH", temperature: "°C", humidity: "%", ec: "mS/cm" };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ImageBackground
        source={require("../../../assets/images/bg.png")}
        style={styles.bg}
        resizeMode="cover"
      >
        <ScrollView>
          {/* Header */}
          <View style={[styles.header, { backgroundColor: "#8B0000" }]}>
            <Ionicons name="arrow-back" size={22} color="#fff" onPress={() => router.back()} />
            <Text style={[styles.headerText, { color: "#fff" }]}>{titleMap[sensor]}</Text>
          </View>

          {/* Current & Average */}
          <View style={styles.sensorWrapper}>
            <View style={[styles.sensorBox, { backgroundColor: theme.colors.card }]}>
              <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Current {titleMap[sensor]}</Text>
              <Text style={[styles.status, { color: status === "Normal" ? "#00C851" : "#ff4444" }]}>
                ● {status}
              </Text>
              <Text style={[styles.sensorValue, { color: theme.colors.text }]}>
                {currentValue != null ? currentValue.toFixed(2) : "--"} {unitMap[sensor]}
              </Text>
            </View>

            <View style={[styles.sensorBox, { backgroundColor: theme.colors.card }]}>
              <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Average {titleMap[sensor]}</Text>
              <Text style={[styles.sensorValue, { color: theme.colors.text }]}>
                {averageValue != null ? averageValue.toFixed(2) : "--"} {unitMap[sensor]}
              </Text>
            </View>
          </View>

          {/* Chart */}
          <View style={[styles.chartContainer, { backgroundColor: theme.colors.card }]}>
            <Text style={[styles.chartTitle, { color: theme.colors.text, textAlign: "center" }]}>
              {titleMap[sensor]} History
            </Text>
            <LineChart
              data={chartData}
              width={Dimensions.get("window").width - 40}
              height={250}
              chartConfig={{
                backgroundColor: theme.colors.card,
                backgroundGradientFrom: theme.colors.card,
                backgroundGradientTo: theme.colors.card,
                decimalPlaces: 2,
                color: () => "#4CAF50",
                labelColor: () => theme.colors.text,
                propsForDots: { r: "4", strokeWidth: "2", stroke: "#4CAF50", fill: "#4CAF50" },
                propsForBackgroundLines: { stroke: theme.colors.text + "33" },
              }}
              bezier
              style={[styles.chart, { paddingRight: 10, marginLeft: -10 }]}
            />
          </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  bg: { flex: 1, width: "100%", height: "100%" },
  header: { flexDirection: "row", alignItems: "center", padding: 15 },
  headerText: { fontSize: 18, fontWeight: "bold" },
  sensorWrapper: { flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 10, marginBottom: 10 },
  sensorBox: { flex: 1, margin: 5, borderRadius: 12, padding: 15, alignItems: "center", shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 3, elevation: 2 },
  cardTitle: { fontSize: 14, fontWeight: "600", marginBottom: 6 },
  status: { fontSize: 12, marginBottom: 6 },
  sensorValue: { fontSize: 24, fontWeight: "bold" },
  chartContainer: { borderRadius: 12, padding: 10, margin: 10, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 3, elevation: 2 },
  chartTitle: { fontSize: 14, fontWeight: "600", marginBottom: 8 },
  chart: { borderRadius: 12 },
});
