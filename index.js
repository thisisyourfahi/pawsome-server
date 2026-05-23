const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const uri = process.env.MONGODB_URI
const port = 5555

const app = express();
app.use(cors());
app.use(express.json());

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
async function run() {
    try {
        await client.connect();
        const db = client.db('pawsome_db')
        const petsCollection = db.collection('pets')

        // add pet
        app.post('/add-pet', async (req, res) => {
            const petInfo = req.body;
            const result = await petsCollection.insertOne(petInfo);
            res.send(result)
        })

        // get all pets
        app.get('/all-pets', async(req, res) => {
            const cursor = await petsCollection.find().toArray();
            res.json(cursor);
        })

        // get a single pet with id
        app.get('/all-pets/:id', async (req, res) => {
            const id = req.params.id
            const serverResponse = await petsCollection.findOne({_id: new ObjectId(id)})
            res.json(serverResponse)
        })

        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('pawsome-server is running!');
})

app.listen(port, () => {
    console.log(`click: http://localhost:${port}`);
})