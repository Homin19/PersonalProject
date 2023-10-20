// AddCarScreen -> 차량의 정보(차 번호, 차종, 차량 이미지)을 입력하고 파이어베이스에 저장하는 기능을 하는 화면.
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../FireBase/DB";

// useState를 사용하여 상태 변수들을 선언 'carNumber', 'carModel',
//"carImage"는 차량 번호, 차종, 갤러리에서 선택한 이미지를 저장함.
const AddCarScreen = ({ navigation }) => {
  const [carNumber, setCarNumber] = useState("");
  const [carModel, setCarModel] = useState("");
  const [carImage, setCarImage] = useState(null);

  // pickImage : 이미지 선택 버튼을 눌렀을 때 갤러리에서 이미지를 선택하고 이미지 경로를 carImage 상태에 저장하는 역할을 함.
  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        // mediaTypes : 이미지 선택 시 허용할 미디어 타입을 지정하는 옵션
        // ImagePicker 모듈을 사용하여 이미지를 선택할 때, 사용자에게 어떤 종류의 미디어를 선택할 수 있는지를 결정.
        // 해당 코드에서는 'Images' 옵션을 사용하여 이미지 파일을 선택할 수 있도록 함.
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.cancelled) {
        setCarImage(result.uri);
      }
    } catch (error) {
      Alert.alert(
        "이미지 선택 오류",
        "이미지를 선택하는 중에 오류가 발생했습니다."
      );
    }
  };
  // saveCarData는 차량정보를 객체로 만들고 파이어베이스에 저장함.
  const saveCarData = async () => {
    const carData = {
      carNumber,
      carModel,
      carImage,
    };

    try {
      const carDataRef = collection(db, "AddCarData");
      const docRef = await addDoc(carDataRef, carData);

      console.log("Document written with ID: ", docRef.id);
      // 저장이 완료되면 Alert를 통해 알림을 띄우고 "확인"을 누르면 메인 화면으로 이동함.
      Alert.alert("저장 완료", "차량 정보가 저장되었습니다.", [
        {
          text: "확인",
          onPress: () => {
            navigation.navigate("Main");
          },
        },
      ]);
    } catch (error) {
      console.error("차량 정보 Firestore 저장 오류:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>차량 등록</Text>
      <TextInput
        style={styles.input}
        placeholder="차 번호"
        value={carNumber}
        onChangeText={(text) => setCarNumber(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="차 종"
        value={carModel}
        onChangeText={(text) => setCarModel(text)}
      />
      <Button title="이미지 선택" onPress={pickImage} />
      {carImage && <Image source={{ uri: carImage }} style={styles.image} />}
      <TouchableOpacity style={styles.saveButton} onPress={saveCarData}>
        <Text style={styles.buttonText}>저장</Text>
      </TouchableOpacity>
      <View style={styles.cancelButtonContainer}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.navigate("Main")}
        >
          <Text style={styles.buttonText}>취소</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
// style 코드
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    padding: 10,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 5,
    width: 150,
    alignItems: "center",
    marginBottom: 10, // "저장" 버튼과 간격을 둡니다.
  },
  cancelButtonContainer: {
    backgroundColor: "red", // "취소" 버튼을 빨간색으로 감싸기 위한 컨테이너 스타일
    padding: 10,
    borderRadius: 5,
    width: 150,
  },
  cancelButton: {
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});

export default AddCarScreen;
