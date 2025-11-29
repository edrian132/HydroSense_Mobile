import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";
import { LogoIntro } from "../../components/logointro"; // ✅ adjust path if inside /app

export default function IndexPage() {
  const router = useRouter();

  // Called after the animation is finished
  const handleAnimationFinish = () => {
    router.replace("/login"); // Go to login screen
  };

  return (
    <View style={styles.container}>
      <LogoIntro onAnimationFinish={handleAnimationFinish} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
});
