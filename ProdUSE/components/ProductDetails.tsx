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

type ItemData = {
  id: string;
  title: string;
  imageUrl: string;
  brought: number;
  quantity: number;
  expiration: string;
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
  item_id: string
}

const ProductDetail = ({item_id} : DetailParams) => {
  const ctx = useSQLiteContext();
  const client = new Operations(ctx);
  const [item, setItem] = useState<PerishableItem | null>();

  const handleGoneBad = (id: string) => {
    console.log(`Item ${id} marked as gone bad.`);
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
    console.log(item.perishable_name);
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.item}>
          <Image source={image(item.category)} style={styles.image} />
          <Text style={styles.title}>{item.perishable_name}</Text>
          <Text style={styles.subtitle}>
            Brought: {ITEM.brought} 
          </Text>
          <Text style={styles.subtitle}>
           Quantity: {ITEM.quantity}
          </Text>
          <Text style={styles.subtitle}> Expiration: {ITEM.expiration}</Text>
          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { width: `${ITEM.progress * 100}%`}]} />
          </View>
          <Text style={styles.percentageText}>{Math.round(ITEM.progress * 100)}% Used</Text>
  
          <View style={styles.listContainer}>
          <Text style={styles.subtitle}>Ways to Eat:</Text>
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
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={() => handleGoneBad(ITEM.id)} style={styles.button}>
              <Text style={styles.buttonText}>Gone Bad</Text>
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
  subtitle2: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },  
});

export default ProductDetail;
