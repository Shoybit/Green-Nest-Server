const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");

require("dotenv").config();

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

//  MongoDB URI 
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lnfp781.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// MongoClient
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    // test connection
    await client.db("admin").command({ ping: 1 });
    console.log("Successfully connected to MongoDB!");

    // Collections
    const plantCollection = client.db("greenNest-db").collection("plants");

    // GET all plants
    app.get("/plants", async (req, res) => {
      const result = await plantCollection.find().toArray();
      res.send(result);
    });

    // Start Server 
    app.listen(port, () => {
      console.log("Server running on port", port);
    });
  } catch (err) {
    console.log(err);
  }
}

run();
