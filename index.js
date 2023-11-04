const express = require('express');
const app = express();
const cors = require('cors');





app.use(cors())
app.use(express.json())
require('dotenv').config();
const port = process.env.PORT || 5000;


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.db_user}:${process.env.db_pass}@userdata.x9m7z24.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        client.connect();
        const database = client.db("whackamole");
        const userdata = database.collection("userdata");
        const multi = database.collection("multi");

        app.get("/userdata", async (req, res) => {
            const result = await userdata.find().toArray();
            res.send(result);
        });
        app.get('/multi', async (req, res) => {
            const result = await multi.find().toArray();
            res.send(result);
        });
        app.post('/userdata', async (req, res) => {
            const newUser = req.body;
            console.log('adding new user', newUser);
            const result = await userdata.insertOne(newUser);
            res.send(result)
        });
        app.post('/multi', async (req, res) => {
            const newUser = req.body;
            console.log('adding new user to multi', newUser);
            const result = await multi.insertOne(newUser);
            res.send(result)
        });
        app.delete('/multi/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await multi.deleteOne(query);
            res.send(result);
        });
        app.patch('/multi/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const updatedScore = req.body;
            console.log(updatedScore)
            const updatedoc = {
                $set: { score: updatedScore.score, }
            };
            const result = await multi.updateOne(filter, updatedoc);
            res.send(result);


        });
        app.patch('/userdata/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const updatedScore = req.body;
            console.log(updatedScore)
            const updatedoc = {
                $set: { score: updatedScore.score, }
            };
            const result = await userdata.updateOne(filter, updatedoc);
            res.send(result);


        });



        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('setting successfull')
})

app.listen(port, () => {
    console.log('port is listening')
})

