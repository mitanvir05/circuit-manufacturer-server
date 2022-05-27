const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5000;
const app = express();

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vveu2kc.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
async function run() {
  try {
    await client.connect();
    const toolCollection = client.db("circuit_store").collection("tool");
    const reviewCollection = client.db("circuit_store").collection("review");
    const contactCollection = client.db("circuit_store").collection("contact");
    //for tool
    app.get("/tool", async (req, res) => {
      const query = {};
      const cursor = toolCollection.find(query);
      const tools = await cursor.toArray();
      res.send(tools);
    });

    //for review
    app.get("/review", async (req, res) => {
      const query = {};
      const cursor = reviewCollection.find(query);
      const review = await cursor.toArray();
      res.send(review);
    });

    // Get
    app.get("/tool/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const tool = await toolCollection.findOne(query);
      res.send(tool);
    });
    //POST
    app.post("/review", async (req, res) => {
      const reviews = req.body;
      const result = await reviewCollection.insertOne(reviews);
      res.send(result);
    });
    //addTool
    app.post("/tool", async (req, res) => {
      const addTool = req.body;
      const result = await toolCollection.insertOne(addTool);
      res.send(result);
    });
    //contact
    app.post("/contact", async (req, res) => {
      const addContact = req.body;
      const result = await contactCollection.insertOne(addContact);
      res.send(result);
    });
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Tools Loading");
});
app.listen(port, () => {
  console.log("Listening port", port);
});
