const express = require('express'); 
const router = express.Router(); 

const eventController = require('./events.controller.js'); 

router.get('/:id', eventController.getEventById); 
router.post('/', eventController.createEvent); 

module.exports = router; 