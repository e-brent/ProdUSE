import React, { useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, Image, View } from 'react-native';

/*sources that I used
https://reactnative.dev/docs/flatlist?language=typescript
https://docs.expo.dev/versions/latest/sdk/image/#image
https://docs.expo.dev/ui-programming/react-native-styling-buttons/
https://reactnative.dev/docs/touchableopacity
https://medium.com/@jujunsetiawan10/how-to-create-progress-bar-in-react-native-f27ae2871ac3#:~:text=To%20create%20a%20modern-looking%20progress%20bar%20in%20React,by%20running%20the%20following%20command%3A%20yarn%20add%20react-native-progress
https://reactnative.dev/docs/view
*/

type ItemData = {
  id: string;
  title: string;
  imageUrl: string;
  progress: number; 
};

const DATA: ItemData[] = [
  {
    id: 'item-one',
    title: 'Tomato',
    imageUrl: 'https://picsum.photos/seed/696/3000/2000',
    progress: 0.5, // 50% progress
  },
  {
    id: 'item-two',
    title: 'Blueberry',
    imageUrl: 'https://picsum.photos/seed/696/3000/2000',
    progress: 0.7, // 70% progress
  },
  {
    id: 'item-three',
    title: 'Celery',
    imageUrl: 'https://picsum.photos/seed/696/3000/2000',
    progress: 0.2, // 20% progress
  },
];

type ItemProps = {
  item: ItemData;
  onPress: () => void;
  backgroundColor: string;
  textColor: string;
  onEdit: (id: string) => void; 
  onDelete: (id: string) => void; 
};

const Item = ({ item, onPress, backgroundColor, textColor, onEdit, onDelete }: ItemProps) => (
  <TouchableOpacity onPress={onPress} style={[styles.item, { backgroundColor }]}>
    <View style={styles.row}>
      <Image source={{ uri: item.imageUrl }} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={[styles.title, { color: textColor }]}>{item.title}</Text>
        
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: `${item.progress * 100}%`}]} />
        </View>
        <Text style={styles.percentageText}>{Math.round(item.progress * 100)}%</Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={() => onEdit(item.id)} style={styles.button}>
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onDelete(item.id)} style={styles.button}>
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </TouchableOpacity>
);

const Flatlist = () => {
  const [selectedId, setSelectedId] = useState<string>();

  const handleEdit = (id: string) => {
  };

  const handleDelete = (id: string) => {
  };

  const renderItem = ({ item }: { item: ItemData }) => {
    const backgroundColor = item.id === selectedId ? '#F18208' : '#FFFFFF';
    const color = item.id === selectedId ? 'white' : 'black';

  return (
    <Item
        item={item}
        onPress={() => setSelectedId(item.id)}
        backgroundColor={backgroundColor}
        textColor={color}
        onEdit={handleEdit} 
        onDelete={handleDelete} 
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={DATA}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
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

export default Flatlist;
