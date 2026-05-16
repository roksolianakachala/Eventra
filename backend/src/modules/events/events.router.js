const express = require('express'); 
const router = express.Router();  

const multer = require('multer'); 
const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 } 
}); 

const authenticate = require('../../middlewares/auth.middleware'); 

const eventController = require('./events.controller.js'); 

// МАРШРУТИ 
router.get('/:id', eventController.getEventById); 
router.get('/', eventController.getEvents); 
router.post('/', authenticate, eventController.createEvent); 
router.post('/upload', authenticate, upload.single('banner'), eventController.uploadEventBanner); 
router.delete('/:id', authenticate, eventController.deleteEvent); 

module.exports = router; 