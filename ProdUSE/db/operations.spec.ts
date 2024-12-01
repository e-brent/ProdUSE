import { openDatabaseAsync, SQLiteDatabase } from 'expo-sqlite';
import Operations from './operations';
import DbMigrationRunner from './DbMigrationRunner';
import migration1 from './migrations/initial';

describe('Operations', () => {
    let sqlite: SQLiteDatabase;

    beforeEach(async () => {
        sqlite = await openDatabaseAsync('produsedb.db');
        await new DbMigrationRunner(sqlite).apply([migration1]);
    });

    it('should read all perishable items', async () => {
        const operations = new Operations(sqlite);

        const insertStmt = await sqlite.prepareAsync('INSERT INTO perishableItems(item) VALUES (?)');
        await insertStmt.executeAsync(['Write']);
        await insertStmt.executeAsync(['Tests']);
        await insertStmt.finalizeAsync();

        const items = await operations.getPerishableItems();

        expect(items).toEqual([expect.objectContaining({item: 'Write'}), expect.objectContaining({ item: 'Tests'})]);
    });

    afterEach(async () => {
        await sqlite.closeAsync();
    });


});