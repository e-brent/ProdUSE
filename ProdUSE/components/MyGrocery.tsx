import React, { useState } from 'react';
import { StyleSheet, TextInput, Text, View, Button, ScrollView, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import { StatusBar } from "expo-status-bar";
import { useRouter } from 'expo-router';

import { useSQLiteContext } from '../db/SQLiteProvider';
import Operations from '../db/operations';
import { PerishableItem, PastItem, Recipe } from '../db/types';

/* 
Sources of have used 
https://reactnative.dev/docs/button
https://reactnative.dev/docs/textinput
https://github.com/chelseafarley/DateTimePickerTutorialReactNative/tree/main
https://docs.expo.dev/versions/latest/sdk/date-time-picker/
*/

const AddGroceryItems = () => {
  const [perishable_name, onChangeText] = useState('');
  const [amount_used, onChangeNumber] = useState('');
  const [note, onChangeNote] = useState('');
  const [date_purchased, setDate] = useState(new Date());

  const router = useRouter();

  const ctx = useSQLiteContext();
  const client = new Operations(ctx);

  //create context and new operations etc., itemList file with imports at the top

  const onChange = (e, selectedDate) => {
    setDate(selectedDate || date_purchased);
  };

  const onSubmit = async () => {
    try { 
      await client.addPerishableItem(perishable_name, date_purchased, parseFloat(amount_used) || 0,'fruit');
      const items = await client.getPerishableItems(); // print items in db in console
      console.log('Current items in database:', items);
      alert("Item added!");
      router.back();
    } catch (error) {
      alert("Failed to add item");
      console.error(error);
    }
  };

  return (
    <SafeAreaProvider>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <SafeAreaView style={styles.container}>
          <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
            {/* Title */}
            <Text style={styles.title}>Add Grocery Item</Text>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Item Name</Text>
              <TextInput
                style={styles.input}
                onChangeText={onChangeText}
                value={perishable_name}
                placeholder="Enter item name"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Purchase Date</Text>
              <View style={styles.row}>
                <DateTimePicker
                  value={date_purchased}
                  mode="date"
                  is24Hour={true}
                  display="default"
                  onChange={onChange}
                  style={styles.datePicker}
                />
                <Text style={styles.dateText}>{date_purchased.toLocaleDateString()}</Text>
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Amount Used</Text>
              <TextInput
                style={styles.input}
                onChangeText={onChangeNumber}
                value={amount_used}
                placeholder="Enter amount used"
                placeholderTextColor="#999"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Notes</Text>
              <TextInput
                style={styles.noteInput}
                onChangeText={onChangeNote}
                value={note}
                placeholder="Add any additional notes"
                placeholderTextColor="#999"
                multiline
              />
            </View>

            <View style={styles.buttonContainer}>
              <Button
                title="Submit"
                color="green"
                onPress={() => onSubmit()} // This is the submit feedback - On Press
              />
            </View>
            <StatusBar style="auto" />
          </ScrollView>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
  },
  scrollContainer: {
    padding: 30,
    justifyContent: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 40,
    textAlign: 'center',
  },
  formGroup: {
    marginBottom: 30,
  },
  label: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  input: {
    height: 60,
    width: 300,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    fontSize: 18,
  },
  noteInput: {
    height: 100,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    fontSize: 18,
    textAlignVertical: 'top',
    paddingTop: 15,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  datePicker: {
    width: 150,
  },
  dateText: {
    fontSize: 18,
    color: '#555',
    marginLeft: 10,
  },
  buttonContainer: {
    marginTop: 30,
    borderRadius: 8,
    overflow: 'hidden',
  },
});

export default AddGroceryItems;
