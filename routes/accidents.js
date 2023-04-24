const express = require('express');

const router = express.Router();

const axios = require("axios");
const {getLoggerUser,

} = require('../helper/user_permission');
const Accident = require('../models/accidentModel');




router.get("/accidents", async (req, res) => {
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
  
  router.get("/accidents/:id", async (req, res) => {
    const user = await getLoggerUser(req.userId);

    if (!req.isAuth || !user.administrator) {
      return res.status(401).json({ message: 'Unauthenticated!' });
    }
    try {
      const { id } = req.params;
      const accident = await Accident.findById(id);
      res.status(200).json(accident);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  router.post("/accidents", async (req, res) => {
    const user = await getLoggerUser(req.userId);

    if (!req.isAuth || !user.administrator) {
      return res.status(401).json({ message: 'Unauthenticated!' });
    }
    try {
      const accident = await Accident.create(req.body);
      res.status(200).json(accident);
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ message: error.message });
    }
  });
  
  // update a accident
  router.put("/accidents/:id", async (req, res) => {
    const user = await getLoggerUser(req.userId);

    if (!req.isAuth ) {
      return res.status(401).json({ message: 'Unauthenticated!' });
    }
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
  
  
  
  router.delete("/accidents/:id", async (req, res) => {
    const user = await getLoggerUser(req.userId);

    if (!req.isAuth || !user.administrator) {
      return res.status(401).json({ message: 'Unauthenticated!' });
    }
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
  module.exports = router;
