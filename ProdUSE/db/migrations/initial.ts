import { SQLiteDatabase } from 'expo-sqlite';
import { DatabaseMigration } from '../types';

const migration : DatabaseMigration = {
    name: 'create initial tables',
    async up(db: SQLiteDatabase): Promise<void> {
        await db.execAsync(`
            
            CREATE TABLE IF NOT EXISTS perishableItems (
                perishable_id INTEGER PRIMARY KEY NOT NULL, 
                perishable_name TEXT NOT NULL, 
                date_purchased TEXT NOT NULL, 
                expiration_date TEXT, 
                days_in_fridge INTEGER DEFAULT 0, 
                amount_used REAL DEFAULT 0,
                category TEXT NOT NULL CHECK (category = "fruit" OR category = "vegetable" OR category = "dairy" OR category = "meat/fish" OR category = "other"),
                image_url TEXT DEFAULT 'https://picsum.photos/seed/696/3000/2000'
                );
            CREATE TABLE IF NOT EXISTS pastItems (
                past_id INTEGER PRIMARY KEY NOT NULL, 
                past_name TEXT NOT NULL, 
                date_purchased TEXT NOT NULL, 
                date_finished TEXT NOT NULL, 
                days_in_fridge INTEGER NOT NULL, 
                completed INTEGER NOT NULL,
                total_used REAL NOT NULL, 
                category TEXT NOT NULL CHECK (category = "fruit" OR category = "vegetable" OR category = "dairy" OR category = "meat/fish" OR category = "other")
            );
            CREATE TABLE IF NOT EXISTS recipes (
                item TEXT NOT NULL, 
                recipe_name TEXT NOT NULL, 
                PRIMARY KEY (item, recipe_name)
            );
            CREATE TABLE IF NOT EXISTS images (
                category_name TEXT PRIMARY KEY NOT NULL,
                image_path TEXT NOT NULL
        `);
    },
};

export default migration;

/*
DROP TABLE IF EXISTS perishableItems;
DROP TABLE IF EXISTS pastItems;
DROP TABLE IF EXISTS recipes;
DROP TABLE IF EXISTS images;
*/