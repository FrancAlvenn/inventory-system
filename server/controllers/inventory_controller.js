const mongoose = require('mongoose');
const Inventory = require('../../models/inventory');
const fs = require('fs');
const path = require('path');

mongoose.connect('mongodb://localhost:27017/inventory')
    .then(() => {
        console.log('Connected!');
    })
    .catch((err) => {
        console.log(err);
    });


//Index
exports.index = async (req, res) => {
    try {
        res.render('index');
    } catch (err) {
        console.log(err);
    }
}


//List
exports.list = async (req, res) => {
    try {
        // Get all items from the database
        const inventory = await Inventory.find();
        res.render('inventory/index', { inventory });
    } catch (err) {
        console.log(err);
    }
}

//New
exports.new = async (req, res) => {
    try {
        res.render('inventory/new');
    } catch (err) {
        console.log(err);
    }
}


//Create
exports.create = async (req, res, next) => {
    try {
        const { name, category, quantity, price, description } = req.body;

        // Create a new item
        const item = new Inventory({
            name: name,
            category: category,
            quantity: quantity,
            price: price,
            description: description,
            image: {
                data: req.file ? fs.readFileSync(path.resolve(__dirname + '../../../uploads/' + req.file.filename)) : fs.readFileSync(path.resolve(__dirname + '../../../uploads/NoImage.png')),
                contentType: 'image/png'
            }
        });

        // Save the item to the database
        await item.save()
            .then(() => {
                Inventory.find()
                .then((inventory) => {
                    res.render('inventory/index', {
                        inventory,
                        message: 'Item created successfully!'
                    });
                })
            console.log('Item created successfully!');
            })
    } catch (err) {
        console.log(err);
    }
}

//Show
exports.show = async (req, res) => {
    try {
        const { id } = req.params;
         // Find the item
        Inventory.findById(id)
            .then((item) => {
                res.render('inventory/show', { item });
            })
            .catch((err) => {
                console.log(err);
            });
    } catch (err) {
        console.log(err);
    }
}

//Edit
exports.edit = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the item
        Inventory.findById(id)
            .then((item) => {
                res.render('inventory/edit', { item });
            })
            .catch((err) => {
                console.log(err);
            });
    } catch (err) {
        console.log(err);
    }
}

//Update
exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, category, quantity, price, description } = req.body;

        //If no new image is uploaded
        if (!req.file) {
            Inventory.updateOne({ _id: id }, {
                $set: {
                    name,
                    category,
                    quantity,
                    price,
                    description
                }
            })
            .then(() => {
                res.redirect(`/inventory/${id}`);
            })
            .catch((err) => {
                console.log(err);
            })
            return
        }

        // Update the item
        Inventory.updateOne({ _id: id }, {
            $set: {
                name,
                category,
                quantity,
                price,
                description,
                image: {
                    data: fs.readFileSync(path.resolve(__dirname + '../../../uploads/' + req.file.filename)),
                    contentType: 'image/png'
                }
                }
            })
            .then(() => {
                res.redirect(`/inventory/${id}`);
            })
            .catch((err) => {
                console.log(err);
        })
    }catch (err) {
        console.log(err);
    }
}


//Delete
exports.delete = async (req, res) => {
    try {
        const { id } = req.params;

        // Delete the item
        Inventory.deleteOne({ _id: id })
            .then(() => {
                res.redirect('/inventory');
            })
            .catch((err) => {
                console.log(err);
            });
    } catch (err) {
        console.log(err);
    }
}