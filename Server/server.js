const express = require("express");
const dotenv = require("dotenv");
const {dbConnect} = require('./config/db')
const cors = require("cors");

const Authentication = require('./routes/Authentication');

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

dbConnect();

//Authentication
app.use('/auth',Authentication);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
