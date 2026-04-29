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



const authRouter = require("./src/modules/auth/auth.router");

app.use("/api/auth", authRouter);




app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`); 
})