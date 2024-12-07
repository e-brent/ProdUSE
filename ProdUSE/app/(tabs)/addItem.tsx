import { StyleSheet, Image, Platform, View} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import AddGroceryItems from '@/components/MyGrocery';

export default function addItem() {
  return (
   <View style = {styles.container}>
    <ThemedText type= "title"> Hello World</ThemedText>
    <AddGroceryItems>
    </AddGroceryItems>
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
