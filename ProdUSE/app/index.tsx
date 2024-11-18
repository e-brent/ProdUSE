import { View, Text, Image, TouchableOpacity, StyleSheet, SafeAreaView, TextInput } from 'react-native';
import ItemList from '../components/ItemList';

import React, { useState } from 'react';

export default function Index() {

  const [search, setSearch] = useState(false);
  const [searchName, setSearchName] = useState("");
  const [update, setUpdate] = useState(0);

  const [filter, setFilter] = useState(false);
  const [category, setCategory] = useState<string | null>(null);
  const [sortOrder, setSort] = useState<'asc' | 'desc' | null>(null);


  const searchSubmit = (text: string) => {
    setSearch(true);
    setSearchName(text);
    setUpdate(update + 1);

    console.log(update + ' ' + text);
  }

  const toggleFilter = () => {
    setFilter(!filter);
  };

  return (
    <View style={styles.background}>
      <View style={styles.headerContainer}>
        {/* Left Image (Menu Button) */}
        <TouchableOpacity style={styles.iconContainer} onPress={toggleFilter}>
          <Image
            source={require('../assets/images/filtericon.png')}  // Filter button image
            style={styles.iconImage}
          />
        </TouchableOpacity>
        {/* Logo and Title */}
        <View style={styles.titleContainer}>
          <Image
            source={require('../assets/images/produse.png')}  // logo image
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

      {filter && (
        <View style={styles.filterContainer}>
          {/* Categories */}
          <Text style={styles.filterTitle}>Sort by Category</Text>
          <TouchableOpacity onPress={() => setCategory('Fruit')}>
            <Text
              style={[
                styles.filterOption,
                category === 'Fruit' ? styles.selectedOption : null,
              ]}
            >Fruit</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setCategory('Vegetable')}>
            <Text
              style={[
                styles.filterOption,
                category === 'Vegetable' ? styles.selectedOption : null,
              ]}
            >Vegetable</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setCategory('Dairy')}>
            <Text
              style={[
                styles.filterOption,
                category === 'Dairy' ? styles.selectedOption : null,
              ]}
            >Dairy</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setCategory('Meat')}>
            <Text
              style={[
                styles.filterOption,
                category === 'Meat' ? styles.selectedOption : null,
              ]}
            >Meat</Text>
          </TouchableOpacity>
          
          <Text style={styles.filterTitle}>Sort By Date</Text> 
          <TouchableOpacity onPress={() => setSort('asc')}>
            <Text
              style={[
                styles.filterOption,
                sortOrder === 'asc' ? styles.selectedOption : null,
              ]}
            >Newest First</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setSort('desc')}>
            <Text
              style={[
                styles.filterOption,
                sortOrder === 'desc' ? styles.selectedOption : null,
              ]}
            >Oldest First</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => {
            setCategory(null);
            setSort(null);
          }}>
            <Text style={styles.clearFilter}>Clear Filters</Text>
          </TouchableOpacity>

        </View>
      )}

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search..."
          placeholderTextColor="gray"
          onSubmitEditing={(event) => searchSubmit(event.nativeEvent.text)}
          returnKeyType="search"
        />
      </View>

      <View style={styles.list}>
        <ItemList
          key={update}
          search={search}
          item_name={searchName}
        >
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
    width: 44,
    height: 65,
    marginLeft: 5,
    marginRight:5,
    marginBottom: 10,
    backgroundColor: 'transparent',
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
  filterContainer: {
    position: 'absolute',
    top: '20%',
    left: '10%',
    right: '10%',
    borderWidth: 1,
    borderColor:'#e0e0e0',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    zIndex: 1,
  },
  filterTitle: {
    color:'#41521f',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  filterOption: {
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 20,
    color: '#41521f',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    textAlign: 'left',
  },
  selectedOption: {
    fontWeight: 'bold',
    color: '#F18208',
  },
  clearFilter: {
    fontSize: 16,
    color: 'red',
    marginTop: 20,
    textAlign: 'center',
  },
  list: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
