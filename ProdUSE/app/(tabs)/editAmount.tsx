import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useLocalSearchParams, Link } from 'expo-router';
import React, { useState } from 'react';

import SliderWithPercentage from '@/components/Slider';


export default function EditAmount() {

  const { id, name, amount, update } = useLocalSearchParams<{id: string; name: string; amount: string; update: string;}>();

  //console.log(id);

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <SliderWithPercentage
          key = {update}
          item_id = {id}
          item_name = {name}
          item_amount = {amount}
        >
        </SliderWithPercentage>
      </View>
    </SafeAreaView>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',  
    alignItems: 'center',     
    backgroundColor: '#f8f8f8', 
  },
  text: {
    fontSize: 24, 
    fontWeight: 'bold', 
  },
});
