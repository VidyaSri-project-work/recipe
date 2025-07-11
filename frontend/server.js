const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const userschema = new mongoose.Schema({
  dishname: String,
  ingredients: [String]
});

const usermodel = mongoose.model('task', userschema);

app.post('/', async (req, res) => {
  try {
    const { dishname, ingredients } = req.body;
    const newUser = new usermodel({ dishname, ingredients });
    await newUser.save();
    console.log(newUser);
    res.status(201).json(newUser);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: error.message });
  }
});

app.get('/', async (req, res) => {
  try {
    const users = await usermodel.find();
    res.json(users);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: error.message });
  }
});

app.put('/:id', async (req, res) => {
  try {
    const { dishname, ingredients } = req.body;
    const id = req.params.id;

    const updatedUser = await usermodel.findByIdAndUpdate(
      id,
      { dishname, ingredients },
      { new: true }
    );
  } catch (error) {
    console.error( error.message);
    res.status(500).json({ message: error.message });
  }
});

app.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    await usermodel.findByIdAndDelete(id);
    res.json({ message: "Dish deleted successfully" });
  } catch (error) {
    console.error("DELETE error:", error.message);
    res.status(500).json({ message: error.message });
  }
});

mongoose.connect('mongodb+srv://vidyasri0211:vidyasri0211@cluster0.qhi9f1p.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log(" MongoDB Connected"))
  .catch((error) => console.error(" MongoDB Connection Error:", error.message));

const port = 5000;
app.listen(port, () => {
  console.log(`Server Connected`);
});
