const express = require("express");
const mongoose = require("mongoose");
const Accident = require("./models/accidentModel");
const app = express();
const axios = require("axios");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//routes

app.get("/", (req, res) => {
  res.send("Move to /accidents There are Nothing in home page");
});
app.get("/weather", async (req, res) => {
  try {
    const response = await axios.get(
      "https://api.open-meteo.com/v1/forecast?latitude=34.3260314&longitude=8.384242&current_weather=true"
    );
    res.send(response.data);
    console.log(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send(`Server Error ${error}`);
  }
});

app.get("/emka", (req, res) => {
  res.send("EmkaTECH ...");
});

app.get("/accidents", async (req, res) => {
  try {
    const accidents = await Accident.find({});
    const response = await axios.get(
      "https://api.open-meteo.com/v1/forecast?latitude=34.3260314&longitude=8.384242&current_weather=true"
    );
    const weatherData = await response.data
   // console.log(response);

  const fAcc =  await Accident.findOneAndUpdate(
      { _id: accidents[0]._id },
      {
        temperature:weatherData.current_weather.temperature,
      },
      { upsert: true, new: true }
    );

    res.status(200).json(fAcc);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/accidents/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const accident = await Accident.findById(id);
    res.status(200).json(accident);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/accidents", async (req, res) => {
  try {
    const accident = await Accident.create(req.body);
    res.status(200).json(accident);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});

// update a accident
app.put("/accidents/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const accident = await Accident.findByIdAndUpdate(id, req.body);
    // we cannot find any accident in database
    if (!accident) {
      return res
        .status(404)
        .json({ message: `cannot find any accident with ID ${id}` });
    }
    const updatedAccident = await Accident.findById(id);
    res.status(200).json(updatedAccident);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// delete a accident

app.delete("/accidents/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const accident = await Accident.findByIdAndDelete(id);
    if (!accident) {
      return res
        .status(404)
        .json({ message: `cannot find any accident with ID ${id}` });
    }
    res.status(200).json(accident);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// mongoose cloud
// mongodb+srv://emkatech:EE06BC23F2@devgafsaapi.mkcickp.mongodb.net/api?retryWrites=true&w=majority'
mongoose.set("strictQuery", false);
mongoose
  .connect("mongodb://mongo:27017/accidentsdb", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connected to MongoDB");
    app.listen(80, () => {
      console.log(`Node API app is running on port 80`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
