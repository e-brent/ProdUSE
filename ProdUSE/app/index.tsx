import { View, Text, Image, TouchableOpacity, StyleSheet, SafeAreaView, TextInput} from 'react-native';
import ItemList from '../components/ItemList';

export default function Index() {
  return (
<View style={styles.background}>
<View style={styles.headerContainer}>
      {/* Left Image (Menu Button) */}
      <TouchableOpacity style={styles.iconContainer}>
        <Image
          source={require('../assets/images/filtericon.png')}  // Menu button image
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

    <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search..."
          placeholderTextColor="gray"
        />
      </View>

    <View style={styles.list}>
      <ItemList>
      </ItemList>
    </View>
</View>
    
  );
}
const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    paddingTop: 80,
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
    marginBottom: 15,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 47,
    height: 70,
    marginRight: 10, 
    backgroundColor: 'white',
    marginBottom: 15, 
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    padding: 10,
    marginBottom: 15,
  },
  background: {
    backgroundColor: 'black',
    flex: 1,
  },
  searchContainer: {
    padding: 10,
    backgroundColor: '#e0e0e0',
  },
  searchInput: {
    height: 40,
    borderColor: '#e0e0e0',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    backgroundColor: 'white',
  },
  list: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
