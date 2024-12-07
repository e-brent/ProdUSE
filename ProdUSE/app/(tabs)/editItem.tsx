import React, { useState } from 'react';
import { StyleSheet, Image, Platform, View} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { useLocalSearchParams, Link } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';


import EditGrocery from '@/components/EditGrocery';

export default function editItem() {

    const { id, name, amount, date, category, update } = useLocalSearchParams<{id: string; name: string; amount: string; date: string, category: string; update: string}>();

  return (
   <View style = {styles.container}>
    <EditGrocery
        item_id = {id}
        item_name = {name}
        item_amount = {amount}
        item_date = {date}
        item_category = {category}
        key = {update}
    >
    </EditGrocery>
   </View>
  );
}

const styles = StyleSheet.create({
 container: {
  alignItems: "center",
  flex: 1,
  justifyContent: "center",
 }
});
