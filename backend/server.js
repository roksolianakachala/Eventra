require("dotenv").config();

const express = require('express'); 
const cors = require('cors'); 

const PORT = process.env.PORT || 5000;

const app = express(); 

app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://eventra-for-events.netlify.app"
  ],
  credentials: true
}));
app.use(express.json()); 

app.get('/', (req, res) => {
  res.send('running ');
});

const authRouter = require("./src/modules/auth/auth.router");
const eventsRouter = require("./src/modules/events/events.router"); 

app.use("/api/auth", authRouter);
app.use("/api/events", eventsRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`); 
})
