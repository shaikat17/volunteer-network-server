const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Replace the uri string with your connection string.
const uri = "mongodb://127.0.0.1:27017/";

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

    const vonlunteerNetworkDB = client.db("vonlunteerNetworkDB");
    const VNDBEvents = vonlunteerNetworkDB.collection("VNDBEvents");
    const VNDBUsers = vonlunteerNetworkDB.collection("VNDBUsers");

    app.post("/add-event", async (req, res) => {
      const data = req.body;

      const result = await VNDBEvents.insertOne(data);
      res.send(result);
    });

    app.get("/events", async (req, res) => {
      const events = await VNDBEvents.find().toArray();

      res.send(events);
    });

    app.post("/register", async (req, res) => {
      const data = req.body;

      const result = await VNDBUsers.insertOne(data);
      res.send(result);
    });

    app.get("/users", async (req, res) => {
      const result = await VNDBUsers.find().toArray();

      res.send(result);
    });

    app.put("/user/:id", async (req, res) => {
      const id = req.params.id;
      const data = req.body;
    //   console.log(id, data);
    //   const options = { upsert: true };
      const result = await VNDBUsers.updateOne(
        { _id: new ObjectId(id) },
        { $addToSet: { events: data } }
      );

      // res.send(result)
      res.send(result);
    });

    app.get("/user/:id", async (req, res) => {
        const id = req.params.id;
        console.log(id)
        const result = await VNDBUsers.findOne({"_id": new ObjectId(id)})
        console.log(result)
        res.send(result);
      });

    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Volunteer Network");
});

app.listen(port, (req, res) => {
  console.log(`server start on ${port}`);
});
