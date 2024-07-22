import React, { useState, useEffect, useRef } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  Alert,
} from "react-native";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import MedicationScreen from "./screens/MedicationScreen";
import MoreScreen from "./screens/MoreScreen";
import ProfileScreen from "./screens/ProfileScreen";

import { FontAwesome5 } from "@expo/vector-icons";

import { Ionicons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import * as Notifications from "expo-notifications";

function HomeScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  //calendar
  const [currentDate, setCurrentDate] = useState(new Date());
  const scrollViewRef = useRef(null);

  const [notificationPermission, setNotificationPermission] = useState(null);

  const handleNotificationPermission = async () => {
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      setNotificationPermission(status === "granted");
    } catch (error) {
      console.log("Error requesting notification permissions:", error);
    }
  };

  const handleNotificationIconPress = () => {
    if (notificationPermission === null) {
      // Notification permission not yet determined
      showNotificationPermissionAlert();
    } else if (notificationPermission === false) {
      // Notification permission denied
      showNotificationPermissionDeniedAlert();
    } else {
      // Notification permission granted
      // You can trigger your notification logic here
      alert("Notification triggered!");
    }
  };

  const showNotificationPermissionAlert = () => {
    Alert.alert(
      "Allow Notifications",
      "Would you like to receive notifications from MediMate?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Allow",
          onPress: handleNotificationPermission,
        },
      ]
    );
  };

  const showNotificationPermissionDeniedAlert = () => {
    Alert.alert(
      "Notification Permission Denied",
      "Please enable notifications in your device settings to receive notifications."
    );
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Scroll to current day of week and month
    scrollToCurrentDayOfWeek();
  }, []);

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthNumbers = Array.from({ length: 31 }, (_, i) => i + 1);

  const todayDayOfWeek = daysOfWeek[currentDate.getDay()];
  const todayMonthNumber = currentDate.getDate();
  const todayMonthString = currentDate.toLocaleString("default", {
    month: "long",
  });

  const scrollToCurrentDayOfWeek = () => {
    if (scrollViewRef.current) {
      const dayIndex = daysOfWeek.findIndex((day) => day === todayDayOfWeek);
      const monthIndex = todayMonthNumber - 1; // Convert to 0-based index
      const scrollToOffset = dayIndex; //

      // Scroll to the current day of the week
      scrollViewRef.current.scrollToOffset({
        offset: scrollToOffset,
        animated: true,
      });

      // Scroll to the current month number (bottom of the FlatList)
      setTimeout(() => {
        scrollViewRef.current.scrollToIndex({
          index: monthIndex,
          animated: true,
        });
      }, 500);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          backgroundColor: "#364fc7",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            letterSpacing: 0.75,
            color: "#e9ecef",
            marginLeft: 20,
          }}
        >
          MediMate
        </Text>
        <Ionicons
          name="notifications"
          size={24}
          color="#e9ecef"
          style={{ marginRight: 15 }}
          onPress={handleNotificationIconPress}
        />
      </View>
      <View
        style={{
          flex: 2,
          flexDirection: "row",
          gap: 15,
          backgroundColor: "#343a40",
          alignItems: "center",
          paddingLeft: 40,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Profile");
          }}
        >
          <AntDesign name="user" size={40} color="#e9ecef" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Profile");
          }}
        >
          <Text
            style={{
              fontSize: 20,
              color: "#e9ecef",
            }}
          >
            Profile
          </Text>
        </TouchableOpacity>
      </View>
      <View style={{ flex: 10, backgroundColor: "#e9ecef" }}>
        <ImageBackground
          source={{
            uri: "https://wallpaper.forfun.com/fetch/f4/f432023252be19f010972db113bc3d22.jpeg?h=900&r=0.5",
          }}
          style={{ flex: 1, resizeMode: "cover" }}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#495057",
            }}
          >
            {/* Days of the week */}
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                backgroundColor: "#495057",
                alignItems: "center",
                justifyContent: "space-around",
                width: "100%",
              }}
            >
              {daysOfWeek.map((day, index) => (
                <Text
                  key={day}
                  style={{
                    fontSize: 18,
                    fontWeight: "bold",
                    textAlign: "center",
                    width: 40,

                    color:
                      index === currentDate.getDay() ? "#22b8cf" : "#adb5bd",
                  }}
                >
                  {day}
                </Text>
              ))}
            </View>
            {/* Month numbers */}
            {/* <FlatList
              ref={scrollViewRef}
              horizontal
              showsHorizontalScrollIndicator={false}
              data={monthNumbers}
              keyExtractor={(item) => item.toString()}
              renderItem={({ item }) => (
                <Text
                  style={{
                    fontSize: 16,
                    textAlign: "center",
                    width: 30,
                    //paddingHorizontal: ,
                    color: item === todayMonthNumber ? "#22b8cf" : "#adb5bd",
                  }}
                >
                  {item}
                </Text>
              )}
              ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
              contentContainerStyle={{
                alignItems: "center",
                backgroundColor: "#495057",
              }}
            /> */}

            {/* Today's date */}
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                backgroundColor: "#495057",
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  color: todayMonthNumber ? "#22b8cf" : "#adb5bd",
                }}
              >
                {todayDayOfWeek}, {todayMonthString} {todayMonthNumber}
              </Text>
            </View>
          </View>

          <View style={{ flex: 4 }}>
            <TouchableOpacity
              style={{
                flexDirection: "column",
                alignItems: "center",
                alignSelf: "flex-end",
                justifyContent: "center",
                backgroundColor: "#74c0fc",
                width: 60,
                height: 60,
                borderRadius: 100,
                position: "absolute",
                bottom: 30,
                right: 30,
              }}
            >
              <AntDesign
                name="plus"
                size={30}
                color="#e9ecef"
                onPress={() => {
                  navigation.navigate("Medications");
                }}
              />
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>

      <View
        style={{
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-around",
          backgroundColor: "#343a40",
        }}
      >
        <TouchableOpacity>
          <View>
            <FontAwesome5 name="home" size={24} color="#e9ecef" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity>
          <View>
            <FontAwesome5
              name="pills"
              size={24}
              color="#e9ecef"
              onPress={() => {
                navigation.navigate("Medications");
              }}
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity>
          <View>
            <AntDesign
              name="setting"
              size={24}
              color="#e9ecef"
              onPress={() => {
                navigation.navigate("More");
              }}
            />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const Stack = createNativeStackNavigator();
export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          //screenOptions={{ headerShown: false }}
        >
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Medications"
            component={MedicationScreen}
            options={{
              title: "Medications",
              headerStyle: { backgroundColor: "blue" },
              headerTintColor: "white",
              headerShown: false,
            }}
          />

          <Stack.Screen
            name="More"
            component={MoreScreen}
            options={{
              title: "More",
              headerStyle: { backgroundColor: "blue" },
              headerTintColor: "white",
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Profile"
            component={ProfileScreen}
            options={{
              title: "More",
              headerStyle: { backgroundColor: "blue" },
              headerTintColor: "white",
              headerShown: false,
            }}
          />
        </Stack.Navigator>

        <StatusBar
          backgroundColor="black"
          style="light"
          animated={true}
          hidden={false}
        />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#fff",
  },
});
