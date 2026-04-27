const express = require('express'); 
const cors = require('cors'); 

const PORT = 3000; // ТИМЧАСОВО 

const app = express(); 

app.use(cors()); 
app.use(express.json()); 

// МАРШРУТИ 

const eventsRouter = require('./src/modules/events/events.router'); 
//const usersRouter = require('./src/modules/users/users.router'); 
//const authRouter = require('./src/modules/auth/auth.router'); 

//app.use('/api/auth', authRouter); 
//app.use('/api/users', usersRouter); 
app.use('/api/events', eventsRouter); 

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`); 
}) 