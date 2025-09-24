const { MongoClient } = require('mongodb');

// Your connection string
const uri = "mongodb+srv://admin:ubTTllreQYaSstv5@himtimlgbootcamp2025.o90xhiv.mongodb.net/";

const client = new MongoClient(uri);

async function run() {
  try {
    // Connect the client to the server
    await client.connect();
    // Establish and verify connection by running a ping command
    await client.db("admin").command({ ping: 1 });
    console.log("✅ Pinged your deployment. You successfully connected to MongoDB!");
  } catch (err) {
    console.error("❌ Connection failed:", err);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

run();