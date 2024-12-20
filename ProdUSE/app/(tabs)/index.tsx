import { View, Text, Image, TouchableOpacity, StyleSheet, SafeAreaView, TextInput } from 'react-native';
import { Link } from 'expo-router';
import ItemList from '../../components/ItemList';

import React, { useState } from 'react';

export default function Index() {

  const [search, setSearch] = useState(false);
  const [searchName, setSearchName] = useState("");

  const [filter, setFilter] = useState(false);

  const [update, setUpdate] = useState(0);

  const [showFilter, setShowFilter] = useState(false);
  const [category, setCategory] = useState("");
  const [sortOrder, setSort] = useState("");


  const searchSubmit = (text: string) => {
    setFilter(false);
    setSearch(true);
    setSearchName(text);
    setUpdate(update + 1);

    console.log(update + ' ' + text);
  }

  const applyFilters = () => {
    setShowFilter(false);
    setFilter(true);
    setSearch(false);
    setUpdate(update + 1);
  }

  const clearFilters = () => {
    setCategory("");
    setSort("");
    setFilter(false);
    setUpdate(update + 1);

    //setShowFilter(false);
  }

  const toggleFilter = () => {
    setShowFilter(!showFilter);
  };

  return (
    <View style={styles.background}>
      <View style={styles.headerContainer}>
        {/* Left Image (Menu Button) */}
        <TouchableOpacity style={styles.iconContainer} onPress={toggleFilter}>
          <Image
            source={require('../../assets/images/filtericon.png')}  // Menu button image
            style={styles.iconImage}
          />
        </TouchableOpacity>
        {/* Logo and Title */}
        <View style={styles.titleContainer}>
          <Image
            source={require('../../assets/images/produse.png')}  // logo image
            style={styles.logo}
          />
          <Text style={styles.title}>MY FRIDGE</Text>
        </View>
        {/* Right Image (Plus Sign) */}
        <Link href='./addItem' style={styles.iconContainer}>
          <Image
            source={require('../../assets/images/plusicon.png')}  // Plus sign 
            style={styles.iconImage}
          />
        </Link>

      </View>

      {showFilter && (
        <View style={styles.filterContainer}>
          {/* Categories */}
          <Text style={styles.filterTitle}>Sort by Category</Text>
          <TouchableOpacity onPress={() => setCategory('fruit')}>
            <Text
              style={[
                styles.filterOption,
                category === 'fruit' ? styles.selectedOption : null,
              ]}
            >Fruit</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setCategory('vegetable')}>
            <Text
              style={[
                styles.filterOption,
                category === 'vegetable' ? styles.selectedOption : null,
              ]}
            >Vegetable</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setCategory('dairy')}>
            <Text
              style={[
                styles.filterOption,
                category === 'dairy' ? styles.selectedOption : null,
              ]}
            >Dairy</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setCategory('meat/fish')}>
            <Text
              style={[
                styles.filterOption,
                category === 'meat/fish' ? styles.selectedOption : null,
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

          <View>
            <TouchableOpacity onPress={clearFilters}>
              <Text style={styles.clearFilter}>Clear Filters</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={applyFilters}>
              <Text style={styles.applyFilter}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
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
          filter={filter}
          filterCategory={category}
          filterOrder={sortOrder}
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
    backgroundColor: '#292818',
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
    borderColor: '#e0e0e0',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    zIndex: 1,
  },
  filterTitle: {
    color: '#41521f',
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
  applyFilter: {
    fontSize: 16,
    color: 'red',
    marginTop: 20,
    textAlign: 'center',
  },
  list: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
