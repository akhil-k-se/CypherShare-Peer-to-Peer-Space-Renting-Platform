const express = require("express");
const dotenv = require("dotenv");
const {dbConnect} = require('./config/db')
const cors = require("cors");
const cookieParser = require('cookie-parser');

const Authentication = require('./routes/Authentication');
const userRoute = require('./routes/userRoute');
const providerRoute = require('./routes/providerRoutes');
const fileUpload = require('./routes/upload')

dotenv.config();
const app = express();

app.use(cookieParser());

app.use(express.json());

app.use(cors({
  origin: (origin, callback) => {
    callback(null, origin); // Reflect the request origin
  },
  credentials: true
}));


dbConnect();

//Authentication
app.use('/auth',Authentication);


//user(renter)
app.use('/user',userRoute);
app.use('/file',fileUpload);

//provider
app.use('/provider',providerRoute);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
