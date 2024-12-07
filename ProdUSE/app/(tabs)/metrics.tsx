import { StyleSheet, Image, Platform, View, Text} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
// import AddGroceryItems from '@/components/MyGrocery';

import fruitIcon from '../../assets/images/fruitIcon-min.png';
import vegetableIcon from '../../assets/images/vegetableIcon-min.png';
import dairyIcon from '../../assets/images/dairyIcon-min.png';
import meatIcon from '../../assets/images/meatIcon-min.png';
import otherIcon from '../../assets/images/otherIcon-min.png';
import badge from '../../assets/images/badgeicon-min.png';


export default function myMetrics() {
  return (
  <View style={styles.background}>
    <View style={styles.headerContainer}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Usage</Text>
      </View>  
    </View>

    <View style={styles.container}>
      <View style={styles.total}>
        <Text style={styles.usage}>Total Items</Text>
        <Text style={styles.amount}>000</Text>
      </View>
    </View>

    <View style={styles.container}>
      <View style={styles.used}>
        <Text style={styles.usage}>Most Used</Text>
        <Image source={meatIcon} style={styles.iconImage} />
        <Text style={styles.amount}>Meat</Text>
      </View>
      <View style={styles.used}>
        <Text style={styles.usage}>Least Used</Text>
        <Image source={vegetableIcon} style={styles.iconImage} />
        <Text style={styles.amount}>Vegetables</Text>
      </View>
    </View>
    
    <View style={styles.container}>
      <View style={styles.used}>
        <Text style={styles.usage}>Most Purchased</Text>
        <View style={styles.iconContainer}>
        <Image source={dairyIcon} style={styles.iconImage} />
        </View>
        <Text style={styles.amount}>Eggs</Text>
      </View>
      <View style={styles.used}>
        <Text style={styles.usage}>Least Purchased</Text>
        <View style={styles.iconContainer}>
        <Image source={fruitIcon} style={styles.iconImage} />
        </View>
        <Text style={styles.amount}>Blueberries</Text>
      </View>
    </View>

    <View style={styles.badgeContainer}>
      <Image
        source={badge}
        style={styles.badgeImage}
        />
        <Text style={styles.badgeText}>First Item Logged</Text>
    </View>
  </View>
  );
}

const styles = StyleSheet.create({
background: {
  backgroundColor: '#5c5346',
  flex: 1,
},
headerContainer: {
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: 10,
  paddingTop: 65,
  height: 140,
  backgroundColor: '#41521f',
 },
 titleContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center'
 },
 title: {
  fontSize: 30,
  fontWeight: 'bold',
  color: 'white',
  padding: 10,
  marginBottom: 5,
},
 total:{
  flex: 1, 
  height: 100, 
  marginHorizontal: 5, 
  borderRadius: 10, 
  backgroundColor: '#f1a208', 
  justifyContent: 'center', 
  alignItems: 'center', 
  padding: 10,
 },
 used:{
  flex: 1, 
  height: 150, 
  marginHorizontal: 5, 
  borderRadius: 10, 
  backgroundColor: '#7ebdc3', 
  justifyContent: 'center', 
  alignItems: 'center', 
  padding: 10,
 },
 rectangle:{
  flex: 1,
  height: 175,
  marginHorizontal: 5, 
  borderRadius: 10, 
  backgroundColor: '#ccdbd2', 
  justifyContent: 'center', 
  alignItems: 'center', 
  padding: 10,
 },
 container: {
  flexDirection: 'row', 
  justifyContent: 'space-between', 
  alignItems: 'center',
  padding: 10,
 },
 usage: {
  color: '#ffffff',
  marginBottom: 5,
  fontSize: 20
 }, 
 amount: {
  fontSize: 16
 },
iconContainer: {
  flexDirection: 'row',
  alignItems: 'center'
},
iconImage: {
  width: 70,
  height: 70,
  backgroundColor: 'transparent'
},
badgeContainer:{
  // flexDirection: 'row',
  padding: 15,
  alignItems: 'center'
},
badgeText: {
  color: 'white',
  padding: 5,
  fontStyle: 'italic',
  textAlign: 'center'
},
badgeImage: {
  width: 70,
  height: 95,
  justifyContent: 'center'
}
});
