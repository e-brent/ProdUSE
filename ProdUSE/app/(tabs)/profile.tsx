import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useLocalSearchParams, Link } from 'expo-router';

import ProductDetail from '@/components/ProductDetails';


export default function ItemDetails(id: string) {

  const { params } = useLocalSearchParams();
  //const id = params[0];

  console.log(params);
  
  return (
    <SafeAreaView style={styles.container}>
      <View>
      <ProductDetail
        item_id={id}
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
