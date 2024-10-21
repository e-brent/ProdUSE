import * as SQLite from 'expo-sqlite';


async function openDatabase(){
    //create database
    const db = await SQLite.openDatabaseAsync('produseDB');

    // `execAsync()` is useful for bulk queries when you want to execute altogether.
    // Please note that `execAsync()` does not escape parameters and may lead to SQL injection.
    // create the tables and test data for the database
    await db.execAsync(`
        PRAGMA journal_mode = WAL;

        CREATE TABLE IF NOT EXISTS perishableItems (
            perishable_id INTEGER PRIMARY KEY NOT NULL, 
            perishable_name TEXT NOT NULL, 
            date_purchased TEXT NOT NULL, 
            expiration_date TEXT, 
            days_in_fridge INTEGER DEFAULT 0, 
            amount_used REAL DEFAULT 0,
            initial_quantity REAL,  
            category TEXT NOT NULL CHECK (category == "fruit" || category == "vegetable" || category == "dairy" || category == "meat/fish" || category == "other")
        );
        CREATE TABLE IF NOT EXISTS pastItems (
            past_id INTEGER PRIMARY KEY NOT NULL, 
            past_name TEXT NOT NULL, 
            date_purchased TEXT NOT NULL, 
            date_finished TEXT NOT NULL, 
            days_in_fridge INTEGER NOT NULL, 
            completed INTEGER NOT NULL,
            total_used REAL NOT NULL, 
            category TEXT NOT NULL CHECK (category == "fruit" || category == "vegetable" || category == "dairy" || category == "meat/fish" || category == "other")
        );
        CREATE TABLE IF NOT EXISTS recipes (
            item TEXT NOT NULL, 
            recipe_name TEXT NOT NULL, 
            PRIMARY KEY (item, recipe_name)
        );

        INSERT INTO perishableItems (perishable_id, perishable_name, date_purchased, expiration_date, days_in_fridge, amount_used, category) VALUES ('strawberries', '2024-10-10 00:00:00:.000', '2024-10-20 00:00:00:.000', 7, .5, 'fruit');
        INSERT INTO perishableItems (perishable_id, perishable_name, date_purchased, expiration_date, days_in_fridge, amount_used, category) VALUES ('brussel sprouts', '2024-10-10 00:00:00:.000', '2024-10-25 00:00:00:.000', 7, .68, 'vegetable');
        INSERT INTO perishableItems (perishable_id, perishable_name, date_purchased, expiration_date, days_in_fridge, amount_used, category) VALUES ('apples', '2024-10-10 00:00:00:.000', '2024-10-24 00:00:00:.000', 7, .3, 'fruit');

        INSERT INTO  pastItems (past_id, past_name, date_purchased, date_finished, days_in_fridge, completed, total_used, category) VALUES ('strawberries', '2024-10-10 00:00:00:.000', '', 7, 0, 'fruit');
        INSERT INTO  pastItems (past_id, past_name, date_purchased, date_finished, days_in_fridge, completed, total_used, category) VALUES ('brussel sprouts', '2024-10-10 00:00:00:.000', '', 7, 0, 'vegetable');
        INSERT INTO  pastItems (past_id, past_name, date_purchased, date_finished, days_in_fridge, completed, total_used, category) VALUES ('apples', '2024-10-10 00:00:00:.000', '', 7, 0, 'fruit');
        INSERT INTO  pastItems (past_id, past_name, date_purchased, date_finished, days_in_fridge, completed, total_used, category) VALUES ('strawberries', '2024-10-01 00:00:00:.000', '2024-10-09 00:00:00:.000', 1, 1, 'fruit');
        
        INSERT INTO recipes (item, recipe_name) VALUES ('strawberries', 'strawberry short cake');
        INSERT INTO recipes (item, recipe_name) VALUES ('strawberries', 'frui salad');
        INSERT INTO recipes (item, recipe_name) VALUES ('apples', 'apple crisp');
        INSERT INTO recipes (item, recipe_name) VALUES ('chickpeas', 'greek salad');

        `);

}

export default openDatabase;
