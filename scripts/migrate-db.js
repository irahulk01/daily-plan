const { MongoClient } = require("mongodb");

const uri = "mongodb+srv://Rahul:xiIhinKp3iCXXapi@portfolio.t1fj7ej.mongodb.net/?retryWrites=true&w=majority";

async function migrateDatabase() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Connected to MongoDB Atlas cluster.");

    const sourceDb = client.db("portfolio");
    const targetDb = client.db("task-planner");

    const collections = await sourceDb.listCollections().toArray();
    console.log(`Found ${collections.length} collections in 'portfolio' database.`);

    for (const colInfo of collections) {
      const colName = colInfo.name;
      console.log(`Migrating collection: '${colName}'...`);

      const sourceCollection = sourceDb.collection(colName);
      const targetCollection = targetDb.collection(colName);

      const docs = await sourceCollection.find({}).toArray();

      if (docs.length > 0) {
        // Clear target collection first to avoid key collisions
        await targetCollection.deleteMany({});
        const result = await targetCollection.insertMany(docs);
        console.log(`Successfully migrated ${result.insertedCount} documents to 'task-planner.${colName}'.`);
      } else {
        console.log(`Collection '${colName}' is empty. Skipped document insertion.`);
      }
    }

    console.log("\nDatabase migration completed successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    await client.close();
  }
}

migrateDatabase();
