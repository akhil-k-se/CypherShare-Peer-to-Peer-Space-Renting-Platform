const jwt = require('jsonwebtoken');
const Renter = require('../models/user');
const Provider = require('../models/provider');

const JWT_SECRET = "testing";

const getInfo = async (req, res) => {
  try {
    console.log("Incoming request to /getInfo");

    const token = req.cookies.token;
    console.log("Token from cookies:", token);

    if (!token) {
      console.warn("No token provided in cookies");
      return res.status(401).json({ msg: "No token, authorization denied" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId;
    console.log("Decoded userId from token:", userId);

    let user = await Renter.findById(userId);
    if (user) {
      console.log("User found in Renter model:", user.email);
    } else {
      console.log("User not found in Renter model. Checking Provider model...");
      user = await Provider.findById(userId);

      if (user) {
        console.log("User found in Provider model:", user.email);
      }
    }

    if (!user) {
      console.warn("No user found in either model");
      return res.status(404).json({ msg: "User not found" });
    }

    console.log("User fetched successfully:", {
      id: user._id,
      name: user.name,
      role: user.role,
    });

    return res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (err) {
    console.error("Error in getInfo:", err.message);
    return res.status(500).json({ msg: "Server error" });
  }
};

module.exports = { getInfo };
