import React, { useState } from 'react';
import {SafeAreaView, StyleSheet, Text, TouchableOpacity, Image, View, FlatList} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { useSQLiteContext } from '../db/SQLiteProvider';
import Operations from '../db/operations';
import { PerishableItem, PastItem, Recipe } from '../db/types';

import fruitIcon from '../assets/images/fruitIcon-min.png';
import vegetableIcon from '../assets/images/vegetableIcon-min.png';
import dairyIcon from '../assets/images/dairyIcon-min.png';
import meatIcon from '../assets/images/meatIcon-min.png';
import otherIcon from '../assets/images/otherIcon-min.png';
import appleIcon from '../assets/images/appleIcon-min.png';
import stawberryIcon from '../assets/images/strawberryIcon-min.png';
import broccoliIcon from '../assets/images/broccoliIcon-min.png';
import bananaIcon from '../assets/images/bananaIcon-min.png';

import Icon from 'react-native-vector-icons/MaterialIcons';
import { useRouter, Link } from 'expo-router';

type ItemData = {
    id: string;
    title: string;
    imageUrl: string;
    brought: number;
    quantity: number;
    expiration: string;
    purchasedate: string; 
    currentDate: string;
    progress: number;
    waysToEat: string [];

  };

const ITEM: ItemData = {
  id: '3',
  title: 'Apples',
  imageUrl: 'https://picsum.photos/seed/696/3000/2000',
  brought: 2,
  quantity: 9,
  expiration: '12/5/24',
  purchasedate: '12/5/24',
  currentDate: '12/5/24',
  progress: 0.5,
  waysToEat: [
    'Slice and serve with peanut butter.',
    'Make an apple pie or crumble.',
    'Blend into a smoothie.',
    'Add to a salad for sweetness.',
    'Bake with cinnamon and sugar.',
  ],
};

const image = (category: string | undefined, itemName: string): any => {
  if (itemName) {
    if (itemName.toLowerCase() === 'strawberries') return stawberryIcon;
    if (itemName.toLowerCase() === 'apples') return appleIcon;
    if(itemName.toLowerCase() === 'broccoli') return broccoliIcon;
    if(itemName.toLowerCase() === 'bananas') return bananaIcon;
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

type DetailParams ={
  item_id: string;
  update: string;
}

const ProductDetail = ({item_id, update} : DetailParams) => {
  const ctx = useSQLiteContext();
  const client = new Operations(ctx);
  const [item, setItem] = useState<PerishableItem | null>();
  const [updater, setUpdater] = useState(update);

  const router = useRouter();

  const calculateDaysInFridge = (purchaseDateString: string) => {
    const purchaseDate = new Date(purchaseDateString);
    const currentDate = new Date();
    const timeDiff = currentDate.getTime() - purchaseDate.getTime();
    return Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); // 1 day = 86400000 ms
  };

  //const daysInFridge = ;

  const handleEdit = () => {
    setUpdater(updater + 1);
    console.log('Edit button clicked');
  };

  const handleThrowOut = async (id: string) => {
    console.log(`Item ${id} marked as throw out.`);
    if (item){
      await client.addPastItem(item.perishable_name, item.date_purchased, new Date(), item.days_in_fridge, false, item.amount_used, item.category);
    }
    await client.deletePerishable(parseInt(id));
  };

  const handleRecipe = (id: string) => {
    console.log(`Recipe options for item ${id}.`);
  };

  const handleUsed = (id: string) => {
    setUpdater(updater + 1);
    console.log(`More of ${id} has been used.`);
  };

  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;

      const getItem = async() => {
        console.log('getting item details');
        let id = parseInt(item_id);
        setItem(await client.getPerishableItem(id));
      }

      getItem();

      return () => {
        isActive = false;
      };

    }, [setItem])
  );
    
    
  if (item){

    return (
      <SafeAreaView style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>{'< Back'}</Text>
       </TouchableOpacity>
      {/* Edit Icon */}
      <Link href={{pathname: './editItem', params: {id: item.perishable_id, name: item.perishable_name, amount : item.amount_used, date : item.date_purchased.toString(), category : item.category, update: updater}}} style={styles.editIcon} onPress={handleEdit}>
        <Icon name="edit" size={30} color="black" />
      </Link>

      <View style={styles.item}>
        <Image source={image(item.category,item.perishable_name)} style={styles.image} />
        <Text style={styles.title}>{item.perishable_name}</Text>
        <Text style={styles.paragraphtitle}>Purchase Date: {item.date_purchased.toDateString()}</Text>
        <Text style={styles.paragraphtitle}>Days in Fridge: {calculateDaysInFridge(item.date_purchased.toDateString())}</Text>

        {/* Progress Bar */}
        <View>
          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { width: `${item.amount_used * 100}%` }]} />
          </View>
          <Text style={[styles.percentageText, { textAlign: 'right' }]}>
            {Math.round(item.amount_used * 100)}% used
          </Text>
        </View>

        {/* Ways to Eat */}
        <View style={styles.listContainer}>
          <Text style={styles.paragraphtitle}>Ways to Eat:</Text>
          <FlatList
            data={ITEM.waysToEat}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.bulletItem}>
                <Text style={styles.bulletPoint}>{'\u2022'}</Text>
                <Text style={styles.bulletText}>{item}</Text>
              </View>
            )}
          />
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={() => handleThrowOut(ITEM.id)} style={styles.button}>
            <Text style={styles.buttonText}>Throw Out</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleRecipe(ITEM.id)} style={styles.button}>
            <Text style={styles.buttonText}>Recipe</Text>
          </TouchableOpacity>
          <View style={styles.button}>
            <Link href={{pathname: './editAmount', params: {id: item.perishable_id, name: item.perishable_name, amount: item.amount_used, update: updater}}} onPress={() => handleUsed(ITEM.id)} >
              <Text style={styles.buttonText}>Use Item</Text>
            </Link>
          </View>
        </View>
      </View>
    </SafeAreaView>
    );
  }
  else {
    return(
      <SafeAreaView>
        <Text style = {styles.title}>Unable to retrieve item</Text>
      </SafeAreaView>
    )
  }

  
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  editIcon: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 1,
  },
  item: {
    padding: 20, 
    borderRadius: 10,
    alignItems: 'center',
    },

  image: {
    width: 150,
    height: 150,
    borderRadius: 10,
    marginBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginVertical: 4,
    textAlign: 'center',
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
    marginTop: 15,
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    flex: 1,
    backgroundColor: '#C6DEA6',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'black',
    fontSize: 14,
    fontWeight: 'bold',
  },
  listContainer: {
    marginTop: 15,
    width: '100%',
  },
  bulletItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  bulletPoint: {
    fontSize: 18,
    marginRight: 8,
  },
  bulletText: {
    fontSize: 16,
    color: '#333',
  },
  paragraphtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: '#ddd',
    padding: 10,
    borderRadius: 5,
  },
  backButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },  
});

export default ProductDetail;
