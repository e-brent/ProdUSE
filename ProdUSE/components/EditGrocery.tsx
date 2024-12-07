import React, { useState, useEffect } from 'react';
import { StyleSheet, TextInput, Text, View, Button, ScrollView, Keyboard, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import { StatusBar } from "expo-status-bar";
import { useRouter } from 'expo-router';
import { useSQLiteContext } from '../db/SQLiteProvider';
import Operations from '../db/operations';
import { PerishableItem, PastItem, Recipe } from '../db/types';
import { SelectList } from 'react-native-dropdown-select-list';

import fruitIcon from '../assets/images/fruitIcon-min.png';
import vegetableIcon from '../assets/images/vegetableIcon-min.png';
import dairyIcon from '../assets/images/dairyIcon-min.png';
import meatIcon from '../assets/images/meatIcon-min.png';
import otherIcon from '../assets/images/otherIcon-min.png';

const image = (category: string) => {
    if (category == 'fruit'){
      return fruitIcon;
    }
    else if (category == 'vegetable'){
      return vegetableIcon;
    }
    else if (category == 'dairy'){
      return dairyIcon;
    }
    else if (category == 'meat'){
      return meatIcon;
    }
    else {
      return otherIcon;
    }
};  

type EditParams = {
    item_id: string;
    item_name: string;
    item_amount: string;
    item_date: string;
    item_category: string;
}

const EditGrocery = ({item_id, item_name, item_amount, item_date, item_category} : EditParams) => {
    const router = useRouter();
    const ctx = useSQLiteContext();
    const client = new Operations(ctx);
    
    const [perishable_name, onChangeText] = useState(item_name);
    const [amount_used, onChangeNumber] = useState(item_amount);
    const [note, onChangeNote] = useState('');
    const [date_purchased, setDate] = useState(new Date(item_date));
    
    const [category, setCategory] = useState(item_category); // State for selected category

    const categoryData = [
      {key: '1', value: 'fruit'},
      {key: '2', value: 'vegetable'},
      {key: '3', value: 'dairy'},
      {key: '4', value: 'meat/fish'},
      {key: '5', value: 'other'},
    ];

    const onChange = (e, selectedDate) => {
      setDate(selectedDate || date_purchased);
    };

    const onSubmit = async () => {
        try {
          await client.editPerishableItem(parseInt(item_id), perishable_name, date_purchased, parseFloat(amount_used) || 0, category); // Include category
          //await client.editAmountUsed(parseInt(item_id), parseFloat(amount_used));
          alert("Item edited!");
          router.back();
        } catch (error) {
          alert("Failed to edit item");
          console.error(error);
        }
    };

    return (
      <SafeAreaProvider>
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <SafeAreaView style={styles.container}>
            {/* Back Button */}
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <Text style={styles.backButtonText}>{'< Back'}</Text>
            </TouchableOpacity>
            <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
              <Text style={styles.title}>Edit {perishable_name}</Text>
              
              {/* Item Name */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Item Name</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={onChangeText}
                  value={perishable_name}
                  placeholder= {perishable_name}
                  placeholderTextColor="#999"
                />
              </View>
  
              {/* Category Dropdown */}
                <View style={styles.formGroup}>
                <Text style={styles.label}>Category</Text>
                <SelectList
                  setSelected={(val) => setCategory(val)}
                  data={categoryData}
                  save="value"
                  boxStyles = {{backgroundColor: 'white', borderColor: 'lightgrey'}}
                />
              </View>
  
              {/* Purchase Date */}
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
                  
                  <Text style={styles.dateText}>{date_purchased.toDateString()}</Text> 
                  {/*.toLocaleDateString()*/}
                </View>
              </View>
  
              {/* Amount Used */}
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
  
              {/* Notes */}
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
  
              {/* Submit Button */}
              <View style={styles.buttonContainer}>
                <Button title="Submit Edits" color="green" onPress={() => onSubmit()} />
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
  backButton: {
    marginTop: 20,
    marginLeft: 15,
    padding: 10,
    backgroundColor: '#ddd',
    borderRadius: 5,
    width: 80,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EditGrocery;
