import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useLocalSearchParams, Link } from 'expo-router';
import React, { useState } from 'react';

import ProductDetail from '@/components/ProductDetails';


export default function ItemDetails() {

  const { id, update } = useLocalSearchParams<{id: string; update: string;}>();

  //console.log(id);

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <ProductDetail
          key={update}
          item_id={id}
          update = {update}
        >
        </ProductDetail>
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
