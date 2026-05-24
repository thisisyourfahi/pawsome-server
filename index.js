const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const uri = process.env.MONGO_URI
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
        const adoptionsCollection = db.collection('adoptions')

        // add adoption 
        app.post('/add-adoption', async (req, res) => {
            const adoptionInfo = req.body;
            const result = await adoptionsCollection.insertOne(adoptionInfo);
            res.send(result);
        })

        // get all adoption request made by a user
        app.get('/dashboard/my-requests/:id', async (req, res) => {
            const applicantId = req.params.id;
            const cursor = await adoptionsCollection.find({applicantId: applicantId}).toArray();
            res.json(cursor);
        })

        // add pet
        app.post('/add-pet', async (req, res) => {
            const petInfo = req.body;
            const result = await petsCollection.insertOne(petInfo);
            res.send(result)
        })

        // get all pets
        app.get('/all-pets', async (req, res) => {
            const cursor = await petsCollection.find().toArray();
            res.json(cursor);
        })

        // get all pets of a particualr user
        app.get('/dashboard/my-listings/:id', async (req, res) => {
            const userId = req.params.id;
            const query = {
                ownderId: userId
            }
            const cursor = await petsCollection.find(query).toArray();
            res.json(cursor);
        })

        // get a single pet with id
        app.get('/all-pets/:id', async (req, res) => {
            const id = req.params.id
            const serverResponse = await petsCollection.findOne({ _id: new ObjectId(id) })
            res.json(serverResponse)
        })

        // update a pet
        app.patch('/update-pet/:id', async (req, res) => {
            const id = req.params.id
            const petInfo = req.body;
            const result = await petsCollection.updateOne({_id: new ObjectId(id)}, { $set: petInfo})
            res.json(result);
        })

        // delete a pet
        app.delete('/delete/:id', async (req, res) => {
            const id = req.params.id
            console.log('user wants to delete:', id);
            const result = await petsCollection.deleteOne({_id : new ObjectId(id)});
            res.json(result);
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