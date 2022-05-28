const express = require('express');
const cors = require('cors');
require('dotenv').config();
const jwt = require('jsonwebtoken');
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
        const usersAuthCollection = client.db('RRElectronics').collection('usersAuth');

        // PUT AUTH USER 
        app.put('/authUser/:email', async(req, res) =>{
            const email = req.params.email;
            const filter = {email: email};
            const options = { upsert: true };
            const data = req.body;
            const updateDoc = {
                $set: data
              };
          const result = await usersAuthCollection.updateOne(filter, updateDoc, options);
          const token = jwt.sign({email: email}, process.env.ACCESS_TOKEN, {expiresIn: '2h'})
          res.send({result, token});
        });

        // GET ALL USER
        app.get('/authUser', async(req, res) =>{
            const email = req.query.email;
            const query = {email};
            const cursor = await usersAuthCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        });

        // GET ALL USER
        app.get('/users', async(req, res) =>{
            const query = {};
            const cursor = await userCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        });

        // ADD A USER
        app.put('/user', async (req, res) => {
            const user = req.body;
            const filter = { email: user?.email };
            const options = { upsert: true };
            const updateDoc = {
                $set: user
            };
            const result = await userCollection.updateOne(filter, updateDoc, options);
            res.send(result);
        });

        // GET USER DATA
        app.get('/user', async(req, res) =>{
            const email = req.query.email;
            const query = {email: email}
            const result = await userCollection.findOne(query);
            res.send(result);
        });

        // UPDATE USER API
        app.put('/user', async(req, res) => {
            const email = req.query.email;
            const filter = {email: email};
            const data = req.body;
            const options = { upsert: true };
            const updateDoc = {
                $set: data
            };
            const result = await userCollection.updateOne(filter, updateDoc, options);
            res.send(result);
            
        });

        // POST A BOOKED TOOL
        app.put('/tools', async (req, res) => {
            const data = req.body;
            const filter = { name: data?.name, email: data.email }
            const options = { upsert: true };
            const updateDoc = {
                $set: data
            };
            
            const result = await bookedToolCollection.updateOne(filter, updateDoc, options);
            res.send(result);
        })

        // GET TOOLS 
        app.get('/tools', async (req, res) => {
            const query = {};
            const cursor = await toolCollection.find(query);
            const result = await cursor.toArray()
            res.send(result);
        });

        // GET TOOL 
        app.get('/tool', async (req, res) => {
            const id = req.query.id;
            const query = { _id: ObjectId(id) };
            const result = await toolCollection.findOne(query);
            res.send(result);
        });

        // POST NEW TOOL 
        app.post('/tool', async(req, res) =>{
            const data =  req.body;
            const result = await toolCollection.insertOne(data);
            res.send(result);
        })

        // GET REVIEWS 
        app.get('/reviews', async (req, res) => {
            const query = {};
            const cursor = await reviewCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        });

        // POST A REVIEW
        app.post('/review', async(req, res) => {
            const data = req.body;
            const result = await reviewCollection.insertOne(data);
            res.send(result);
        })

        // GET ORDER DATA 
        app.get('/orders', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const cursor = await bookedToolCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        });
        // GET ORDER DATA 
        app.get('/allOrder', async (req, res) => {
            const query = {};
            const cursor = await bookedToolCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        });


        // DELETE SINGLE ORDER
        app.delete('/order', async (req, res) => {
            const id = req.query.id;
            const query = { _id: ObjectId(id) };
            const result = await bookedToolCollection.deleteOne(query);
            res.send(result)
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