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

//Test Data
let inventory = [
    {
        id: uuidV4(),
        itemName: 'Monitors',
        category: 'Electronics',
        quantity: 5,
        price: 150.00,
        description: 'Monitor'
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
    res.render('inventory/index', {inventory});
});


//New route
app.get('/inventory/new', (req, res) => {
    res.render('inventory/new');
});


//Create route
app.post('/inventory', (req, res) => {
    const { itemName, category, quantity, price, description } = req.body;
    const newItem = { id: uuidV4(), itemName, category, quantity, price, description };

    // Add the new item to the inventory
    inventory.push(newItem);
    res.redirect('/inventory');
});


//Show route
app.get('/inventory/:id', (req, res) => {
    const { id } = req.params;
    const item = inventory.find(item => item.id === id);
    res.render('inventory/show', { item });
});


//Edit route
app.get('/inventory/:id/edit', (req, res) => {
    const { id } = req.params;
    const item = inventory.find(item => item.id === id);
    res.render('inventory/edit', { item });
});


//Update route
app.put('/inventory/:id', (req, res) => {
    const { id } = req.params;
    const { itemName, quantity, price } = req.body;
    const item = inventory.find(item => item.id === id);
    item.itemName = itemName;
    item.quantity = quantity;
    item.price = price;
    res.redirect(`/inventory/${id}`);
});


//Delete route
app.delete('/inventory/:id', (req, res) => {
    const { id } = req.params;
    inventory = inventory.filter(item => item.id !== id);
    res.redirect('/inventory');
});


// Start the server
app.listen(3000, () => {
    console.log('Server started on port 3000');
});