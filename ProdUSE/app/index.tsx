import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

export default function Index() {
  return (

    <View style={styles.headerContainer}>
      {/* Left Image (Menu Button) */}
      <TouchableOpacity style={styles.iconContainer}>
        <Image
          source={require('../assets/images/menuicon.png')}  // Menu button image
          style={styles.iconImage}
        />
      </TouchableOpacity>
      {/* Logo and Title */}
      <View style={styles.titleContainer}>
      <Image
          source={require('../assets/images/produselogo.png')}  // logo image
          style={styles.logo}
        />
        <Text style={styles.title}>MY FRIDGE</Text> 
      </View>
      {/* Right Image (Plus Sign) */}
      <TouchableOpacity style={styles.iconContainer}>
        <Image
          source={require('../assets/images/plusicon.png')}  // Plus sign 
          style={styles.iconImage}
        />
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    height: 140,
    backgroundColor: '#41521f', 
  },
  iconContainer: {
    padding: 10,
  },
  iconImage: {
    width: 24,  
    height: 24,
    backgroundColor: 'transparent',
  },
  titleContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 47,
    height: 70,
    marginRight: 10, 
    backgroundColor: 'white', 
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    padding: 10,
  },
});
