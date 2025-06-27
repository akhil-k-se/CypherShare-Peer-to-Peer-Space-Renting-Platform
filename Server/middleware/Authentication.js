const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Renter = require("../models/user");
const Provider = require("../models/provider");

const JWT_SECRET = process.env.JWT_SECRET;

const cookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    // console.log(`Registering new user - Role: ${role}, Email: ${email}`);

    if (role === "renter") {
      const existingUser = await Renter.findOne({ email });
      if (existingUser) {
        console.log("Renter already exists with email:", email);
        return res.status(400).json({ msg: "User already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const renter = new Renter({
        name,
        email,
        password: hashedPassword,
        role,
      });
      await renter.save();

      console.log("New renter registered:", renter._id);

      const token = jwt.sign({ userId: renter._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
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
        console.log("Provider already exists with email:", email);
        return res.status(400).json({ msg: "User already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const provider = new Provider({
        name,
        email,
        password: hashedPassword,
        role,
      });
      await provider.save();

      console.log("New provider registered:", provider._id);

      const token = jwt.sign({ userId: provider._id, role }, JWT_SECRET, {
        expiresIn: "7d",
      });
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

    console.log("Invalid role provided during registration:", role);
    return res.status(400).json({ msg: "Invalid role" });
  } catch (err) {
    console.error("Registration error:", err.message);
    return res.status(500).json({ msg: "Server error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(`Attempting login for: ${email}`);

    let user = await Renter.findOne({ email });
    if (user) {
      console.log("Found renter with email:", email);
    } else {
      user = await Provider.findOne({ email });
      if (user) console.log("Found provider with email:", email);
    }

    if (!user) {
      console.log("Login failed: User not found");
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Login failed: Incorrect password");
      return res.status(400).json({ msg: "Invalid Pass" });
    }

    const role = user.role;

    const token = jwt.sign({ userId: user._id, role }, JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("token", token, cookieOptions);

    console.log("Login successful for user:", user._id);

    return res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login error:", err.message);
    return res.status(500).json({ msg: "Server error" });
  }
};

const logout = (req, res) => {
  try {
    console.log("Attempting Logging out");
    
    res.clearCookie("token", cookieOptions);
    console.log("Successfully Logged out");
    
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error.message);
    return res.status(500).json({ error: "Failed to logout. Please try again." });
  }
};


const checkingRole = (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET); // or JWT_SECRET if it's already declared
    const role = decoded.role;
    console.log(role);

    return res.status(200).json({ role }); // ✅ send the role in response
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

module.exports = { register, login, logout, checkingRole };
