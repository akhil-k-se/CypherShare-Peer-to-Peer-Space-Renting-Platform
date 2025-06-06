const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Renter = require("../models/user");
const Provider = require("../models/provider");

const JWT_SECRET = "testing";

const cookieOptions = {
  httpOnly: true, 
  secure: false, 
  sameSite: "Lax",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (role === "renter") {
      const existingUser = await Renter.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ msg: "User already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const renter = new Renter({ name, email, password: hashedPassword, role });
      await renter.save();

      const token = jwt.sign({ userId: renter._id }, JWT_SECRET, { expiresIn: "7d" });
      res.cookie("token", token, cookieOptions);

      return res.status(201).json({
        user: {
          id: renter._id,
          name: renter.name,
          email: renter.email,
          role: renter.role,
        },
      });
    }

    if (role === "provider") {
      const existingUser = await Provider.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ msg: "User already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const provider = new Provider({ name, email, password: hashedPassword, role });
      await provider.save();

      const token = jwt.sign({ userId: provider._id }, JWT_SECRET, { expiresIn: "7d" });
      res.cookie("token", token, cookieOptions);

      return res.status(201).json({
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

    let user = await Renter.findOne({ email }) || await Provider.findOne({ email });

    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid Pass" });

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "7d" });
    res.cookie("token", token, cookieOptions);

    return res.json({
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
