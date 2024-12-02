import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import ProductDetail from '@/components/ProductDetails';

export default function Profile() {
  return (
    <SafeAreaView style={styles.container}>
      <View>
      <ProductDetail>
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
