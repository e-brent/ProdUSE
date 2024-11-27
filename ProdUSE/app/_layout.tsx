import { Stack } from 'expo-router';
import React from 'react';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { SQLiteDatabase } from 'expo-sqlite';
import migrations from '../db/migrations';
import DbMigrationRunner from '../db/DbMigrationRunner';
import SQLiteProvider from '../db/SQLiteProvider';


const RootLayout = () => {
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
        {ready && <Stack>
            <Stack.Screen
                name="(tabs)"
                options={{
                    headerShown: false
                }}
            />
        </Stack>}
    </SQLiteProvider>
    )
}

export default RootLayout