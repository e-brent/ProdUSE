import * as SQLite from 'expo-sqlite';
import openDatabase from '@/db/schema';
import { useState, useEffect } from 'react';


// get perishable items -- return list of items in the perishable table
async function getPerishableItems() {

    const [items, setItems] = useState([]);

    const db = await openDatabase();
    console.log("initialized db");

    useEffect(() => {
        db.transaction(tx => {
            tx.executeSQL('SELECT * FROM  perishableItems', null,
                (txObj, resultSet) => setItems(resultSet.rows._array),
                (txObj, error) => console.log(error)
            );
        });
    }, [db]);

    console.log(items);
    
    return items;

    /*
    let items = [];

    const statement = db.prepareSync('SELECT * FROM  perishableItems');

    try {
        let result = statement.executeSync();

        const allRows = result.getAllSync();

        for (const row of allRows){

            items.push({
                "perishable_id" : row.perishable_id,
                "perishable_name" : row.perishable_name,
                "date_purchased" : row.date_puchased, 
                "expiration_date" : row.expiration_date, 
                "days_in_fridge" : row.days_in_fridge, 
                "amount_used" : row.amount_used,
                "category" : row.category,
                "imageUrl" : row.imageUrl,
            })
        }
    } finally {
        statement.finalizeSync();
    }

    

    console.log(items);
    return items;
    */



}

// get recipes -- return list of recipe names in the recipes table

// add perishable -- inserts item into perishable and past items 

// finish perishable item -- remove item from perishable and update past items to say complete and date finished

// throw away item -- remove item from perishable and update date finished in past item

// add recipe -- insert item and recipe name into recipe table

export {getPerishableItems};