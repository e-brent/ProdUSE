import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import Slider from '@react-native-community/slider';
import { useRouter, Link } from 'expo-router';

import { useSQLiteContext } from '../db/SQLiteProvider';
import Operations from '../db/operations';
import { PerishableItem, PastItem, Recipe } from '../db/types';

type AmountParams = {
  item_id: string;
  item_name: string;
  item_amount: string;
}

const SliderWithPercentage = ({item_id, item_name, item_amount} : AmountParams) => {
  let init_slider = parseFloat(item_amount);
  const [sliderValue, setSliderValue] = useState(init_slider);

  const router = useRouter();
  const ctx = useSQLiteContext();
  const client = new Operations(ctx);

  const handleSubmit = () => {
    client.editAmountUsed(parseInt(item_id), sliderValue);
    alert(`Submitted value: ${Math.round(sliderValue * 100)}%`);
    router.back();
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>{'< Back'}</Text>
      </TouchableOpacity>

      <Text style = {styles.title}>Drag the slider to edit the amount of {item_name} that you have used: </Text>
      {/* Slider */}
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={1}
        step={0.01}
        value={sliderValue}
        onValueChange={setSliderValue}
        minimumTrackTintColor="#C6DEA6"
        maximumTrackTintColor="#000000"
        thumbTintColor="#C6DEA6"
      />

      <Text style={styles.percentageText}>{Math.round(sliderValue * 100)}%</Text>
      <View>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    //fontWeight: 'bold',
    color: '#333',
    marginTop: 40,
    marginBottom: 20,
    textAlign: 'center',
  },
  slider: {
    width: 200,
    height: 40,
    marginBottom: 10,
  },
  percentageText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: '#C6DEA6',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000', 
  },
  backButton: {
    marginTop: 20,
    marginLeft: 15,
    padding: 10,
    backgroundColor: '#ddd',
    borderRadius: 5,
    width: 80,
 
  },
  backButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },  
});

export default SliderWithPercentage;
