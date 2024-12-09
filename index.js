// Dependencies
const express = require('express');
const {v4: uuidV4} = require('uuid');
const methodOverride = require('method-override');
const path = require('path');
const app = express();

const inventoryRouter = require('./server/routes/inventory_route');

// Middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'dist'))) // Static files - tailwindcss

app.use('/', inventoryRouter)


// Start the server
app.listen(3000, () => {
    console.log('Server started on port 3000');
});