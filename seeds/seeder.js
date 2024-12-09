const mongoose = require('mongoose');
const Inventory = require('../models/inventory');

mongoose.connect('mongodb://localhost:27017/inventory')
    .then(() => {
        console.log('Seeder Connected!');
    })
    .catch((err) => {
        console.log(err);
    });

const seedUsers = async () => {
    // await Inventory.deleteMany({});

    //Check if database already has an item
    const count = await Inventory.countDocuments();
    if (count > 0) {
        return;
    }

    const newItem = new Inventory({
        name: 'Aspire 5 AMD',
        category: 'Electronics',
        quantity: 6,
        price: 29990.00,
        description: 'High-end gaming laptop!'
    });

    const newItem2 = new Inventory({
        name: 'Aspire 3 AMD',
        category: 'Electronics',
        quantity: 5,
        price: 19999.99,
        description: 'Mid-range laptop!'
    });

    await newItem.save();
    await newItem2.save();
};

seedUsers().then(() => {
    mongoose.connection.close();
});
