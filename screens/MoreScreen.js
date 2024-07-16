import React, { useState, useEffect } from "react";

import * as Notifications from "expo-notifications";

import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import { FontAwesome5 } from "@expo/vector-icons";

import { Ionicons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function MoreScreen({ route }) {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

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
      showNotificationPermissionDeniedAlert();
    } else {
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
          More
        </Text>
      </View>

      <View style={{ flex: 12, backgroundColor: "#666" }}>
        <ImageBackground
          source={{
            uri: "https://wallpaper.forfun.com/fetch/f4/f432023252be19f010972db113bc3d22.jpeg?h=900&r=0.5",
          }}
          style={{ flex: 1, resizeMode: "cover" }}
        >
          <View
            style={{
              flex: 2,

              marginTop: 50,
              paddingHorizontal: 20,
              paddingTop: 20,
              gap: 10,
            }}
          >
            <TouchableOpacity
              onPress={handleNotificationIconPress}
              style={{
                flex: 1,
                justifyContent: "center",
                gap: 40,
                alignItems: "center",
                flexDirection: "row",
                backgroundColor: "#868e96",
                borderRadius: 15,
              }}
            >
              <Text style={{ fontSize: 30, color: "#5f3dc4" }}>
                Notification
              </Text>
              <Ionicons
                name="notifications"
                size={24}
                color="#5f3dc4"
                style={{ marginRight: 15 }}
              />
            </TouchableOpacity>
          </View>
          <View style={{ flex: 15 }}></View>
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
            <FontAwesome5
              name="home"
              size={24}
              color="#e9ecef"
              onPress={() => {
                navigation.navigate("Home");
              }}
            />
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
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#fff",
  },
});
