import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import Slider from '@react-native-community/slider';
import { useRouter, Link } from 'expo-router';

const SliderWithPercentage = () => {
  const [sliderValue, setSliderValue] = useState(0);

  const handleSubmit = () => {
    alert(`Submitted value: ${Math.round(sliderValue * 100)}%`);
  };
  const router = useRouter();
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>{'< Back'}</Text>
      </TouchableOpacity>
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
