import { View, Text, StyleSheet, SafeAreaView } from 'react-native';

export default function Profile() {
  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={styles.text}>Hello, this is the Profile page</Text>
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