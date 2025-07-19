// server/routes/auth.js
const express = require("express");
const router = express.Router();
const User = require("../models/Users.js");
const Exercise = require("../models/Exercise");

// Simple login endpoint
router.post("/users", async (req, res) => {
  const username = req.body;

  const newUser = new User(username);
  await newUser.save((err, user) => {
    if (err) {
      console.log(err);
      res.json({ message: "User creation failed" });
    }
    res.json({ username: user.username, _id: user._id });
  });
});

router.get("/", async (req, res) => {
  try {
    const users = await User.find({}, function (err, users) {
      if (err) {
        console.log(err);
        res.json({
          message: "Getting all users failed!",
        });
      }
      if (users.length === 0) {
        res.json({
          message: "There are no users in the databases!",
        });
      }
      console.log("users in database:".toLocaleUpperCase() + users.length);
      res.json(users);
    });
  } catch (err) {
    res.status(404).json(err);
  }
});

router.post("/:_id/exercises", async (req, res) => {
  try {
    const userId = req.params._id;
    const { description, duration, date } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const exercise = new Exercise({
      userId,
      description,
      duration: Number(duration),
      date: date ? new Date(date) : new Date(),
    });
    await exercise.save();
    res.json({
      _id: user._id,
      username: user.username,
      description: exercise.description,
      duration: exercise.duration,
      date: exercise.date.toDateString(),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.get(":_id/logs", async (req, res)=>{
    try {
      const userId = req.params._id;
      const {from, to , limit} = req.query;
      const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    let query = {userId}; 
    
    if(from || to ) {
        query.date = {};
        if(from) query.date.$gte = new Date(from);
        if (to) query.data.$lte = new Date(to);
    }

    let exercisesQuery = Exercise.find(query);
    if (limit) exercisesQuery = exercisesQuery.limit(Number(limit))
    
    const exercise = await exercisesQuery.exec();
    
    const log = exercise.map(ex=>({
        description:ex.description,
        duration:ex.duration,
        date:ex.date.toDateString()
    }));
    res.json({
        _id:user._id,
        username:user.username,
        count:exercise.length,
        log
    });

    } 
    catch(err){
        res.status(500).json(err);
    }
})

module.exports = router;