import mongoose from 'mongoose';

async function deleteTestDatabases() {
  const mongoUri = 'mongodb://localhost:27017';
  const connection = await mongoose.createConnection(mongoUri).asPromise();

  try {
    const admin = connection.db.admin();
    const { databases } = await admin.listDatabases();

    const testDatabases = databases.filter((db) => db.name.startsWith('testdb_'));

    for (const db of testDatabases) {
      const dbConnection = connection.useDb(db.name, { useCache: false });
      await dbConnection.dropDatabase();
      console.log(`Dropped database: ${db.name}`);
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Failed to delete test databases: ${error.message}`);
    } else {
      console.error(`Failed to delete test databases: ${error}`);
    }
  } finally {
    await connection.close();
  }
}

export default deleteTestDatabases;
