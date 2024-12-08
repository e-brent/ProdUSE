import React, { useState, useEffect } from 'react';
import { StyleSheet, Image, View, Text, ScrollView} from 'react-native';
import { useSQLiteContext } from '../../db/SQLiteProvider';
import Operations from '../../db/operations';

import fruitIcon from '../../assets/images/fruitIcon-min.png';
import vegetableIcon from '../../assets/images/vegetableIcon-min.png';
import dairyIcon from '../../assets/images/dairyIcon-min.png';
import meatIcon from '../../assets/images/meatIcon-min.png';
import otherIcon from '../../assets/images/otherIcon-min.png';
import badge from '../../assets/images/badgeicon-min.png';
import appleIcon from '../../assets/images/appleIcon-min.png';
import stawberryIcon from '../../assets/images/strawberryIcon-min.png';
import { useFocusEffect } from 'expo-router';

// Define types for our metric data
type CategoryMetric = {
  category: string;
  avgUsage: number;
};

type ItemMetric = {
  itemName: string;
  purchaseCount: number;
};

const MyMetrics = () => {

  const [totalItems, setTotalItems] = useState(0);
  const [mostUsedCategory, setMostUsedCategory] = useState<CategoryMetric>({ category: '', avgUsage: 0 });
  const [leastUsedCategory, setLeastUsedCategory] = useState<CategoryMetric>({ category: '', avgUsage: 0 });
  const [mostPurchased, setMostPurchased] = useState<ItemMetric>({ itemName: '', purchaseCount: 0 });
  const [leastPurchased, setLeastPurchased] = useState<ItemMetric>({ itemName: '', purchaseCount: 0 });
  const [allCategoriesLogged, setAllCategoriesLogged] = useState(false);

  const ctx = useSQLiteContext();
  const operations = new Operations(ctx);

  const getCategoryIcon = (category: string | undefined): any => {
    if (!category) return otherIcon;

    switch (category.toLowerCase()) {
      case 'fruit': return fruitIcon;
      case 'vegetable': return vegetableIcon;
      case 'dairy': return dairyIcon;
      case 'meat/fish': return meatIcon;
      default: return otherIcon;
    }
  };


  useFocusEffect(
    React.useCallback(() => {
      console.log('rendering');

      const loadMetrics = async () => {
        try {

          const total = await operations.itemsLogged();
          setTotalItems(total);

          const mostUsed = await operations.mostUsedByCategory();
          if (mostUsed.length > 0) {
            setMostUsedCategory(mostUsed[0]);
          }

          const leastUsed = await operations.leastUsedByCategory();
          if (leastUsed.length > 0) {
            setLeastUsedCategory(leastUsed[0]);
          }

          const mostPurchasedItems = await operations.mostPurchasedItem();
          if (mostPurchasedItems.length > 0) {
            setMostPurchased(mostPurchasedItems[0]);
          }

          const leastPurchasedItems = await operations.leastPurchasedItem();
          if (leastPurchasedItems.length > 0) {
            setLeastPurchased(leastPurchasedItems[0]);
          }

          const loggedCategories = await operations.getLoggedCategories();
          const loggedCategoryNames = loggedCategories.map((cat) => cat.category);
          const expectedCategories = ['fruit', 'vegetable', 'dairy', 'meat/fish'];
          const categoriesLogged = expectedCategories.every((category) => loggedCategoryNames.includes(category));
          setAllCategoriesLogged(categoriesLogged);

        } catch (error) {
          console.error('Error loading metrics:', error);
        }
      };

      loadMetrics();
  }, [])
  );
  
    

  return (
    <ScrollView style={styles.background}>
      <View style={styles.headerContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Usage</Text>
        </View>
      </View>

      <View style={styles.container}>
        <View style={styles.total}>
          <Text style={styles.usage}>Total Items</Text>
          <Text style={styles.amount}>{totalItems}</Text>
        </View>
      </View>

      <View style={styles.container}>
        <View style={styles.used}>
          <Text style={styles.usage}>Most Used</Text>
          <Image
            source={getCategoryIcon(mostUsedCategory.category)}
            style={styles.iconImage}
          />
          <Text style={styles.amount}>
            {mostUsedCategory.category} ({mostUsedCategory.avgUsage}%)
          </Text>
        </View>
        <View style={styles.used}>
          <Text style={styles.usage}>Least Used</Text>
          <Image
            source={getCategoryIcon(leastUsedCategory.category)}
            style={styles.iconImage}
          />
          <Text style={styles.amount}>
            {leastUsedCategory.category} ({leastUsedCategory.avgUsage}%)
          </Text>
        </View>
      </View>

      <View style={styles.container}>
        <View style={styles.used}>
          <Text style={styles.usage}>Most Purchased</Text>
          <View style={styles.iconContainer}>
            <Image
              source={getCategoryIcon(undefined)} 
              style={styles.iconImage}
            />
          </View>
          <Text style={styles.amount}>
            {mostPurchased.itemName} ({mostPurchased.purchaseCount}x)
          </Text>
        </View>
        <View style={styles.used}>
          <Text style={styles.usage}>Least Purchased</Text>
          <View style={styles.iconContainer}>
            <Image
              source={getCategoryIcon(undefined)} 
              style={styles.iconImage}
            />
          </View>
          <Text style={styles.amount}>
            {leastPurchased.itemName} ({leastPurchased.purchaseCount}x)
          </Text>
        </View>
      </View>

      <Text style={styles.badgeTitle}>Achievement Badges</Text>
      <View style={styles.badgeContainer}>
        <Image source={badge} style={styles.badgeImage} />
        <Text style={styles.badgeText}>First Item Logged</Text>
      </View>
      
      {allCategoriesLogged && (<View style={styles.badgeContainer}>
        <Image source={badge} style={styles.badgeImage} />
        <Text style={styles.badgeText}>All Categories Logged</Text>
      </View>)}
    </ScrollView>
  );
};

export default MyMetrics;

const styles = StyleSheet.create({
background: {
  backgroundColor: '#292818',
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
badgeTitle: {
  color: '#ffffff',
  marginTop: 20,
  marginBottom: 5,
  fontSize: 20,
  fontWeight: 'bold',
  alignSelf: 'center'
},
badgeContainer:{
  //flexDirection: 'row',
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
