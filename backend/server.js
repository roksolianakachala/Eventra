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
app.use(express.json({ limit: '10mb' })); 
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.use(cors({ 
  origin: function (origin, callback) {
    const allowedOrigins = [
      "http://localhost:3000",
      "https://eventra-for-events.netlify.app"
    ]; 
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
})); 

app.use(express.json()); 

app.get('/', (req, res) => {
  res.send('running ');
});


app.get("/health", (req, res) => {
  res.send("ok");
});



const authRouter = require("./src/modules/auth/auth.router");
const eventsRouter = require("./src/modules/events/events.router"); 
const profileRouter = require("./src/modules/Profile/profile.routes");
const chatsRouter = require("./src/modules/chats/chats.routes");
const friendsRouter = require("./src/modules/friends/friends.router");
const tutorRouter = require("./src/modules/tutor/tutor.routes");
// const searchRouter = require("./src/modules/search/search.routes");

app.use("/api/auth", authRouter);
app.use("/api/events", eventsRouter);
app.use("/api/profile", profileRouter);
app.use("/api/chats", chatsRouter);
app.use("/api/friends", friendsRouter);
app.use("/api/tutor", tutorRouter);
// app.use("/api/search", searchRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`); 
})
