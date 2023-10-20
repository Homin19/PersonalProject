import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";

const MainScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>내 차 DIY</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("AddCarScreen")}
        >
          <Text style={styles.buttonText}>내 차 등록</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("CarRecordScreen")}
        >
          <Text style={styles.buttonText}>내 차 DIY 현황</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  buttonContainer: {
    width: "100%",
    height: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  button: {
    width: 150,
    height: 150,
    backgroundColor: "blue", // 박스 버튼 스타일 적용
    padding: 15,
    borderRadius: 10, // 둥근 모서리 스타일 적용
    alignItems: "center", // 텍스트 가로 중앙 정령
    justifyContent: "center", // 텍스트 세로 중앙 정렬
  },
  buttonText: {
    color: "white",
    fontSize: 23,
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default MainScreen;
