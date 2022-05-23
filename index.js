const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ck7ho.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        client.connect();
        const toolCollection = client.db('tools').collection('tool');
        const reviewCollection = client.db('reviews').collection('review');

        // GET TOOLS 
        app.get('/tools', async (req, res) => {
            const query = {};
            const cursor = await toolCollection.find(query);
            const result = await cursor.toArray()
            res.send(result);
        });

        // GET REVIEWS 
        app.get('/reviews', async(req, res) =>{
            const query = {};
            const cursor = await reviewCollection.find(query);
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