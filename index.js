const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb')
const app = express();
require('dotenv').config()
const port = process.env.PORT || 7000;

// middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('brand shop server is running');
})



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
// const uri = "mongodb+srv://houseCar:ZjKP2co7mXRLPrL9@cluster0.xipfv.mongodb.net/?retryWrites=true&w=majority";
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xipfv.mongodb.net/?retryWrites=true&w=majority`;

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

        const carCollection = client.db('carDB').collection('car')

        // 2 step
        app.get('/car', async (req, res) => {
            const cursor = carCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })


        // 3 step
        app.get('/car/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await carCollection.findOne(query)
            res.send(result)
        })



        // 1 step
        app.post('/car', async (req, res) => {
            const newCar = req.body;
            console.log(newCar);
            const result = await carCollection.insertOne(newCar);
            res.send(result)
        })
        app.delete('/car/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await carCollection.deleteOne(query)
            res.send(result)
        })

        // 4 step
        app.put('/car/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id)
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true }
            const updateCar = req.body;
            const car = {
                $set: {
                    photo: updateCar.photo,
                    name: updateCar.name,
                    brand: updateCar.brand,
                    price: updateCar.price,
                    rating: updateCar.rating,
                    type: updateCar.type
                }
            }
            const result = await carCollection.updateOne(filter, car, options)
            res.send(result)
        })




        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);





app.listen(port, () => {
    console.log(`brand shop server is running on port: ${port}`)
})