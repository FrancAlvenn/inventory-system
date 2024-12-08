// Dependencies
const express = require('express');
const {v4: uuidV4} = require('uuid');
const methodOverride = require('method-override');
const path = require('path');
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'dist'))) // Static files - tailwindcss


//Mongoose
const mongoose = require('mongoose');
const { create } = require('domain');
const { stat } = require('fs');
mongoose.connect('mongodb://localhost:27017/inventory');

//Connect to MongoDB
const db = mongoose.connection;

//Check connection
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});


//Schema
const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        default: 0.00
    },
    description: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Inventory = mongoose.model('Item', itemSchema);

//Test Data
let inventory = [
    {
        id: uuidV4(),
        itemName: 'Monitors',
        category: 'Electronics',
        quantity: 5,
        price: 150.00,
        description: 'Monitor',
        createdAt: Date.now
    },
    {
        id: uuidV4(),
        itemName: 'CPUs',
        category: 'Electronics',
        quantity: 10,
        price: 15000.00,
        description: 'CPU'
    },
    {
        id: uuidV4(),
        itemName: 'RAMs',
        category: 'Electronics',
        quantity: 12,
        price: 950.00,
        description: 'RAM'
    }
];





// Routes //

// Index route
app.get('/', (req, res) => {
    res.render('index');
});


//List route
app.get('/inventory', (req, res) => {

    // Get all items from the database
    Inventory.find()
        .then((inventory) => {
            res.render('inventory/index', { inventory });
        })
        .catch((err) => {
            console.log(err);
        })

});



//New route
app.get('/inventory/new', (req, res) => {
    res.render('inventory/new');
});


//Create route
app.post('/inventory', (req, res) => {
    const { name, category, quantity, price, description } = req.body;

    // Create a new item
    const item = new Inventory({
        name: name,
        category: category,
        quantity: quantity,
        price: price,
        description: description
    });

    // Save the item
    item.save()
        .then(() => {
            Inventory.find()
                .then((inventory) => {
                    res.render('inventory/index', {
                        inventory,
                        message: 'Item created successfully!'
                    });
                })
            console.log('Item created successfully!');
        }).catch((err) => {
            console.log(err);
        });

});


//Show route
app.get('/inventory/:id', (req, res) => {
    const { id } = req.params;

    // Find the item
    Inventory.findById(id)
        .then((item) => {
            res.render('inventory/show', { item });
        })
        .catch((err) => {
            console.log(err);
        });
});


//Edit route
app.get('/inventory/:id/edit', (req, res) => {
    const { id } = req.params;

    // Find the item
    Inventory.findById(id)
        .then((item) => {
            res.render('inventory/edit', { item });
        })
        .catch((err) => {
            console.log(err);
        });
});


//Update route
app.put('/inventory/:id', (req, res) => {
    const { id } = req.params;
    const { name, category, quantity, price, description } = req.body;

    // Update the item
    Inventory.updateOne({ _id: id }, { $set: {name, category, quantity, price, description} })
        .then(() => {
            res.redirect(`/inventory/${id}`);
        })
        .catch((err) => {
            console.log(err);
    })

});


//Delete route
app.delete('/inventory/:id', (req, res) => {
    const { id } = req.params;

    // Delete the item
    Inventory.deleteOne({ _id: id })
        .then(() => {
            res.redirect('/inventory');
        })
        .catch((err) => {
            console.log(err);
        });
});


// Start the server
app.listen(3000, () => {
    console.log('Server started on port 3000');
});