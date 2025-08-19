import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Calendar } from "react-native-calendars";
import { Stack } from "expo-router";
import { COLORS, SIZES } from "../../constants";

const DailyReminder = () => {
  const [reminders, setReminders] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [manualTime, setManualTime] = useState("");
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Load reminders from storage
  useEffect(() => {
    const loadReminders = async () => {
      const storedReminders = await AsyncStorage.getItem("reminders");
      if (storedReminders) {
        setReminders(JSON.parse(storedReminders));
      }
    };
    loadReminders();
  }, []);

  // Add Reminder
  const handleAddReminder = async () => {
    if (!selectedDate) return;

    // Parse manual time if entered
    let reminderTime = selectedTime;
    if (manualTime) {
      const [hours, minutes] = manualTime.split(":").map(Number);
      if (!isNaN(hours) && !isNaN(minutes)) {
        reminderTime = new Date(selectedTime);
        reminderTime.setHours(hours, minutes, 0);
      }
    }

    const reminder = {
      id: Date.now().toString(),
      description: `Reminder for ${selectedDate}`,
      date: selectedDate,
      time: reminderTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      triggerDate: new Date(`${selectedDate}T${reminderTime.toTimeString().split(" ")[0]}`),
    };

    const updatedReminders = [...reminders, reminder];
    setReminders(updatedReminders);
    await AsyncStorage.setItem("reminders", JSON.stringify(updatedReminders));
    scheduleNotification(reminder);
  };

  // Schedule Notification
  const scheduleNotification = async (reminder) => {
    const triggerDate = new Date(reminder.triggerDate);
    if (Platform.OS === "web") {
      setTimeout(() => {
        new Notification("Reminder", { body: reminder.description });
      }, triggerDate - new Date());
    } else {
      await Notifications.scheduleNotificationAsync({
        content: { title: "Reminder", body: reminder.description },
        trigger: { date: triggerDate },
      });
    }
  };

  // Delete Reminder
  const deleteReminder = async (id) => {
    const updatedReminders = reminders.filter((reminder) => reminder.id !== id);
    await AsyncStorage.setItem("reminders", JSON.stringify(updatedReminders));
    setReminders(updatedReminders);
  };

  // Reminder component
  const Reminder = ({ item }) => (
    <View style={styles.reminderContainer}>
      <Text style={styles.description}>{item.description}</Text>
      <Text style={styles.date}>
        {item.date} - {item.time}
      </Text>
      <TouchableOpacity onPress={() => deleteReminder(item.id)} style={styles.deleteButton}>
        <Text style={styles.deleteText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: isDarkMode ? COLORS.darkBackground : COLORS.lightWhite,
      }}
    >
      <Stack.Screen options={{ headerTitle: "Daily Reminders" }} />
      <ScrollView contentContainerStyle={{ padding: SIZES.medium }}>
        <Calendar
          onDayPress={(day) => setSelectedDate(day.dateString)}
          markedDates={{
            [selectedDate]: { selected: true, selectedColor: COLORS.primary },
          }}
        />
        {showTimePicker && (
          <DateTimePicker
            value={selectedTime}
            mode="time"
            onChange={(event, selected) => {
              setSelectedTime(selected || selectedTime);
              setShowTimePicker(false);
            }}
          />
        )}
        <TextInput
          placeholder="Enter Time (HH:mm)"
          value={manualTime}
          onChangeText={setManualTime}
          keyboardType="numeric"
          maxLength={5}
          style={styles.input}
        />
        <Text style={styles.selected}>
          Date: {selectedDate || "None"}
        </Text>
        <Text style={styles.selected}>
          Time:{" "}
          {manualTime ||
            selectedTime.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
        </Text>
        <TouchableOpacity onPress={handleAddReminder} style={styles.button}>
          <Text style={styles.buttonText}>Add Reminder</Text>
        </TouchableOpacity>
        <Text style={styles.reminderHeader}>All Reminders:</Text>
        {reminders.length > 0 ? (
          reminders.map((rem) => <Reminder key={rem.id} item={rem} />)
        ) : (
          <Text>No reminders yet.</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  reminderContainer: {
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.small,
    padding: SIZES.small,
    marginVertical: SIZES.small,
  },
  description: { color: COLORS.lightWhite, fontWeight: "bold" },
  date: { color: COLORS.darkText, fontSize: SIZES.small },
  input: {
    borderColor: COLORS.primary,
    borderWidth: 1,
    padding: SIZES.small,
    marginVertical: SIZES.small,
  },
  selected: {
    fontSize: SIZES.medium,
    marginVertical: SIZES.small,
    color: COLORS.primary,
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: SIZES.medium,
    borderRadius: SIZES.medium,
    alignItems: "center",
  },
  buttonText: { color: COLORS.lightWhite, fontWeight: "bold" },
  deleteButton: { marginTop: SIZES.small, alignSelf: "flex-end" },
  deleteText: { color: "#FE7654", fontWeight: "bold" },
  reminderHeader: {
    fontSize: SIZES.large,
    fontWeight: "bold",
    color: COLORS.primary,
    marginVertical: SIZES.medium,
  },
});

export default DailyReminder;