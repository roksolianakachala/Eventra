require("dotenv").config();

const express = require('express'); 
const cors = require('cors'); 

const PORT = 5000; // ТИМЧАСОВО 

const app = express(); 

app.use(cors()); 
app.use(express.json()); 



const authRouter = require("./src/modules/auth/auth.router");

app.use("/api/auth", authRouter);




app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`); 
})