import { SQLiteDatabase } from 'expo-sqlite';
import { PerishableItem, PastItem, Recipe } from './types';
import { useSQLiteContext } from '../db/SQLiteProvider';
import React, { useState } from 'react';

class Operations {
    constructor(private db: SQLiteDatabase) {}

// get all items from the perishableItems table
    async getPerishableItems(): Promise<PerishableItem[]> {
        const rawValues = await this.db.getAllAsync<
            Omit<PerishableItem, 'date_purchased' | 'expiration_date'> & {
                date_purchased: string;
                expiration_date: string;
            }
        >('SELECT perishable_id, perishable_name, date_purchased as "date_purchased", expiration_date as "expiration_date", days_in_fridge, amount_used, category, image_url from perishableItems');

        return rawValues.map((value) => ({
            ...value,
            date_purchased: new Date(value.date_purchased),
            expiration_date: new Date(value.expiration_date),
        }));
    }

// get specific item from the perishableItems table
    async getperishableItem(id: number): Promise<PerishableItem | null> {
        const rawValue = await this.db.getFirstAsync<
            Omit<PerishableItem, 'date_purchased' | 'expiration_date'> & {
                date_purchased: string;
                expiration_date: string;
            }
        >('SELECT perishable_id, perishable_name, date_purchased as "date_purchased", expiration_date as "expiration_date", days_in_fridge, amount_used, category, image_url from perishableItems WHERE id = ?', [id]);

        if (!rawValue){
            return null;
        }
        return {
            ...rawValue,
            date_purchased: new Date(rawValue.date_purchased),
            expiration_date: new Date(rawValue.expiration_date),
        };
    }

// get the last id in the perishableItems table
    async getLastId(): Promise<number | null>{

        const id = await this.db.getFirstAsync<{perishable_id:number}>('SELECT perishable_id from perishableItems ORDER BY perishable_id DESC');
        
        if (!id){
            return null;
        }

        return id.perishable_id;
    }

// get item expiration date from table -- this table needs to be created

// get category image from table -- this table needs to be created

// add item to perishableItems table
    async addPerishableItem(perishable_name: string, date_purchased: Date, amount_used: number, category: string): Promise<void> {
        
        // create item id
        let id = await this.getLastId();
        if (!id){
            id = 0;
        }
        else {
            id = id + 1;
        }

    
    }

// edit item in perishableItems table

// delete item from perishableItems

// add item to pastItems table

// get all recipes

// get recipes with specific ingredient

// operations for specific stats???



}

export default Operations;