import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { AntDesign } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";

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
  Modal,
  Alert,
  TextInput,
  Platform,
} from "react-native";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { FontAwesome5 } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";

import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";
import Constants from "expo-constants";

const PermissionComponent = () => {
  useEffect(() => {
    (async () => {
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== "granted") {
        await Notifications.requestPermissionsAsync();
      }
    })();
  }, []);

  return null;
};

// Function to schedule notification
const scheduleNotification = async (notificationTime) => {
  try {
    const identifier = await Notifications.scheduleNotificationAsync({
      content: {
        title: "Reminder",
        body: "Time to take",
        sound: "default",
        priority: Notifications.AndroidImportance.HIGH,
      },
      trigger: {
        hour: notificationTime.getHours(),
        minute: notificationTime.getMinutes(),
        repeats: true,
      },
    });

    console.log("Notification scheduled:", identifier);
  } catch (error) {
    console.error("Error scheduling notification:", error);
  }
};

// Define formatTime function to format time for display
const formatTime = (time) => {
  return `${time.getHours()}:${
    time.getMinutes() < 10 ? "0" : ""
  }${time.getMinutes()}`;
};

export default function MedicationScreen({}) {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [errorMsg, setErrorMsg] = useState(null);
  const [location, setLocation] = useState(null);

  const [showInputs, setShowInputs] = useState(false); // State to toggle showing inputs

  const [medications, setMedications] = useState([]); // State to store all medications
  const [newMedication, setNewMedication] = useState({
    medName: "",
    medForm: "",
    medPurpose: "",
    medFrequencyPerWeek: "",
    medFrequencyPerDay: "",
    medDosageTimes: new Date(),
  });
  const [showPicker, setShowPicker] = useState(false);
  const [showActiveMeds, setShowActiveMeds] = useState(false);

  ////////////////////////////////////////////////

  const handleTimeChange = (event, selectedTime) => {
    setShowPicker(false); // Hide DateTimePicker after selection

    if (selectedTime) {
      const currentDate = selectedTime || new Date();
      setNewMedication({
        ...newMedication,
        medDosageTimes: currentDate, // Update selected time in state
      });

      // Call function to schedule notification
      scheduleNotification(currentDate);
    }
  };

  // Function to open DateTimePicker
  const showTimepicker = () => {
    setShowPicker(true);
  };
  ////////////////////////////////////////////////////////
  // Function to fetch medications from AsyncStorage
  const fetchMedications = async () => {
    try {
      const storedMeds = await AsyncStorage.getItem("medications");
      if (storedMeds !== null) {
        setMedications(JSON.parse(storedMeds));
      }
    } catch (error) {
      console.error("Error fetching medications:", error.message);
      Alert.alert("Error", "Failed to fetch medications.");
    }
  };

  // Function to save medications to AsyncStorage
  const saveMedications = async (meds) => {
    try {
      await AsyncStorage.setItem("medications", JSON.stringify(meds));
      console.log("Medications saved:", meds);
    } catch (error) {
      console.error("Error saving medications:", error.message);
      Alert.alert("Error", "Failed to save medications.");
    }
  };

  useEffect(() => {
    fetchMedications();
  }, []);

  // Function to handle creation of a new medication
  function create() {
    const savedMedData = {
      id: Math.random().toString(36).substring(7),
      ...newMedication,
      medDosageTimes:
        newMedication.medDosageTimes instanceof Date
          ? newMedication.medDosageTimes
          : new Date(), // Ensure medDosageTimes is a Date object
    };

    const updatedMeds = [...medications, savedMedData];

    setMedications(updatedMeds);

    saveMedications(updatedMeds);

    Alert.alert("Medication Saved", "Medication details saved successfully.");

    // Clear input fields after saving
    setNewMedication({
      medName: "",
      medForm: "",
      medPurpose: "",
      medFrequencyPerWeek: "",
      medFrequencyPerDay: "",
      medDosageTimes: new Date(),
    });

    // Hide input fields after saving
    setShowInputs(false);
  }

  // Function to remove a medication
  function removeMedication(id) {
    const updatedMeds = medications.filter((med) => med.id !== id);
    setMedications(updatedMeds);
    saveMedications(updatedMeds);
    Alert.alert("Medication Removed", "Medication removed successfully.");
  }

  // Function to render list of medications
  const renderMedications = () => {
    return medications.map((medication) => (
      <View key={medication.id} style={styles.savedMedContainer}>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => removeMedication(medication.id)}
        >
          <MaterialCommunityIcons name="delete" size={24} color="#ced4da" />
        </TouchableOpacity>
        <View
          style={{
            flexDirection: "row",
            gap: 20,
            backgroundColor: "#343a40",
            padding: 10,
            marginTop: 10,
            borderRadius: 10,
            width: "75%",
          }}
        >
          <MaterialCommunityIcons name="pill" size={40} color="#e9ecef" />
          <View style={styles.savedMedText}>
            <Text style={styles.medDetails}>{medication.medName}</Text>
            {medication.medDosageTimes instanceof Date && (
              <Text style={styles.medDetails}>
                Reminder at: {formatTime(medication.medDosageTimes)}
              </Text>
            )}
          </View>
        </View>
      </View>
    ));
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
          Medications
        </Text>
      </View>

      <View style={{ flex: 12, backgroundColor: "#666" }}>
        <ImageBackground
          source={{
            uri: "https://wallpaper.forfun.com/fetch/f4/f432023252be19f010972db113bc3d22.jpeg?h=900&r=0.5",
          }}
          style={{ flex: 1, resizeMode: "cover" }}
        >
          {/* Always display active medications */}

          {!showInputs && (
            <View
              style={{
                paddingTop: 50,
                paddingHorizontal: 30,

                borderRadius: 50,
                // flex: 1,
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  marginBottom: 10,
                  color: "#e9ecef",
                }}
              >
                Active Meds
              </Text>
              {renderMedications()}
            </View>
          )}
          {!showInputs ? (
            <TouchableOpacity
              style={{
                backgroundColor: "#339af0",
                position: "absolute",
                width: "50%",
                height: 50,
                justifyContent: "center",
                alignItems: "center",
                bottom: 30,
                alignSelf: "center",

                borderRadius: 16,
              }}
              onPress={() => {
                setShowInputs(true);
              }}
            >
              <Text
                style={{
                  fontSize: 25,
                  color: "#fff",
                  letterSpacing: 0.75,
                  fontWeight: "bold",
                }}
              >
                Add a med
              </Text>
            </TouchableOpacity>
          ) : (
            <>
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: 50,
                  // backgroundColor: "orange",
                }}
              >
                <TextInput
                  style={styles.input}
                  placeholder="Medication Name"
                  value={newMedication.medName}
                  onChangeText={(medName) =>
                    setNewMedication({ ...newMedication, medName: medName })
                  }
                />
                <TextInput
                  style={styles.input}
                  placeholder="Medication Form"
                  value={newMedication.medForm}
                  onChangeText={(medForm) =>
                    setNewMedication({ ...newMedication, medForm: medForm })
                  }
                />
                <TextInput
                  style={styles.input}
                  placeholder="Purpose"
                  value={newMedication.medPurpose}
                  onChangeText={(medPurpose) =>
                    setNewMedication({
                      ...newMedication,
                      medPurpose: medPurpose,
                    })
                  }
                />
                <TextInput
                  style={styles.input}
                  placeholder="Frequency per Week"
                  value={newMedication.medFrequencyPerWeek}
                  onChangeText={(medFrequencyPerWeek) =>
                    setNewMedication({
                      ...newMedication,
                      medFrequencyPerWeek: medFrequencyPerWeek,
                    })
                  }
                />
                <TextInput
                  style={styles.input}
                  placeholder="Frequency per Day"
                  value={newMedication.medFrequencyPerDay}
                  onChangeText={(medFrequencyPerDay) =>
                    setNewMedication({
                      ...newMedication,
                      medFrequencyPerDay: medFrequencyPerDay,
                    })
                  }
                />

                <PermissionComponent />
                <TouchableOpacity
                  style={{
                    borderWidth: 1,
                    borderColor: "#4dabf7",
                    padding: 10,
                    marginBottom: 10,
                    width: "80%",
                    borderRadius: 8,
                    backgroundColor: "#74c0fc",
                  }}
                  onPress={() => setShowPicker(true)}
                >
                  <Text style={styles.buttonText}>Set Notification Time</Text>
                </TouchableOpacity>

                {showPicker && (
                  <View>
                    <DateTimePicker
                      value={newMedication.medDosageTimes}
                      mode="time"
                      display="spinner"
                      onChange={handleTimeChange}
                    />
                  </View>
                )}
                <TouchableOpacity style={styles.button} onPress={create}>
                  <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          {/* Display saved medication details */}

          {/* {medications.length > 0 && !showInputs && (
            <View
              style={{
                paddingTop: 50,
                paddingHorizontal: 30,

                borderRadius: 50,
                // flex: 1,
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  marginBottom: 10,
                  color: "#e9ecef",
                }}
              >
                Active Meds
              </Text>
              {renderMedications()}
            </View>
          )} */}
        </ImageBackground>
      </View>

      <View
        style={{
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-around",
          backgroundColor: "#343a40",
          //borderRadius: 300,
          //margin: 20,
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

        {/* <TouchableOpacity>
          <View>
            <MaterialCommunityIcons
              name="update"
              size={24}
              color="#e9ecef"
              onPress={() => {
                navigation.navigate("Updates");
              }}
            />
          </View>
        </TouchableOpacity> */}

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
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    width: "80%",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  medDetails: {
    color: "#e9ecef",
    fontSize: 18,
  },
  button: {
    backgroundColor: "#339af0",
    width: "50%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
    marginTop: 20,
  },
  buttonText: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
  },
  timePickerText: {
    color: "#333",
    fontSize: 18,
    marginBottom: 20,
  },
  timePickerModal: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  timePicker: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  timePickerInput: {
    width: 60,
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
});
