import { SQLiteDatabase } from 'expo-sqlite';
import { DatabaseMigration } from '../types';
            
const migration: DatabaseMigration = {
    name: 'populate',
    async up(db: SQLiteDatabase): Promise<void> {
        await db.execAsync(`
            INSERT INTO perishableItems (perishable_id, perishable_name, date_purchased, expiration_date, days_in_fridge, amount_used, category, image_url) VALUES (0, 'strawberries', '2024-10-12 00:00:00:.000', '2024-10-20 00:00:00:.000', 7, .5, 'fruit', '../assets/images/fruitIcon-min.png');
            INSERT INTO perishableItems (perishable_id, perishable_name, date_purchased, expiration_date, days_in_fridge, amount_used, category, image_url) VALUES (1, 'brussel sprouts', '2024-10-10 00:00:00:.000', '2024-10-25 00:00:00:.000', 7, .68, 'vegetable', '../assets/images/vegetableIcon-min.png');
            INSERT INTO perishableItems (perishable_id, perishable_name, date_purchased, expiration_date, days_in_fridge, amount_used, category, image_url) VALUES (2, 'apples', '2024-10-10 00:00:00:.000', '2024-10-24 00:00:00:.000', 7, .3, 'fruit', '../assets/images/fruitIcon-min.png');
    
            INSERT INTO  pastItems (past_id, past_name, date_purchased, date_finished, days_in_fridge, completed, total_used, category) VALUES (0, 'strawberries', '2024-10-10 00:00:00:.000', '', 7, 0, .5, 'fruit');
            INSERT INTO  pastItems (past_id, past_name, date_purchased, date_finished, days_in_fridge, completed, total_used, category) VALUES (1, 'brussel sprouts', '2024-10-10 00:00:00:.000', '', 7, 0, .68, 'vegetable');
            INSERT INTO  pastItems (past_id, past_name, date_purchased, date_finished, days_in_fridge, completed, total_used, category) VALUES (2, 'apples', '2024-10-10 00:00:00:.000', '', 7, 0, .3, 'fruit');
            INSERT INTO  pastItems (past_id, past_name, date_purchased, date_finished, days_in_fridge, completed, total_used, category) VALUES (3, 'strawberries', '2024-10-01 00:00:00:.000', '2024-10-09 00:00:00:.000', 1, 1, 1, 'fruit');
            
            INSERT INTO recipes (item, recipe_name) VALUES ('strawberries', 'strawberry short cake');
            INSERT INTO recipes (item, recipe_name) VALUES ('strawberries', 'frui salad');
            INSERT INTO recipes (item, recipe_name) VALUES ('apples', 'apple crisp');
            INSERT INTO recipes (item, recipe_name) VALUES ('chickpeas', 'greek salad');

            INSERT INTO images (category_name, image_path) VALUES ('dairy', 'ProdUSE/assets/images/dairyIcon.png');
            INSERT INTO images (category_name, image_path) VALUES ('fruit', 'ProdUSE/assets/images/fruitIcon.png');
            INSERT INTO images (category_name, image_path) VALUES ('meat/fish', 'ProdUSE/assets/images/meatIcon.png');
            INSERT INTO images (category_name, image_path) VALUES ('other', 'ProdUSE/assets/images/otherIcon.png');
            INSERT INTO images (category_name, image_path) VALUES ('vegetable', 'ProdUSE/assets/images/vegetableIcon.png');
        `);
    },
};

export default migration;