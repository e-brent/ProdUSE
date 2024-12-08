import React, { useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, Image, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Link } from 'expo-router';

import { useSQLiteContext } from '../db/SQLiteProvider';
import Operations from '../db/operations';
import { PerishableItem, PastItem, Recipe } from '../db/types';

import fruitIcon from '../assets/images/fruitIcon-min.png';
import vegetableIcon from '../assets/images/vegetableIcon-min.png';
import dairyIcon from '../assets/images/dairyIcon-min.png';
import meatIcon from '../assets/images/meatIcon-min.png';
import otherIcon from '../assets/images/otherIcon-min.png';
import Ionicons from '@expo/vector-icons/Ionicons';
import appleIcon from '../assets/images/appleIcon-min.png';
import stawberryIcon from '../assets/images/strawberryIcon-min.png';


/*sources that I used
https://reactnative.dev/docs/flatlist?language=typescript
https://docs.expo.dev/versions/latest/sdk/image/#image
https://docs.expo.dev/ui-programming/react-native-styling-buttons/
https://reactnative.dev/docs/touchableopacity
https://medium.com/@jujunsetiawan10/how-to-create-progress-bar-in-react-native-f27ae2871ac3#:~:text=To%20create%20a%20modern-looking%20progress%20bar%20in%20React,by%20running%20the%20following%20command%3A%20yarn%20add%20react-native-progress
https://reactnative.dev/docs/view
*/

type ItemProps = {
  item: PerishableItem;
  backgroundColor: string;
  textColor: string;
  onSeeDetail: (id: string) => void; 
  onDelete: (id: string) => void; 
  update: number;
};

type ItemParameters = {
  search: boolean,
  item_name?: string,
  filter: boolean,
  filterCategory: string,
  filterOrder: string
}

const getCategoryIcon = (category: string | undefined, itemName: string): any => {
  if (itemName) {
    if (itemName.toLowerCase() === 'strawberries') return stawberryIcon;
    if (itemName.toLowerCase() === 'apples') return appleIcon;
  }

  if (!category) return otherIcon;

  switch (category.toLowerCase()) {
    case 'fruit': return fruitIcon;
    case 'vegetable': return vegetableIcon;
    case 'dairy': return dairyIcon;
    case 'meat/fish': return meatIcon;
    default: return otherIcon;
  }
};

const Item = ({ item, backgroundColor, textColor, onSeeDetail, onDelete, update }: ItemProps) => (
  <View style={[styles.item, { backgroundColor }]}>
    <View style={styles.row}>
      <Image source={getCategoryIcon(item.category,item.perishable_name)} style={styles.image} />      
            <View style={styles.textContainer}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={[styles.title, { color: textColor }]}>{item.perishable_name}</Text>

            <View style={styles.deleteContainer}>
              <TouchableOpacity onPress={() => onDelete(item.perishable_id)} style={styles.deleteButton}>
                <Ionicons name="close-circle" size={23} color="red" />
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { width: `${item.amount_used * 100}%`}]} />
          </View>
          <Text style={styles.percentageText}>{Math.round(item.amount_used * 100)}% used</Text>

          <View style={styles.buttonContainer}>
            <Link href={{pathname: './itemDetails', params: {id: item.perishable_id, update: update}}} onPress={() => onSeeDetail(item.perishable_id)} style={styles.button}>
              <Text style={styles.buttonText}>See Details</Text>
            </Link>
          </View>
      </View>
    </View>
  </View>
);

//item_name?: string
const ItemList = ({search, item_name, filter, filterCategory, filterOrder} : ItemParameters) => {  
  const [selectedId, setSelectedId] = useState<string>();

  const ctx = useSQLiteContext();
  const client = new Operations(ctx);
  const [items, setItems] = useState<PerishableItem[]>([]);
  const [newItem, setNewItem] = useState('');

  const [update, setUpdate] = useState(0);

  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;

      const prepareItems = async() => {
        if (newItem.length === 0) {
          console.log('prepare items');
    
          if (search && item_name?.localeCompare("") != 0){
            console.log('searching');
            setItems(await client.searchPerishableItems(item_name));
          }
          else if (filter){
            console.log('filtering');
            setItems(await client.filterPerishable(filterCategory, filterOrder));
          }
          else {
            console.log('get all items');
            setItems(await client.getPerishableItems());
          }
        }
      };

      prepareItems();

      return () => {
        isActive = false;
      };

    }, [newItem])
  );


  const handleSeeDetails = (id: string) => {
  };

  const handleDelete = React.useCallback(async (id: string) => {
    console.log('delete item');
    client.deletePerishable(id);
    setItems(await client.getPerishableItems());

  }, [newItem]);

  const handleClick = (id: string) => {
    setSelectedId(id);
    setUpdate(update + 1);
  }

  //const renderItem = ({ item }: { item: ItemData }) => {
  const renderItem = ({ item }: { item: PerishableItem }) => {
    const backgroundColor = item.perishable_id === selectedId ? '#FFFFFF' : '#FFFFFF';
    const color = item.perishable_id === selectedId ? 'black' : 'black';

  return (
    <Item
        item={item}
        //onPress={() => handleClick(item.perishable_id)}
        backgroundColor={backgroundColor}
        textColor={color}
        onSeeDetail={() => handleClick(item.perishable_id)} 
        onDelete={handleDelete}
        update={update} 
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.perishable_id}
        extraData={selectedId}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
 container:{
  flex: 1,
 },
  item: {
    padding: 20,
    marginVertical: 12,
    marginHorizontal: 10,
    width: 350,
    height: 180, 
    borderRadius: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1, 
    marginLeft: 10, 
  },
  title: {
    fontSize: 20,
    fontWeight: 600,
  },
  image: {
    width: 75,
    height: 75,
  },
  progressContainer: {
    height: 20, 
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    marginTop: 5, 
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#C6DEA6', 
    borderRadius: 5,
  },
  percentageText: {
    marginTop: 5,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000', 
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 10, 
  },
  button: {
    backgroundColor: '#C6DEA6', 
    padding: 10,
    borderRadius: 5,
    marginRight: 10, 
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
  deleteButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    height: 23,
    width: 23,
  },
  deleteContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    height: 23,
    width: 23,
    top: 0,
    right: 0,
    alignSelf: 'flex-start',
  }
});

export default ItemList;
