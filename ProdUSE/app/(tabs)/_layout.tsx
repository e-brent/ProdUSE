import { Tabs } from 'expo-router';
import React from 'react';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { SQLiteDatabase } from 'expo-sqlite';
import migrations from '../../db/migrations';
import DbMigrationRunner from '../../db/DbMigrationRunner';
import SQLiteProvider from '../../db/SQLiteProvider';


export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [ready, setReady] = React.useState(false);
  const migrateDbIfNeeded = async (db: SQLiteDatabase) => {
    try {
      await new DbMigrationRunner(db).apply(migrations);
      console.log('All migrations applied.');
      setReady(true);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <SQLiteProvider
      databaseName = "produsedb.db"
      onInit = {migrateDbIfNeeded}>
        {ready && 
          <Tabs
          screenOptions={{
            tabBarActiveTintColor: 'green', 
            tabBarInactiveTintColor: 'gray', 
            headerShown: false,
            tabBarStyle: {
              marginTop: 10, 
            },
            }}
          >
            <Tabs.Screen
              name="index" 
              options={{
                title: 'My Fridge',
                tabBarIcon: ({ color, focused }) => (
                  <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
                ),
              }}
            />
            <Tabs.Screen
              name="addItem" 
              options={{
                href:null,
              }}
            />
            <Tabs.Screen
              name="pantry" 
              options={{
                title: 'pantry',
                tabBarIcon: ({ color, focused }) => (
                  <TabBarIcon name={focused ? 'basket' : 'basket-outline'} color={color} />
                ),
              }}
            />
            <Tabs.Screen
              name="metrics" 
              options={{
                title: 'metrics',
                tabBarIcon: ({ color, focused }) => (
                  <TabBarIcon name={focused ? 'analytics' : 'analytics-outline'} color={color} />
                ),
              }}
            />
            <Tabs.Screen
              name="profile" 
              options={{
                title: 'profile',
                tabBarIcon: ({ color, focused }) => (
                  <TabBarIcon name={focused ? 'person' : 'person-outline'} color={color} />
                ),
              }}
            />
          </Tabs>
         }
    </SQLiteProvider>
  );
}
