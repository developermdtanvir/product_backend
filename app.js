const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();

app.use(cors())
app.use(express.json())


const port = process.env.PORT || 5000




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.338egrb.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



async function run() {
    try {

        const db = client.db('food_collection');
        const foodCollection = db.collection('food');


        app.get('/foods', async (req, res) => {
            const search = req.query.search
            let query = {};
            if (query.length) {
                query = {
                    $text: {
                        $search: search

                    }
                }
            }

            const cursor = await foodCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/food/:id', async (req, res) => {
            const id = req.params.id
            console.log(id);
            const query = { _id: new ObjectId(id) }
            const result = await foodCollection.findOne(query);
            res.send(result);
        })

    }
    finally {

    }
}

run().catch(console.dir)




app.get('/', (req, res) => {
    res.send('My product collection project is running')
})

app.listen(port, () => console.log(`listening port ${port}`))