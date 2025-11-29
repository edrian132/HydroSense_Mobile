import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import {
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Logo from "../../../assets/images/temperature.png";
import { ThemeContext } from "../../../context/themecontext";

/* ---------------- Dropdown ---------------- */
const Dropdown = ({ options, selected, onSelect }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme } = useContext(ThemeContext);

  return (
    <View style={{ position: "relative", flex: 1, marginHorizontal: 4 }}>
      <TouchableOpacity
        onPress={() => setIsOpen(!isOpen)}
        style={[
          styles.dropdownButton,
          {
            backgroundColor: theme.colors.card,
            borderColor: theme.colors.border,
          },
        ]}
      >
        <Text style={[styles.dropdownText, { color: theme.colors.text }]}>
          {selected}
        </Text>
        <Ionicons
          name={isOpen ? "chevron-up" : "chevron-down"}
          size={16}
          color={theme.colors.text}
        />
      </TouchableOpacity>

      {isOpen && (
        <View
          style={[
            styles.dropdownList,
            {
              backgroundColor: theme.colors.card,
              borderColor: theme.colors.border,
            },
          ]}
        >
          <FlatList
            data={options}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => {
                  onSelect(item);
                  setIsOpen(false);
                }}
              >
                <Text
                  style={[
                    styles.dropdownItemText,
                    { color: theme.colors.text },
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
};

/* ---------------- Status Checker ---------------- */
const getStatus = (sensor: string, value: any) => {
  if (sensor === "pH") {
    const v = parseFloat(value);
    if (v >= 5.8 && v <= 6.5) return "Optimal";
    if ((v >= 5.5 && v < 5.8) || (v > 6.5 && v <= 7.0)) return "Warning";
    return "Critical";
  }
  return "Unknown";
};

/* ---------------- Calendar Modal ---------------- */
const CalendarModal = ({ visible, onCancel, onConfirm }: any) => {
  const today = new Date();
  const [selectedDay, setSelectedDay] = useState(today.getDate());
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth());
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());

  const months = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December",
  ];

  const years = Array.from({ length: 21 }, (_, i) => today.getFullYear() - 10 + i);

  const getDaysInMonth = (month: number, year: number) => {
    const date = new Date(year, month, 1);
    const days: number[] = [];
    while (date.getMonth() === month) {
      days.push(date.getDate());
      date.setDate(date.getDate() + 1);
    }
    return days;
  };

  const days = getDaysInMonth(selectedMonth, selectedYear);

  useEffect(() => {
    if (selectedDay > days.length) setSelectedDay(days.length);
  }, [selectedMonth, selectedYear]);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={calendarStyles.overlay}>
        <View style={calendarStyles.container}>
          <Text style={calendarStyles.title}>Select Date</Text>

          <View style={calendarStyles.pickerRow}>
            <View style={{ flex: 1 }}>
              <Picker selectedValue={selectedMonth} onValueChange={setSelectedMonth}>
                {months.map((month, index) => (
                  <Picker.Item label={month} value={index} key={month} />
                ))}
              </Picker>
            </View>
            <View style={{ flex: 1 }}>
              <Picker selectedValue={selectedYear} onValueChange={setSelectedYear}>
                {years.map((year) => (
                  <Picker.Item label={String(year)} value={year} key={year} />
                ))}
              </Picker>
            </View>
          </View>

          <View style={calendarStyles.daysGrid}>
            {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => (
              <Text key={d} style={calendarStyles.dayHeader}>{d}</Text>
            ))}
            {days.map((day) => (
              <TouchableOpacity
                key={day}
                style={[
                  calendarStyles.dayItem,
                  day === selectedDay && calendarStyles.selectedDayItem,
                ]}
                onPress={() => setSelectedDay(day)}
              >
                <Text style={day === selectedDay ? calendarStyles.selectedText : calendarStyles.text}>
                  {day}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={calendarStyles.buttonRow}>
            <TouchableOpacity onPress={onCancel}>
              <Text style={calendarStyles.cancelButton}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onConfirm(new Date(selectedYear, selectedMonth, selectedDay))}>
              <Text style={calendarStyles.confirmButton}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

/* ---------------- Sorting Modal ---------------- */
const SortingModal = ({ visible, onClose, onSelect, selectedOption }: any) => {
  const { theme } = useContext(ThemeContext);
  const sortingOptions = ["Date: Newest", "Date: Oldest", "Value: High", "Value: Low"];

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={calendarStyles.overlay}>
        <View style={[calendarStyles.container, { width: 250 }]}>
          <Text style={calendarStyles.title}>Sort By</Text>
          {sortingOptions.map((option) => (
            <TouchableOpacity
              key={option}
              style={[
                styles.dropdownItem,
                {
                  backgroundColor: option === selectedOption ? "#3399ff" : theme.colors.card,
                },
              ]}
              onPress={() => {
                onSelect(option);
                onClose();
              }}
            >
              <Text
                style={[
                  styles.dropdownItemText,
                  { color: option === selectedOption ? "#fff" : theme.colors.text },
                ]}
              >
                {option}
              </Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity onPress={onClose} style={{ marginTop: 10 }}>
            <Text style={[calendarStyles.cancelButton, { textAlign: "center" }]}>
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

/* ---------------- Main Component ---------------- */
export default function PHReportsScreen() {
  const router = useRouter();
  const { theme } = useContext(ThemeContext);

  const [sensorData, setSensorData] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [sortingVisible, setSortingVisible] = useState(false);
  const [sortOption, setSortOption] = useState("Date: Newest");
  const [loading, setLoading] = useState(true);

  const statusOptions = ["All", "Optimal", "Warning", "Critical"];

  useEffect(() => {
    async function loadData() {
      try {
        const response = await fetch("YOUR_API_ENDPOINT_HERE");
        const data = await response.json();
        setSensorData(data);
      } catch (error) {
        console.error("Failed to fetch sensor data:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredData = sensorData
    .filter((item) => {
      if (!item.date || !item.value) return false;
      const dateObj = new Date(item.date);
      if (
        selectedDate &&
        (dateObj.getMonth() !== selectedDate.getMonth() ||
          dateObj.getFullYear() !== selectedDate.getFullYear())
      )
        return false;
      if (statusFilter !== "All" && getStatus(item.sensor, item.value) !== statusFilter)
        return false;
      return true;
    })
    .sort((a, b) => {
      switch (sortOption) {
        case "Date: Newest": return new Date(b.date).getTime() - new Date(a.date).getTime();
        case "Date: Oldest": return new Date(a.date).getTime() - new Date(b.date).getTime();
        case "Value: High": return b.value - a.value;
        case "Value: Low": return a.value - b.value;
        default: return 0;
      }
    });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* HEADER */}
      <View style={[styles.header, { marginBottom: 10 }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Image source={Logo} style={styles.logo} resizeMode="contain" />
          <Text style={[styles.headerTitle, { color: "#fff" }]}>Temperature Reports</Text>
        </View>
      </View>

      {/* FILTERS */}
      <View style={styles.filterRow}>
        <TouchableOpacity
          style={[styles.dropdownButton, { flex: 1, backgroundColor: theme.dark ? "#333" : "#fff" }]}
          onPress={() => setCalendarVisible(true)}
        >
          <Text
            style={[styles.dropdownText, { color: theme.dark ? "#fff" : "#000", fontWeight: "bold" }]}
          >
            {selectedDate
              ? selectedDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })
              : "Pick a Date"}
          </Text>
          <Ionicons name="calendar" size={16} color={theme.dark ? "#fff" : "#000"} />
        </TouchableOpacity>

        <Dropdown options={statusOptions} selected={statusFilter} onSelect={setStatusFilter} />

        <TouchableOpacity
          style={[styles.dropdownButton, { flex: 0, backgroundColor: "#3399ff" }]}
          onPress={() => setSortingVisible(true)}
        >
          <Text style={[styles.dropdownText, { color: "#gray", fontWeight: "bold" }]}>Sort</Text>
          <Ionicons name="funnel" size={16} color="#gray" />
        </TouchableOpacity>
      </View>

      {/* TABLE */}
      <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Recent Readings</Text>
      {loading ? (
        <Text style={{ textAlign: "center", marginTop: 20, color: theme.colors.text }}>
          Loading data...
        </Text>
      ) : (
        <FlatList
          data={filteredData}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            <Text style={{ textAlign: "center", marginTop: 20, fontSize: 12, color: theme.colors.text }}>
              No data for selected filters
            </Text>
          }
          renderItem={({ item }) => {
            const status = getStatus(item.sensor, item.value);
            const formattedDate = new Date(item.date).toLocaleDateString("en-US", {
              year: "numeric", month: "short", day: "numeric",
            });
            return (
              <View style={[styles.tableRow, { borderBottomColor: theme.colors.border }]}>
                <Text style={[styles.tableCell, { flex: 2, color: theme.colors.text }]}>
                  {formattedDate} {item.time}
                </Text>
                <Text style={[styles.tableCell, { flex: 1, color: theme.colors.text }]}>
                  {item.value}
                </Text>
                <View style={[styles.statusBadge, statusStyles[status]]}>
                  <Text style={styles.statusText}>{status}</Text>
                </View>
              </View>
            );
          }}
        />
      )}

      <CalendarModal
        visible={calendarVisible}
        onCancel={() => setCalendarVisible(false)}
        onConfirm={(date: Date) => {
          setSelectedDate(date);
          setCalendarVisible(false);
        }}
      />

      <SortingModal
        visible={sortingVisible}
        selectedOption={sortOption}
        onSelect={setSortOption}
        onClose={() => setSortingVisible(false)}
      />
    </SafeAreaView>
  );
}

/* ---------------- Status Styles ---------------- */
const statusStyles: any = {
  Optimal: { backgroundColor: "#e6ffe6", borderColor: "green" },
  Warning: { backgroundColor: "#fff4e6", borderColor: "orange" },
  Critical: { backgroundColor: "#ffe6e6", borderColor: "red" },
};

/* ---------------- Shared Styles ---------------- */
const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#8B0000",
    paddingVertical: 15,
  },
  backButton: {
    position: "absolute",
    left: 10,
    backgroundColor: "#a52a2a",
    borderRadius: 6,
    padding: 6,
  },
  headerCenter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: { width: 36, height: 36, marginRight: 8 },
  headerTitle: { fontSize: 18, fontWeight: "bold" },
  filterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 10,
  },
  dropdownButton: {
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 4,
  },
  dropdownText: { fontSize: 14 },
  dropdownList: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    maxHeight: 200,
    borderWidth: 1,
    borderRadius: 6,
    zIndex: 9999,
    elevation: 5,
  },
  dropdownItem: { padding: 10, borderBottomWidth: 1 },
  dropdownItemText: { fontSize: 14 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginHorizontal: 15,
    marginVertical: 8,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    paddingVertical: 5,
    alignItems: "center",
    marginHorizontal: 10,
  },
  tableCell: { fontSize: 11, textAlign: "center", paddingHorizontal: 2 },
  statusBadge: {
    flex: 1,
    marginHorizontal: 3,
    borderWidth: 1,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 1,
  },
  statusText: { fontWeight: "bold", fontSize: 11 },
});

/* ---------------- Calendar Styles ---------------- */
const calendarStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  container: {
    width: 300,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 10,
  },
  pickerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  daysGrid: { flexDirection: "row", flexWrap: "wrap" },
  dayHeader: {
    width: "14.28%",
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 4,
  },
  dayItem: {
    width: "14.28%",
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  selectedDayItem: { backgroundColor: "#3399ff", borderRadius: 20 },
  text: { color: "#333" },
  selectedText: { color: "#fff", fontWeight: "bold" },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  cancelButton: { color: "gray", fontWeight: "bold", fontSize: 13 },
  confirmButton: { color: "#3399ff", fontWeight: "bold", fontSize: 13 },
});
