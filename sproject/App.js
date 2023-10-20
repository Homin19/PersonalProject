import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import MainScreen from "./Screen/MainScreen";
import AddCarScreen from "./Screen/AddCarScreen";
import CarRecordScreen from "./Screen/CarRecordScreen";
import ImageViewScreen from "./Screen/ImageViewScreen";

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="MainScreen">
        <Stack.Screen name="Main" component={MainScreen} />
        <Stack.Screen name="AddCarScreen" component={AddCarScreen} />
        <Stack.Screen name="CarRecordScreen" component={CarRecordScreen} />
        <Stack.Screen name="ImageView" component={ImageViewScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
