import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useContext, useMemo } from "react";
import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BottomNav from "../components/BottomNav";
import { SensorContext } from "../context/sensorcontext";
import { ThemeContext } from "../context/themecontext";

export default function ReportsPage() {
  const router = useRouter();
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);
  const { sensorData, statusMap } = useContext(SensorContext);

  const theme = useMemo(
    () => ({
      background: darkMode ? "#121212" : "#f5f5f5",
      card: darkMode ? "#1e1e1e" : "#ffffff",
      text: darkMode ? "#ffffff" : "#000000",
      subText: darkMode ? "#bbbbbb" : "#333333",
      tableBackground: darkMode ? "#1e1e1e" : "#ffffff",
      header: "#8B0000",
    }),
    [darkMode]
  );

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Normal":
        return { bg: "#d4f8d4", border: "green", text: "green" };
      case "Warning":
        return { bg: "#fff3cd", border: "orange", text: "orange" };
      case "Critical":
        return { bg: "#f8d7da", border: "red", text: "red" };
      default:
        return { bg: "#e0e0e0", border: "gray", text: "gray" };
    }
  };

  const readings = [
    {
      datetime: sensorData.lastUpdate || "—",
      sensor: "pH",
      value: sensorData.ph ?? "—",
      status: statusMap.ph,
    },
    {
      datetime: sensorData.lastUpdate || "—",
      sensor: "Humidity",
      value: sensorData.humidity ?? "—",
      status: statusMap.humidity,
    },
    {
      datetime: sensorData.lastUpdate || "—",
      sensor: "Temperature",
      value: sensorData.temperature ?? "—",
      status: statusMap.temperature,
    },
    {
      datetime: sensorData.lastUpdate || "—",
      sensor: "EC",
      value: sensorData.ec ?? "—",
      status: statusMap.ec,
    },
  ];

  const handleCardPress = (sensor: string) => {
    router.push(`/reports/${sensor.toLowerCase()}report`);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <ImageBackground source={require("../assets/images/bg.png")} style={{ flex: 1 }}>
        
        {/* HEADER */}
        <View style={[styles.header, { backgroundColor: theme.header }]}>
          <View style={styles.headerLeft}>
            <Image source={require("../assets/images/logo.png")} style={styles.headerLogo} />
            <Text style={[styles.headerTitle, { color: "#fff" }]}>Reports</Text>
          </View>

          <View style={styles.headerRight}>
            <TouchableOpacity onPress={toggleDarkMode} style={styles.iconButton}>
              <Ionicons name={darkMode ? "moon" : "sunny"} size={22} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push("/notifications")} style={styles.iconButton}>
              <Ionicons name="notifications" size={22} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* CONTENT */}
        <View style={styles.mainContent}>

          {/* CARD ROW 1 */}
          <View style={styles.cardRow}>
            <TouchableOpacity
              style={[styles.card, { backgroundColor: theme.card }]}
              onPress={() => handleCardPress("ph")}
            >
              <Image source={require("../assets/images/ph.png")} style={styles.icon} />
              <Text style={[styles.cardLabel, { color: theme.text }]}>pH</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.card, { backgroundColor: theme.card }]}
              onPress={() => handleCardPress("humidity")}
            >
              <Image source={require("../assets/images/humidity.png")} style={styles.icon} />
              <Text style={[styles.cardLabel, { color: theme.text }]}>Humidity</Text>
            </TouchableOpacity>
          </View>

          {/* CARD ROW 2 */}
          <View style={styles.cardRow}>
            <TouchableOpacity
              style={[styles.card, { backgroundColor: theme.card }]}
              onPress={() => handleCardPress("temperature")}
            >
              <Image source={require("../assets/images/temperature.png")} style={styles.icon} />
              <Text style={[styles.cardLabel, { color: theme.text }]}>Temperature</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.card, { backgroundColor: theme.card }]}
              onPress={() => handleCardPress("ec")}
            >
              <Image source={require("../assets/images/ec.png")} style={styles.icon} />
              <Text style={[styles.cardLabel, { color: theme.text }]}>EC</Text>
            </TouchableOpacity>
          </View>

          {/* RECENT TABLE */}
          <View style={[styles.table, { backgroundColor: theme.tableBackground }]}>
            <Text style={[styles.tableTitle, { color: theme.text }]}>Recent Readings</Text>

            {/* TABLE HEADER */}
            <View style={styles.tableRowHeader}>
              <Text style={[styles.tableHeader, { flex: 3, color: theme.text }]}>Date/Time</Text>
              <Text style={[styles.tableHeader, { flex: 1, color: theme.text }]}>Sensor</Text>
              <Text style={[styles.tableHeader, { flex: 1, color: theme.text }]}>Value</Text>
              <Text style={[styles.tableHeader, { flex: 1, color: theme.text }]}>Status</Text>
            </View>

            {/* TABLE ROWS */}
            {readings.map((r, i) => {
              const st = getStatusStyle(r.status);
              return (
                <View style={styles.tableRow} key={i}>
                  <Text style={[styles.tableCell, { flex: 3, color: theme.subText }]}>{r.datetime}</Text>
                  <Text style={[styles.tableCell, { flex: 1, color: theme.subText }]}>{r.sensor}</Text>
                  <Text style={[styles.tableCell, { flex: 1, color: theme.subText }]}>{r.value}</Text>

                  <View style={[styles.badge, { backgroundColor: st.bg, borderColor: st.border }]}>
                    <Text style={[styles.badgeText, { color: st.text }]}>{r.status}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        <BottomNav activeTab="reports" />
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 12, paddingHorizontal: 18 },
  headerLeft: { flexDirection: "row", alignItems: "center" },
  headerRight: { flexDirection: "row", alignItems: "center" },
  iconButton: { marginLeft: 12 },
  headerLogo: { width: 40, height: 40, marginRight: 12, resizeMode: "contain" },
  headerTitle: { fontSize: 20, fontWeight: "700" },
  mainContent: { padding: 12, flex: 1 },
  cardRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20 },
  card: {
    flex: 1,
    marginHorizontal: 6,
    borderRadius: 18,
    paddingVertical: 26,
    paddingHorizontal: 18,
    alignItems: "center",
    elevation: 4,
  },
  icon: { width: 65, height: 65, marginBottom: 12 },
  cardLabel: { fontSize: 15, fontWeight: "600" },

  table: { borderRadius: 12, padding: 10, marginTop: 10, elevation: 3 },
  tableTitle: { fontSize: 13, fontWeight: "700", textAlign: "center", marginBottom: 6 },

  tableRowHeader: { flexDirection: "row", paddingVertical: 5, borderBottomWidth: 1, borderColor: "#666" },
  tableRow: { flexDirection: "row", paddingVertical: 4, borderBottomWidth: 1, borderColor: "#444", alignItems: "center" },

  tableHeader: { fontSize: 11, fontWeight: "700", textAlign: "center" },
  tableCell: { fontSize: 10, textAlign: "center" },

  badge: {
    flex: 1,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 6,
    alignItems: "center",
    borderWidth: 1.5,
  },
  badgeText: { fontSize: 10, fontWeight: "700" },
});
