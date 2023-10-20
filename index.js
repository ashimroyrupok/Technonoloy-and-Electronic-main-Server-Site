const express = require("express")
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const cors = require('cors')
const app = express()
const port = process.env.PORT || 5000


// middleware
app.use(cors())
app.use(express.json())





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uwnroha.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);

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
        await client.connect();

        const brandsCollection = client.db("brandsDB").collection("brands")
        const productsCollection = client.db('productsDB').collection("products")
        const cartsCollection = client.db("cartsDB").collection('carts')

        app.post("/brands", async (req, res) => {
            const brands = req.body
            const result = brandsCollection.insertOne(brands)

            res.send(result)
        })

        app.get("/brands", async (req, res) => {

            const result = await brandsCollection.find().toArray()
            res.send(result)

        })


        // add product collection

        app.get("/products", async (req, res) => {
            const result = await productsCollection.find().toArray()
            res.send(result)
        })

        // get products for update
        app.get("/products/:id", async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const find = await productsCollection.findOne(query)
            res.send(find)
        })

        // update
        app.put("/products/:id", async (req, res) => {
            const id = req.params.id;
            const options = { upsert: true };
            const filter = { _id: new ObjectId(id) }
            const updatedProduct = req.body
            const Product = {
                $set: {
                    name: updatedProduct.name,
                    img: updatedProduct.img,
                    selectedBrand: updatedProduct.selectedBrand,
                    selectedType: updatedProduct.selectedType,
                    price: updatedProduct.price,
                    rating: updatedProduct.rating,
                    description: updatedProduct.description

                }
            }
            const result = await productsCollection.updateOne(filter, Product, options)
            res.send(result)
        })

        app.post("/products", async (req, res) => {
            const products = req.body;
            const result = productsCollection.insertOne(products)
            // console.log(products);
            res.send(result)
        })


        // add to cartcollection


        app.get("/carts", async (req, res) => {
            const result = await cartsCollection.find().toArray()
            res.send(result)
        })


        app.post("/carts", async (req, res) => {
            const carts = req.body;
            const result = cartsCollection.insertOne(carts)
            // console.log(products);
            res.send(result)
        })
        // delete carts data
        app.delete('/carts/:id' , async(req,res) => {
            const id = req.params.id
            const query = {_id : new ObjectId(id)}
            const result = await cartsCollection.deleteOne(query)
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




app.get('/', (req, res) => {
    res.send("technology and electronic server is running...")
})

app.listen(port, () => {
    console.log(`technology and electronics  running port is ${port}`);
})