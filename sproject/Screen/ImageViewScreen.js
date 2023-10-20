import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  Button,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  deleteDoc,
  doc,
} from "firebase/firestore";

import { db } from "../FireBase/DB";
import * as ImagePicker from "expo-image-picker";

// route.params로 넘겨받은 carInfo 데이터를 가져옴
const ImageViewScreen = ({ route }) => {
  const { carInfo } = route.params;
  const [memo, setMemo] = useState("");
  const [photo, setPhoto] = useState("");
  const [memoList, setMemoList] = useState([]);

  // 메모 목록을 불러오기 위한 함수
  const loadMemoList = async () => {
    const memoQuery = query(
      collection(db, carInfo.carNumber), // 해당 차량 번호의 컬렉션
      orderBy("timestamp")
    );

    // 메모 데이터의 변경을 실시간으로 감지하고 업데이트
    onSnapshot(memoQuery, (snapshot) => {
      const memos = [];
      snapshot.forEach((doc) => {
        memos.push({ id: doc.id, ...doc.data() });
      });
      setMemoList(memos);
    });
  };

  // 컴포넌트가 처음 렌더링될 때 메모 목록을 불러옴
  useEffect(() => {
    loadMemoList();
  }, []);

  // 갤러리에서 사진 선택
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setPhoto(result.uri);
    }
  };

  // 데이터 삭제 함수
  const deleteData = async (docId) => {
    try {
      // 컬렉션에서 해당 문서 삭제
      await deleteDoc(doc(db, carInfo.carNumber, docId));
    } catch (error) {
      console.error("데이터 삭제 오류:", error);
    }
  };

  // 이미지와 메모를 독립적으로 저장하는 함수
  const saveImage = async () => {
    try {
      const carDataRef = collection(db, carInfo.carNumber);
      const newDocRef = await addDoc(carDataRef, {
        photo: photo,
        timestamp: new Date(),
      });
      setPhoto(""); // 입력 필드 초기화
    } catch (error) {
      console.error("이미지 저장 오류:", error);
    }
  };

  // 메모를 저장하는 함수
  const saveMemo = async () => {
    try {
      const carDataRef = collection(db, carInfo.carNumber);
      const newDocRef = await addDoc(carDataRef, {
        memo: memo,
        timestamp: new Date(),
      });
      setMemo(""); // 입력 필드 초기화
    } catch (error) {
      console.error("메모 저장 오류:", error);
    }
  };

  const renderMemoItem = ({ item }) => (
    <View style={styles.memoItem}>
      {item.photo ? (
        <Image source={{ uri: item.photo }} style={styles.memoImage} />
      ) : null}
      {item.memo ? <Text style={styles.memoText}>{item.memo}</Text> : null}
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => deleteData(item.id)}
      >
        <Text style={styles.deleteButtonText}>삭제</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Image source={{ uri: carInfo.carImage }} style={styles.image} />
      <Button title="사진 선택" onPress={pickImage} />
      {photo ? (
        <View>
          <Image source={{ uri: photo }} style={styles.memoImage} />
          <Button title="이미지 저장" onPress={saveImage} />
        </View>
      ) : null}
      <TextInput
        style={styles.input}
        placeholder="메모"
        value={memo}
        onChangeText={(text) => setMemo(text)}
      />
      <Button title="메모 저장" onPress={saveMemo} />

      <FlatList
        style={styles.memoList}
        data={memoList}
        renderItem={renderMemoItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 10,
  },
  input: {
    width: "100%",
    fontSize: 18,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  memoItem: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  memoText: {
    fontSize: 16,
    flex: 1,
    marginBottom: 10,
  },
  memoImage: {
    width: 260,
    height: 200,
    marginTop: 10,
  },
  deleteButton: {
    backgroundColor: "red",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    marginLeft: 10,
  },
  deleteButtonText: {
    color: "white",
  },
  memoList: {
    flex: 1, // FlatList를 화면 전체로 확장
  },
});

export default ImageViewScreen;
