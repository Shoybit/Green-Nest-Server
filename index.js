const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lnfp781.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

    await client.db("admin").command({ ping: 1 });
    console.log("Successfully connected to MongoDB!");

    // Collections
    const plantCollection = client.db("greenNest-db").collection("plants");
    const bookingCollection = client.db("greenNest-db").collection("bookings"); // ⭐ NEW

  
    // GET all plants
    
    app.get("/plants", async (req, res) => {
      const result = await plantCollection.find().toArray();
      res.send(result);
    });

    
    // GET single plant by ID
 
    app.get("/plants/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const plant = await plantCollection.findOne({ _id: new ObjectId(id) });
        plant ? res.send(plant) : res.status(404).send({ error: "Plant not found" });
      } catch (error) {
        res.status(500).send({ error: "Internal server error" });
      }
    });

    
    //Save booking
    
    app.post("/bookings", async (req, res) => {
      try {
        const newBooking = req.body;

        const result = await bookingCollection.insertOne(newBooking);

        res.send({
          success: true,
          message: "Booking saved successfully!",
          data: result,
        });
      } catch (error) {
        console.log("Booking save error:", error);
        res.status(500).send({
          success: false,
          message: "Failed to save booking.",
        });
      }
    });

    // DELETE booking by id
app.delete("/bookings/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const result = await bookingCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 1) {
      res.send({ message: "Booking deleted successfully" });
    } else {
      res.status(404).send({ error: "Booking not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal server error" });
  }
});


  
    // Get all bookings 
  
    app.get("/bookings", async (req, res) => {
      try {
        const result = await bookingCollection.find().toArray();
        res.send(result);
      } catch (error) {
        res.status(500).send({ success: false, message: "Failed to fetch bookings." });
      }
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
