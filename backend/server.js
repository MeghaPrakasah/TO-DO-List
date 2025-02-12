const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(()=>{
    console.log("DB connected");
    
});

const TaskSchema = new mongoose.Schema({ text: String });
const Task = mongoose.model("Task", TaskSchema);

// Routes
app.get("/api/tasks", async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

app.post("/api/tasks", async (req, res) => {
  const newTask = new Task({ text: req.body.text });
  await newTask.save();
  res.json(newTask);
});

app.delete("/api/tasks/:id", async (req, res) => {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted" });
  });

  app.put("/api/tasks/:id", async (req, res) => {
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, { text: req.body.text }, { new: true });
    res.json(updatedTask);
  });
  
// Start server
app.listen(5000, () => console.log("Server running on port 5000"));
