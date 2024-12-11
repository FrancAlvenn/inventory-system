const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventory_controller');


const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });


// Index route
router.get('/', inventoryController.index);

//List route
router.get('/inventory', inventoryController.list);

//New route
router.get('/inventory/new', inventoryController.new);

//Create route
router.post('/inventory', upload.single('image') ,inventoryController.create);

//Show route
router.get('/inventory/:id', inventoryController.show);

//Edit route
router.get('/inventory/:id/edit', inventoryController.edit);


//Update route
router.put('/inventory/:id', upload.single('image') , inventoryController.update);

//Delete route
router.delete('/inventory/:id', inventoryController.delete);

module.exports = router;