const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Renter = require("../models/user");
const Provider = require("../models/renter");

const JWT_SECRET = "testing";

const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    console.log("Registering");
    console.log({ name, email, password, role });
    
    

    if (role == "renter") {

      const existingUser = await Renter.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ msg: "User already exists" });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);



      const renter = new Renter({
        name,
        email,
        password: hashedPassword,
        role,
      });

      await renter.save();

      const payload = { userId: renter._id };
      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });

      

      return res.status(201).json({
        token,
        user: {
          id: renter._id,
          name: renter.name,
          email: renter.email,
          role: renter.role,
        },
      });
    } else if (role == "provider") {
      const existingUser = await Provider.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ msg: "User already exists" });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const provider = new Provider({
        name,
        email,
        password: hashedPassword,
        role,
      });

      await provider.save();

      const payload = { userId: provider._id };
      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });

      return res.status(201).json({
        token,
        user: {
          id: provider._id,
          name: provider.name,
          email: provider.email,
          role: provider.role,
        },
      });
    }
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ msg: "Server error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log({ email, password });
    

    let user = await Renter.findOne({ email });

    if (!user) {
      user = await Provider.findOne({ email });
      if (!user) {
        return res.status(400).json({ msg: "Invalid credentials" });
      }
    }

    console.log("Entered password:", password);
    console.log("Stored password (hashed):", user.password);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid Pass" });
    }

    const payload = { userId: user._id };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });

    return res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ msg: "Server error" });
  }
};


module.exports = { register, login };
