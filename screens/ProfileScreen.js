import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { firestore } from "../firebaseConfig/firebase";
import { collection, doc, setDoc, addDoc } from "firebase/firestore";
import { db } from "../firebaseConfig/firebase";

import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  Button,
  StyleSheet,
  Image,
  Text,
  View,
  Dimensions,
  FlatList,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Alert,
  TextInput,
} from "react-native";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { FontAwesome5 } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";

import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

export default function ProfileScreen({ route }) {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [profileName, setProfileName] = useState("");

  useEffect(() => {
    fetchProfileName();
  }, []);

  const fetchProfileName = async () => {
    try {
      const storedName = await AsyncStorage.getItem("profileName");
      if (storedName !== null) {
        setProfileName(storedName);
      }
    } catch (error) {
      console.log("Error fetching profile name from AsyncStorage:", error);
    }
  };

  const updateProfileName = async (name) => {
    try {
      await AsyncStorage.setItem("profileName", name);
      setProfileName(name);
    } catch (error) {
      console.log("Error saving profile name to AsyncStorage:", error);
    }
  };

  const create = () => {
    addDoc(collection(db, "users"), {
      name: name,
      email: email,
      age: age,
    })
      .then(() => {
        console.log("Data submitted");
        updateProfileName(name);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View
        style={{
          flex: 2,
          flexDirection: "row",
          backgroundColor: "#364fc7",
          //alignItems: "center",
          paddingTop: 25,
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
          Edit Profile
        </Text>
      </View>

      <View style={{ flex: 12, backgroundColor: "#666" }}>
        <ImageBackground
          source={{
            uri: "https://wallpaper.forfun.com/fetch/f4/f432023252be19f010972db113bc3d22.jpeg?h=900&r=0.5",
          }}
          style={{ flex: 1, resizeMode: "cover", alignItems: "center" }}
        >
          <View
            style={{
              flex: 0.5,
              flexDirection: "row",
              gap: 15,
              marginTop: 20,

              alignItems: "center",
              paddingLeft: 40,
            }}
          >
            <TouchableOpacity>
              <AntDesign name="user" size={40} color="#e9ecef" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("Profile");
              }}
            >
              <Text style={{ fontSize: 20, color: "#e9ecef" }}>
                {profileName}
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              flex: 2,

              alignItems: "center",
              marginTop: 20,
              paddingHorizontal: 20,
              justifyContent: "center",
            }}
          >
            <View
              style={{
                flexDirection: "row",

                gap: 20,
                width: "100%",
              }}
            >
              <Text
                style={{ fontSize: 20, color: "#e9ecef", fontWeight: "bold" }}
              >
                Name
              </Text>
              <TextInput
                style={{
                  fontSize: 18,
                  color: "#f1f3f5",
                  fontWeight: "bold",
                  height: 40,
                  width: "75%",
                  borderColor: "#e9ecef",
                  backgroundColor: "#868e96",
                  borderWidth: 1,
                  marginBottom: 20,

                  paddingHorizontal: 10,
                }}
                value={name}
                onChangeText={(name) => {
                  setName(name);
                }}
                placeholder="Enter your name"
              />
            </View>
            <View
              style={{
                flexDirection: "row",

                gap: 20,
                width: "100%",
              }}
            >
              <Text
                style={{ fontSize: 20, color: "#e9ecef", fontWeight: "bold" }}
              >
                Email
              </Text>
              <TextInput
                style={{
                  fontSize: 18,
                  color: "#f1f3f5",
                  fontWeight: "bold",
                  height: 40,
                  width: "75%",
                  borderColor: "#e9ecef",
                  backgroundColor: "#868e96",
                  borderWidth: 1,
                  marginBottom: 20,

                  paddingLeft: 10,
                }}
                placeholder="Enter email"
                value={email}
                onChangeText={(email) => {
                  setEmail(email);
                }}
                keyboardType="email-address"
              />
            </View>

            <View
              style={{
                flexDirection: "row",

                gap: 20,
                width: "100%",
              }}
            >
              <Text
                style={{ fontSize: 20, color: "#e9ecef", fontWeight: "bold" }}
              >
                Age{"  "}
              </Text>
              <TextInput
                style={{
                  fontSize: 18,
                  color: "#f1f3f5",
                  fontWeight: "bold",
                  height: 40,
                  width: "75%",
                  borderColor: "#e9ecef",
                  backgroundColor: "#868e96",
                  borderWidth: 1,
                  marginBottom: 20,

                  paddingLeft: 10,
                }}
                placeholder="Enter age"
                value={age}
                onChangeText={(age) => {
                  setAge(age);
                }}
                keyboardType="number-pad"
              />
            </View>

            <TouchableOpacity onPress={create}>
              <View
                style={{
                  backgroundColor: "#a5d8ff",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 100,
                  height: 40,
                  borderRadius: 10,
                }}
              >
                <Text style={{ fontSize: 20, color: "#495057" }}>Submit</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={{ flex: 2 }}></View>
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
