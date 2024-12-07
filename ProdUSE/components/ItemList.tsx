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
  onPress: () => void;
  backgroundColor: string;
  textColor: string;
  onEdit: (id: string) => void; 
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

const image = (category: string) => {
    if (category == 'fruit'){
      return fruitIcon;
    }
    else if (category == 'vegetable'){
      return vegetableIcon;
    }
    else if (category == 'dairy'){
      return dairyIcon;
    }
    else if (category == 'meat'){
      return meatIcon;
    }
    else {
      return otherIcon;
    }
};

const Item = ({ item, onPress, backgroundColor, textColor, onEdit, onDelete, update }: ItemProps) => (
  <Link href={{pathname: './itemDetails', params: {id: item.perishable_id, update: update}}} onPress={onPress} style={[styles.item, { backgroundColor }]}>
    <View style={styles.row}>
        <Image source={image(item.category)} style={styles.image} />      
        <View style={styles.textContainer}>
        <Text style={[styles.title, { color: textColor }]}>{item.perishable_name}</Text>
        
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: `${item.amount_used * 100}%`}]} />
        </View>
        <Text style={styles.percentageText}>{Math.round(item.amount_used * 100)}%</Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={() => onEdit(item.perishable_id)} style={styles.button}>
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onDelete(item.perishable_id)} style={styles.button}>
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Link>
);

//item_name?: string
const ItemList = ({search, item_name, filter, filterCategory, filterOrder} : ItemParameters) => {  
  const [selectedId, setSelectedId] = useState<string>();

  const ctx = useSQLiteContext();
  const client = new Operations(ctx);
  const [items, setItems] = useState<PerishableItem[]>([]);
  const [newItem, setNewItem] = useState('');

  const [update, setUpdate] = useState(0);

  /*
  const prepareItems = React.useCallback(async () => {

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
  }, [newItem]);

  React.useEffect(() => {
    void prepareItems();
  }, [prepareItems]);
  */

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


  const handleEdit = (id: string) => {
  };

  const handleDelete = React.useCallback(async (id: string) => {
    client.deletePerishable(id);
    setItems(await client.getPerishableItems());

  }, [newItem]);

  const handleClick = (id: string) => {
    setSelectedId(id);
    setUpdate(update + 1);
  }

  //const renderItem = ({ item }: { item: ItemData }) => {
  const renderItem = ({ item }: { item: PerishableItem }) => {
    const backgroundColor = item.perishable_id === selectedId ? '#F18208' : '#FFFFFF';
    const color = item.perishable_id === selectedId ? 'white' : 'black';

  return (
    <Item
        item={item}
        onPress={() => handleClick(item.perishable_id)}
        backgroundColor={backgroundColor}
        textColor={color}
        onEdit={handleEdit} 
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
    width: 100,
    height: 100,
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
});

export default ItemList;
