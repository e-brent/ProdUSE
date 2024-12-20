import { SQLiteDatabase } from 'expo-sqlite';
import { PerishableItem, PastItem, Recipe } from './types';

class Operations {
    constructor(private db: SQLiteDatabase) { }

    // get all items from the perishableItems table
    // Emme
    async getPerishableItems(): Promise<PerishableItem[]> {

        const rawValues = await this.db.getAllAsync<
            Omit<PerishableItem, 'date_purchased' | 'expiration_date'> & {
                date_purchased: string;
                expiration_date: string;
            }
        >('SELECT perishable_id, perishable_name, date_purchased as "date_purchased", expiration_date as "expiration_date", days_in_fridge, amount_used, category, image_url FROM perishableItems');

        return rawValues.map((value) => ({
            ...value,
            date_purchased: new Date(value.date_purchased),
            expiration_date: new Date(value.expiration_date),
        }));
    }

    // search perishableItems based on item name -- return list of matching items
    // Emme
    async searchPerishableItems(item_name?: string): Promise<PerishableItem[]> {

        let query = "";

        if (item_name == "") {
            query = 'SELECT perishable_id, perishable_name, date_purchased as "date_purchased", expiration_date as "expiration_date", days_in_fridge, amount_used, category, image_url FROM perishableItems';
        }
        else {
            query = `SELECT perishable_id, perishable_name, date_purchased as "date_purchased", expiration_date as "expiration_date", days_in_fridge, amount_used, category, image_url FROM perishableItems WHERE perishable_name LIKE "${item_name}"`;
        }

        console.log(query);

        const rawValues = await this.db.getAllAsync<
            Omit<PerishableItem, 'date_purchased' | 'expiration_date'> & {
                date_purchased: string;
                expiration_date: string;
            }
        >(query);

        return rawValues.map((value) => ({
            ...value,
            date_purchased: new Date(value.date_purchased),
            expiration_date: new Date(value.expiration_date),
        }));
    }

    // get specific item from the perishableItems table by id -- will be used for the item details page
    // Emme
    async getPerishableItem(id: number): Promise<PerishableItem | null> {   
             
        const rawValue = await this.db.getFirstAsync<
            Omit<PerishableItem, 'date_purchased' | 'expiration_date'> & {
                date_purchased: string;
                expiration_date: string;
            }
        >('SELECT perishable_id, perishable_name, date_purchased as "date_purchased", expiration_date as "expiration_date", days_in_fridge, amount_used, category, image_url FROM perishableItems WHERE perishable_id = ?', [id]);

        if (!rawValue) {
            return null;
        }
        return {
            ...rawValue,
            date_purchased: new Date(rawValue.date_purchased),
            expiration_date: new Date(rawValue.expiration_date),
        };
    }

    // get the last id in the perishableItems table -- helper function for adding new items to the table
    async getLastPerishibleId(): Promise<number | null> {

        const id = await this.db.getFirstAsync<{ perishable_id: number }>('SELECT perishable_id from perishableItems ORDER BY perishable_id DESC');

        if (!id) {
            return null;
        }

        return id.perishable_id;
    }

    // get item expiration date from table -- this table needs to be created -- actually this is seeming very complicated so maybe not??

    // get category image from table -- helper function for adding new items to the table
    // Emme
    async getImagePath(category: string): Promise<string | null> {
        const imagePath = await this.db.getFirstAsync<{ image_path: string }>('SELECT image_path FROM images WHERE category_name LIKE "?"', [category]);

        if (!imagePath) {
            return 'ProdUSE/assets/images/otherIcon.png';
        }

        return imagePath.image_path;
    }

    // add item to perishableItems table
    // Emme
    async addPerishableItem(perishable_name: string, date_purchased: Date, amount_used: number, category: string): Promise<void> {

        // create item id
        let id = await this.getLastPerishibleId();
        if (!id) {
            id = 0;
        }
        else {
            id = id + 1;
        }

        // get image path 
        let image = await this.getImagePath(category);

        // convert date purchased to string
        let date = date_purchased.toString();

        // make name lowercase for ease of comparison later
        let name = perishable_name.toLowerCase();

        console.log(id);
        console.log(name);
        console.log(date);
        console.log(amount_used);
        console.log('category:' + category);
        console.log(image);

        let query = `INSERT INTO perishableItems (perishable_id, perishable_name, date_purchased, expiration_date, days_in_fridge, amount_used, category, image_url) VALUES (${id}, "${name}", "${date}", " ", 0, ${amount_used}, "${category}", "${image}")`;

        /*await this.db.runAsync(
            `INSERT INTO perishableItems (perishable_id, perishable_name, date_purchased, expiration_date, days_in_fridge, amount_used, category, image_url) VALUES (?, '?', '?', ' ', 0, ?, '?', '?')`,
            [id, perishable_name, date, amount_used, category, image]
        );*/


        await this.db.runAsync(query);
    }

    // edit item in perishableItems table
    async editPerishableItem(perishable_id: number, perishable_name: string, date_purchased: Date, amount_used: number, category: string): Promise<void> {

        const item = await this.getPerishableItem(perishable_id);
        console.log(item);

        if (perishable_name != item?.perishable_name){
            console.log('updating name to: ' + perishable_name);
            await this.db.runAsync(
                'UPDATE perishableItems SET perishable_name = ? WHERE perishable_id = ?', [perishable_name, perishable_id]
            );
        }
        if (date_purchased != item?.date_purchased){
            // convert date purchased to string
            let date = date_purchased.toDateString();

            console.log('updating date to: ' + date);

            await this.db.runAsync(
                'UPDATE perishableItems SET date_purchased = ? WHERE perishable_id = ?', [date, perishable_id]
            );
        }
        if (amount_used != item?.amount_used){
            console.log('updating amount to: ' + amount_used);

            await this.db.runAsync(
                'UPDATE perishableItems SET amount_used = ? WHERE perishable_id = ?', [amount_used, perishable_id]
            );   
        }
        if (category != item?.category){
            console.log('updating category to: ' + category);

            await this.db.runAsync(
                'UPDATE perishableItems SET category = ? WHERE perishable_id = ?', [category, perishable_id]
            );
        }
    }

    // edit amount_used
    // Kyle
    async editAmountUsed(perishable_id: number, amount_used: number): Promise<void> {
        const item = await this.getPerishableItem(perishable_id);

        await this.db.runAsync(
            'UPDATE perishableItems SET amount_used = ? WHERE perishable_id = ?',
            [amount_used, perishable_id]
        );
    }

    // filter by category
    // Kyle
    async filterByCategory(category: string): Promise<PerishableItem[]> {

        const rawValues = await this.db.getAllAsync<
            Omit<PerishableItem, 'date_purchased' | 'expieration date'> & {
                date_purchased: string;
                expiration_date: string;
            }
        >(
            'SELECT perishable_id, perishable_name, date_purchased as "date_purchased", ' +
            'expiration_date as "expiration_date", days_in_fridge, amount_used, category, image_url ' +
            'FROM perishableItems WHERE category = ?',
            [category]
        );

        return rawValues.map((value) => ({
            ...value,
            date_purchased: new Date(value.date_purchased),
            expiration_date: new Date(value.expiration_date),
        }));
    }

    // filter by date of purchase
    // Kyle
    // 'asc' | 'desc'
    async filterByDateOfPurchase(sortOrder: string): Promise<PerishableItem[]> {
        const rawValues = await this.db.getAllAsync<
            Omit<PerishableItem, 'date_purchased' | 'expiration_date'> & {
                date_purchased: string;
                expiration_date: string;
            }
        >(
            'SELECT perishable_id, perishable_name, date_purchased as "date_purchased", ' +
            'expiration_date as "expiration_date", days_in_fridge, amount_used, category, image_url ' +
            'FROM perishableItems ORDER BY date_purchased ' + (sortOrder === 'asc' ? 'ASC' : 'DESC')
        );

        return rawValues.map((value) => ({
            ...value,
            date_purchased: new Date(value.date_purchased),
            expiration_date: new Date(value.expiration_date),
        }));

        /*
        Get oldest items first
        const oldestFirst = await operations.filterByDateOfPurchase('asc');

        Get newest items first
        const newestFirst = await operations.filterByDateOfPurchase('desc');
        */
    }

    // combined filter function -- category and sort order
    async filterPerishable(category: string, sortOrder: string): Promise<PerishableItem[]> {

        let order = sortOrder.toUpperCase();

        let query = "";

        if (category.localeCompare("") != 0 && sortOrder.localeCompare("") != 0){
            query = `SELECT perishable_id, perishable_name, date_purchased as "date_purchased", expiration_date as "expiration_date", days_in_fridge, amount_used, category, image_url FROM perishableItems WHERE category LIKE "${category}" ORDER BY date_purchased ${order}`;
        }
        else if (category.localeCompare("") != 0){
            query = `SELECT perishable_id, perishable_name, date_purchased as "date_purchased", expiration_date as "expiration_date", days_in_fridge, amount_used, category, image_url FROM perishableItems WHERE category LIKE "${category}"`;
        }
        else if (sortOrder.localeCompare("") != 0){
            query = `SELECT perishable_id, perishable_name, date_purchased as "date_purchased", expiration_date as "expiration_date", days_in_fridge, amount_used, category, image_url FROM perishableItems ORDER BY date_purchased ${order}`;
        }
        else {
            query = 'SELECT perishable_id, perishable_name, date_purchased as "date_purchased", expiration_date as "expiration_date", days_in_fridge, amount_used, category, image_url FROM perishableItems';
        }


        const rawValues = await this.db.getAllAsync<
            Omit<PerishableItem, 'date_purchased' | 'expieration date'> & {
                date_purchased: string;
                expiration_date: string;
            }
        >(query);

        return rawValues.map((value) => ({
            ...value,
            date_purchased: new Date(value.date_purchased),
            expiration_date: new Date(value.expiration_date),
        }));
    }

    // delete item from perishableItems
    // Emme
    async deletePerishable(id: number): Promise<void> {
        await this.db.runAsync(
            'DELETE FROM perishableItems WHERE perishable_id = ?',
            [id]
        );
    }

    // helper function to get last past_id
    async getLastPastId(): Promise<number | null> {
        const id = await this.db.getFirstAsync<{ past_id: number }>(
            'SELECT past_id from pastItems ORDER BY past_id DESC'
        );

        if (!id) {
            return null;
        }

        return id.past_id;
    }

    // add item to pastItems table
    // similar to addPerishible, for when item is thrown out and it changed in as a pastItem
    // Emme
    async addPastItem(past_name: string, date_purchased: Date, date_finished: Date, days_in_fridge: number, completed: boolean, total_used: number, category: string): Promise<void> {
        let id = await this.getLastPastId();
        if (!id) {
            id = 0;
        }
        else {
            id = id + 1;
        }

        const purchaseDate = date_purchased.toString();
        const finishDate = date_finished.toString();

        const completedInt = completed ? 1 : 0;

        await this.db.runAsync(
            'INSERT INTO pastItems (past_id, past_name, date_purchased, date_finished, days_in_fridge, completed, total_used, category) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [id, past_name, purchaseDate, finishDate, days_in_fridge, completedInt, total_used, category]
        );
    }


    // get all recipes
    // Kyle

    // get recipes with specific ingredient
    // only one parameter (item name) should return a list of recipes
    // Kyle
    async getRecipesByIngredient(itemName: string): Promise<Recipe[]> {
        const recipes = await this.db.getAllAsync<Recipe>(
            'SELECT item, recipe_name FROM recipes WHERE item = ?',
            [itemName]
        );

        // If no recipes found, return empty array
        if (!recipes || recipes.length === 0) {
            return [];
        }

        return recipes;
    }

    // delete recipes
    // Kyle
    async deleteRecipe(item: string, recipeName: string): Promise<void> {
        // Check if recipe exists first
        const existingRecipe = await this.db.getFirstAsync<Recipe>(
            'SELECT item, recipe_name FROM recipes WHERE item = ? AND recipe_name = ?',
            [item, recipeName]
        );

        if (!existingRecipe) {
            throw new Error(`Recipe "${recipeName}" for item "${item}" not found`);
        }

        await this.db.runAsync(
            'DELETE FROM recipes WHERE item = ? AND recipe_name = ?',
            [item, recipeName]
        );
    }

    // metric operations
    // kyle

    async itemsLogged(): Promise<number> {
        // Get total count of all items ever logged (both current and past)
        const result = await this.db.getFirstAsync<{ total: number }>(
            `SELECT COUNT(*) as total FROM (
            SELECT perishable_name FROM perishableItems 
            UNION ALL 
            SELECT past_name FROM pastItems
        )`
        );
        return result?.total ?? 0;
    }

    async mostUsedByCategory(): Promise<Array<{ category: string, avgUsage: number }>> {
        // Calculate average percentage used by category before disposal
        const results = await this.db.getAllAsync<{ category: string, avgUsage: number }>(
            `SELECT 
            category,
            ROUND(AVG(total_used) * 100, 1) as avgUsage
        FROM pastItems
        GROUP BY category
        ORDER BY avgUsage DESC`
        );
        return results ?? [];
    }

    async leastUsedByCategory(): Promise<Array<{ category: string, avgUsage: number }>> {
        // Same as mostUsedByCategory but ordered ascending
        const results = await this.db.getAllAsync<{ category: string, avgUsage: number }>(
            `SELECT 
            category,
            ROUND(AVG(total_used) * 100, 1) as avgUsage
        FROM pastItems
        GROUP BY category
        ORDER BY avgUsage ASC`
        );
        return results ?? [];
    }

    async mostPurchasedItem(): Promise<Array<{ itemName: string, purchaseCount: number }>> {
        // Count occurrences of each item across both tables
        const results = await this.db.getAllAsync<{ itemName: string, purchaseCount: number }>(
            `SELECT itemName, COUNT(*) as purchaseCount
        FROM (
            SELECT perishable_name as itemName FROM perishableItems
            UNION ALL
            SELECT past_name as itemName FROM pastItems
        )
        GROUP BY itemName
        ORDER BY purchaseCount DESC
        LIMIT 5`
        );
        return results ?? [];
    }

    async leastPurchasedItem(): Promise<Array<{ itemName: string, purchaseCount: number }>> {
        // Same as mostPurchasedItem but ordered ascending
        const results = await this.db.getAllAsync<{ itemName: string, purchaseCount: number }>(
            `SELECT itemName, COUNT(*) as purchaseCount
        FROM (
            SELECT perishable_name as itemName FROM perishableItems
            UNION ALL
            SELECT past_name as itemName FROM pastItems
        )
        GROUP BY itemName
        ORDER BY purchaseCount ASC
        LIMIT 5`
        );
        return results ?? [];
    }

    async getLoggedCategories(): Promise<Array<{ category: string }>> {
        const rawCategories = await this.db.getAllAsync<{ category: string }>(
            `SELECT DISTINCT category FROM perishableItems
            UNION
            SELECT DISTINCT category FROM pastItems`
        );
        const categories = rawCategories.map((row) => ({ category: row.category }));

        console.log(categories);

        return categories ?? [];
    }

}

export default Operations;