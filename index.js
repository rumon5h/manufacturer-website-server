const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

app.use(cors());
app.use(express.json());

// https://calm-castle-51840.herokuapp.com


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ck7ho.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        client.connect();
        const toolCollection = client.db('RRElectronics').collection('tools');
        const reviewCollection = client.db('RRElectronics').collection('reviews');
        const bookedToolCollection = client.db('RRElectronics').collection('bookedTools');
        const userCollection = client.db('RRElectronics').collection('users');

        // ADD A USER
        app.put('/user', async (req, res) => {
            const user = req.body;
            const filter = { email: user?.email };
            console.log(user);
            const options = { upsert: true };
            const updateDoc = {
                $set: user
            };
            const result = await userCollection.updateOne(filter, updateDoc, options);

            res.send(result);
        });

        // POST A BOOKED TOOL
        app.put('/tools', async (req, res) => {
            const data = req.body;
            const filter = { name: data?.name, email: data.email }
            console.log(filter);
            const options = { upsert: true };
            const updateDoc = {
                $set: data
            };
            const result = await bookedToolCollection.updateOne(filter, updateDoc, options);

        })

        // GET TOOLS 
        app.get('/tools', async (req, res) => {
            const query = {};
            const cursor = await toolCollection.find(query);
            const result = await cursor.toArray()
            res.send(result);
        });

        // GET REVIEWS 
        app.get('/reviews', async (req, res) => {
            const query = {};
            const cursor = await reviewCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        });

        // GET ORDER DATA 
        app.get('/orders', async(req, res) => {
            const email = {email: req?.query?.email};
            const cursor = await bookedToolCollection.find(email);
            const result = await cursor.toArray();
            res.send(result);
        })
    }
    finally {

    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello world')
});

app.listen(port, () => {
    console.log('Listening to port', port);
});