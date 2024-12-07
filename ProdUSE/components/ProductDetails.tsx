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

  const daysInFridge = calculateDaysInFridge(ITEM.purchasedate);

  const handleEdit = () => {
    setUpdater(updater + 1);
    console.log('Edit button clicked');
  };

  const handleThrowOut = (id: string) => {
    console.log(`Item ${id} marked as throw out.`);
  };

  const handleRecipe = (id: string) => {
    console.log(`Recipe options for item ${id}.`);
  };

  const handleUsed = (id: string) => {
    console.log(`Item ${id} marked as used.`);
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
      {/* Edit Icon */}
      <Link href={{pathname: './editItem', params: {id: item.perishable_id, name: item.perishable_name, amount : item.amount_used, date : item.date_purchased.toString(), category : item.category, update: updater}}} style={styles.editIcon} onPress={handleEdit}>
        <Icon name="edit" size={30} color="black" />
      </Link>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>{'< Back'}</Text>
      </TouchableOpacity>

      <View style={styles.item}>
        <Image source={{ uri: ITEM.imageUrl }} style={styles.image} />
        <Text style={styles.title}>{item.perishable_name}</Text>
        <Text style={styles.paragraphtitle}>Purchase Date: {ITEM.purchasedate}</Text>
        <Text style={styles.paragraphtitle}>Days in Fridge: {daysInFridge}</Text>

        {/* Progress Bar */}
        <View>
          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { width: `${ITEM.progress * 100}%` }]} />
          </View>
          <Text style={[styles.percentageText, { textAlign: 'right' }]}>
            {Math.round(ITEM.progress * 100)}% used
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
          <TouchableOpacity onPress={() => handleUsed(ITEM.id)} style={styles.button}>
            <Text style={styles.buttonText}>Used</Text>
          </TouchableOpacity>
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
    top: 10,
    right: 10,
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
    marginTop: 20,
    marginLeft: 15,
    padding: 10,
    backgroundColor: '#ddd',
    borderRadius: 5,
    width: 80,
 
  },
  backButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },  
});

export default ProductDetail;
