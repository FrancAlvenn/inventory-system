const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventory_controller');

// Index route
router.get('/', inventoryController.index);

//List route
router.get('/inventory', inventoryController.list);

//New route
router.get('/inventory/new', inventoryController.new);

//Create route
router.post('/inventory', inventoryController.create);

//Show route
router.get('/inventory/:id', inventoryController.show);

//Edit route
router.get('/inventory/:id/edit', inventoryController.edit);


//Update route
router.put('/inventory/:id', inventoryController.update);

//Delete route
router.delete('/inventory/:id', inventoryController.delete);

module.exports = router;