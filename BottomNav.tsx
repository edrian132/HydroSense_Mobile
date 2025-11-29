import { usePathname, useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Path } from "react-native-svg";

const { width } = Dimensions.get("window");
const tabWidth = width / 4;

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();
  const animatedValue = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const tabs = [
    {
      key: "dashboard",
      icon: require("../assets/images/home.png"),
      label: "Home",
      route: "/(tabs)/dashboard",
    },
    {
      key: "reports",
      icon: require("../assets/images/chart.png"),
      label: "Reports",
      route: "/(tabs)/reports",
    },
    {
      key: "profile",
      icon: require("../assets/images/profile.png"),
      label: "Profile",
      route: "/(tabs)/profile",
    },
    {
      key: "settings",
      icon: require("../assets/images/setting.png"),
      label: "Settings",
      route: "/(tabs)/settings",
    },
  ];

  const activeIndex = tabs.findIndex((t) => pathname.includes(t.key));

  // Bubble position animation
  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: activeIndex === -1 ? 0 : activeIndex,
      duration: 350,
      easing: Easing.out(Easing.exp),
      useNativeDriver: false, // ✅ keep consistent
    }).start();
  }, [activeIndex]);

  const animatedLeft = animatedValue.interpolate({
    inputRange: [0, tabs.length - 1],
    outputRange: [tabWidth / 2 - 30, width - tabWidth + tabWidth / 2 - 30],
  });

  // Bubble grow effect
  const handleTabPress = (tab) => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.5,
        duration: 120,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false, // ✅ changed to false
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 80,
        useNativeDriver: false, // ✅ changed to false
      }),
    ]).start();

    setTimeout(() => {
      router.push(tab.route);
    }, 80);
  };

  const getPath = (index) => {
    const curveWidth = 90;
    const curveHeight = 45;
    const notchCenter = index * tabWidth + tabWidth / 2;
    return `
      M0 0 
      H${notchCenter - curveWidth / 2}
      C${notchCenter - curveWidth / 4} 0, ${notchCenter - curveWidth / 4} ${curveHeight}, ${notchCenter} ${curveHeight}
      C${notchCenter + curveWidth / 4} ${curveHeight}, ${notchCenter + curveWidth / 4} 0, ${notchCenter + curveWidth / 2} 0
      H${width}
      V80
      H0
      Z
    `;
  };

  return (
    <View style={styles.wrapper}>
      {/* Curved Background */}
      <Animated.View style={StyleSheet.absoluteFill}>
        <Svg width={width} height={80}>
          <Path d={getPath(activeIndex === -1 ? 0 : activeIndex)} fill="#8b0000" />
        </Svg>
      </Animated.View>

      {/* Animated Floating Bubble */}
      <Animated.View
        style={[
          styles.activeBubble,
          { left: animatedLeft, transform: [{ scale: scaleAnim }] },
        ]}
      >
        <View style={styles.activeIconContainer}>
          <Image
            source={tabs[activeIndex === -1 ? 0 : activeIndex]?.icon}
            style={[styles.icon, { tintColor: "#fff" }]}
          />
        </View>
      </Animated.View>

      {/* Navigation Tabs */}
      <View style={styles.container}>
        {tabs.map((tab) => {
          const isActive = pathname.includes(tab.key);
          return (
            <TouchableOpacity
              key={tab.key}
              style={styles.tab}
              onPress={() => handleTabPress(tab)}
              activeOpacity={0.8}
            >
              {!isActive && (
                <>
                  <Image
                    source={tab.icon}
                    style={[styles.icon, { tintColor: "#ccc" }]}
                  />
                  <Text style={styles.label}>{tab.label}</Text>
                </>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: "transparent",
    zIndex: 100,
  },
  container: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    height: "100%",
    paddingBottom: 5,
  },
  tab: {
    width: tabWidth,
    alignItems: "center",
    justifyContent: "center",
  },
  activeBubble: {
    position: "absolute",
    bottom: 15,
    width: 60,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 101,
  },
  activeIconContainer: {
    backgroundColor: "#8b0000",
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.35,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
  },
  icon: {
    width: 26,
    height: 26,
    resizeMode: "contain",
  },
  label: {
    fontSize: 12,
    color: "#ccc",
    marginTop: 3,
  },
});
