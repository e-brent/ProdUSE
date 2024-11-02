import { Stack } from "expo-router";
import React from 'react';
import { SQLiteDatabase } from 'expo-sqlite';
import migrations from '../db/migrations';
import DbMigrationRunner from '../db/DbMigrationRunner';
import SQLiteProvider from '../db/SQLiteProvider';

export default function RootLayout() {
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
          <Stack>
            <Stack.Screen 
              name="index" 
              options={{
                // Hide the header for this route
                headerShown: false,
              }}
            />
          </Stack>
        }
    </SQLiteProvider>
  );
}
