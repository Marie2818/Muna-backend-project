const express = require("express");
const mongoose = require("mongoose");

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection (ONLY ONCE)
mongoose
  .connect("mongodb://munachisouwakwe_db_user:4esjcY2iZ8uq66Mc@ac-dym0eyw-shard-00-00.4uq3x16.mongodb.net:27017,ac-dym0eyw-shard-00-01.4uq3x16.mongodb.net:27017,ac-dym0eyw-shard-00-02.4uq3x16.mongodb.net:27017/?ssl=true&replicaSet=atlas-jxktjb-shard-0&authSource=admin&appName=Cluster0")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

// Schema & Model
const kittySchema = new mongoose.Schema({
  name: { type: String, required: true }
});

const Kitten = mongoose.model("Kitten", kittySchema);

// Routes

app.get("/api/server/status", (req, res) => {
  res.status(200).json({
    status: 200,
    msg: "Server is running"
  });
});

app.post("/api/submit-form/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      status: 400,
      msg: "Username and password are required"
    });
  }

  res.status(200).json({
    status: 200,
    msg: "Login successful!"
  });
});

// CREATE kitten
app.post("/api/kittens", async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        status: 400,
        msg: "Kitten name is required"
      });
    }

    const kitten = new Kitten({ name });
    await kitten.save();

    res.status(201).json({
      status: 201,
      msg: "Kitten created!",
      data: kitten
    });
  } catch (err) {
    res.status(500).json({
      status: 500,
      msg: "Failed to create kitten",
      error: err.message
    });
  }
});

// READ all kittens
app.get("/api/kittens", async (req, res) => {
  try {
    const kittens = await Kitten.find();

    res.status(200).json({
      status: 200,
      msg: "Kittens retrieved",
      data: kittens
    });
  } catch (err) {
    res.status(500).json({
      status: 500,
      msg: "Failed to fetch kittens",
      error: err.message
    });
  }
});

// READ one kitten
app.get("/api/kittens/:id", async (req, res) => {
  try {
    const kitten = await Kitten.findById(req.params.id);

    if (!kitten) {
      return res.status(404).json({
        status: 404,
        msg: "Kitten not found"
      });
    }

    res.status(200).json({
      status: 200,
      msg: "Kitten retrieved",
      data: kitten
    });
  } catch (err) {
    res.status(500).json({
      status: 500,
      msg: "Failed to fetch kitten",
      error: err.message
    });
  }
});

// UPDATE kitten
app.put("/api/kittens/:id", async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        status: 400,
        msg: "Kitten name is required"
      });
    }

    const kitten = await Kitten.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true, runValidators: true }
    );

    if (!kitten) {
      return res.status(404).json({
        status: 404,
        msg: "Kitten not found"
      });
    }

    res.status(200).json({
      status: 200,
      msg: "Kitten updated",
      data: kitten
    });
  } catch (err) {
    res.status(500).json({
      status: 500,
      msg: "Failed to update kitten",
      error: err.message
    });
  }
});

// DELETE kitten
app.delete("/api/kittens/:id", async (req, res) => {
  try {
    const kitten = await Kitten.findByIdAndDelete(req.params.id);

    if (!kitten) {
      return res.status(404).json({
        status: 404,
        msg: "Kitten not found"
      });
    }

    res.status(200).json({
      status: 200,
      msg: "Kitten deleted",
      data: kitten
    });
  } catch (err) {
    res.status(500).json({
      status: 500,
      msg: "Failed to delete kitten",
      error: err.message
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});