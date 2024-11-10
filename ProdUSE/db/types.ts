import {SQLiteDatabase} from 'expo-sqlite';

export type UserVersion = {
    user_version: number;
};

export type DatabaseMigration = {
    name: string;
    up: (db: SQLiteDatabase) => Promise<void>;
};

export type PerishableItem = {
    perishable_id: string;
    perishable_name: string;
    date_purchased: Date;
    expiration_date: Date;
    days_in_fridge: number;
    amount_used: number;
    category: string;
    image_url: string;
};

export type PastItem = {
    past_id: number;
    past_name: string;
    date_puchased: Date;
    date_finished: Date;
    days_in_fridge: number;
    completed: Boolean;
    total_used: number;
    category: string;
}

export type Recipe = {
    item: string;
    recipe_name: string;
}