const express = require('express'); 
const router = express.Router(); 

const authenticate = require('../../middlewares/auth.middleware'); 

const eventController = require('./events.controller.js'); 

// МАРШРУТИ 
router.get('/:id', eventController.getEventById); 
router.post('/', authenticate, eventController.createEvent); 
router.delete('/:id', authenticate, eventController.deleteEvent); 

module.exports = router; 