// CarRecordScreen : 저장된 차량정보를 화면에 띄워주는 화면, 저장된 차량 삭제, 상세 기록으로 넘어가주는 역할을 하고 있음.
import React, { useState, useEffect } from "react"; // useEffect : 데이터 가져오기, 상태 업데이트, 라이브러리와의 통합, 구독 설정과 해제 등을 쉽게 관리할 수 있다.
// 컴포넌트의 라이프사이클에 따른 작업을 처리할 때 유용하게 활용된다.

import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../FireBase/DB";
import { useIsFocused } from "@react-navigation/native";

const CarRecordScreen = ({ navigation }) => {
  const [carData, setCarData] = useState([]); // 차량 정보를 저장할 상태
  const isFocused = useIsFocused(); // 화면 포커싱 여부를 체크하기 위한 훅

  // useEffect를 사용하여 화면 포커싱 시 데이터 가져오기
  useEffect(() => {
    if (isFocused) {
      getCarData(); // 화면이 포커싱되면 차량 정보를 가져옴
    }
  }, [isFocused]);

  // getCarData : Firestore에서 차량 정보를 가져오는 비동기 함수
  const getCarData = async () => {
    try {
      const carDataRef = collection(db, "AddCarData");
      const querySnapshot = await getDocs(carDataRef);
      let carDataArray = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        data.carId = doc.id;
        carDataArray.push(data);
      });

      setCarData(carDataArray); // 가져온 데이터를 carData 상태에 저장
    } catch (error) {
      console.error("차량 정보 불러오기 오류:", error);
    }
  };
  // renderCarInfo : Flatlist의 각 항목을 렌더링하는 함수
  const renderCarInfo = ({ item }) => (
    <View style={styles.carInfo}>
      <Text style={styles.carInfoText}>차 번호: {item.carNumber}</Text>
      <Text style={styles.carInfoText}>차 종: {item.carModel}</Text>
      <Image source={{ uri: item.carImage }} style={styles.image} />
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.DIYmemolistButton}
          onPress={() => handleViewCarInfo(item)}
        >
          <Text style={styles.buttonText}>DIY 기록 보기</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteCar(item)}
        >
          <Text style={styles.buttonText}>삭제</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
  // handleDeleteCar : 차량 정보를 삭제하는 함수
  const handleDeleteCar = async (carInfo) => {
    const carDataRef = collection(db, "AddCarData");
    const carDocRef = doc(carDataRef, carInfo.carId);

    // FireStore에서 문서 삭제
    try {
      await deleteDoc(carDocRef);
      getCarData(); // 업데이트된 차량 목록 다시 불러오기
    } catch (error) {
      console.error("차량 정보 삭제 오류:", error);
    }
  };

  const handleViewCarInfo = (carInfo) => {
    navigation.navigate("ImageView", { carInfo });
  };
  // FlatList 컴포넌트를 사용하여 차량 정보를 표시
  return (
    <FlatList
      data={carData}
      renderItem={renderCarInfo}
      keyExtractor={(item) => item.carId}
      ListEmptyComponent={
        <Text style={styles.noCarText}>등록된 차량 정보가 없습니다.</Text>
      }
      contentContainerStyle={{ padding: 20, alignItems: "center" }}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
  },
  carInfo: {
    alignItems: "center",
    marginBottom: 20,
  },
  carInfoText: {
    fontSize: 20,
    textAlign: "center",
    marginBottom: 10,
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 10,
  },
  deleteButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
    width: 150,
    alignItems: "center",
  },
  noCarText: {
    fontSize: 18,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row", // 버튼을 가로로 나열
    alignItems: "center", // 버튼을 수직으로 정렬
    marginTop: 10,
  },
  DIYmemolistButton: {
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 5, // 버튼 모서리 둥글게
    marginRight: 10, // 버튼 사이 간격 조절
  },
  deleteButton: {
    backgroundColor: "red",
    padding: 10, // 버튼 내부 패딩
    borderRadius: 5, // 버튼 모서리 둥글게
  },
  buttonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default CarRecordScreen;
