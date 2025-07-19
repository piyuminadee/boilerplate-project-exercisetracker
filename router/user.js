// server/routes/auth.js
const express = require('express');
const router = express.Router();
const User = require('../models/Users.js');


// Simple login endpoint
router.post('/users', async (req, res) => {
  const  username  = req.body;
  
   const newUser = new User(username);
       await newUser.save((err, user)=>{
        if(err) {
            console.log(err);
            res.json({message:'User creation failed'});
        }
         res.json({username:user.username, _id:user._id});
       });

});



 
router.get('/users', async (req, res) => {
     try {
            const users = await User.find({}, function(err, users){
                if(err){
                    console.log(err);
                    res.json({
                        message:'Getting all users failed!'
                    });
                
                }
                if (users.length ===0){
                    res.json({
                        message:'There are no users in the databases!'
                    });
                }
                console.log('users in database:'.toLocaleUpperCase() + users.length);
                res.json(users);
            })
            
        } catch (err) {
            res.status(404).json(err);
        }
})





