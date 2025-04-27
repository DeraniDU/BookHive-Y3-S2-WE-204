const express = require("express")
const router = express.Router();
const Users = require("../models/usersModel")

//getuser
//get all users
router.get("/getallusers",async(req,res)=>{

  try {
      const users = await Users.find()
      return res.json(users);
  } catch (error) {
      return res.status(400).json({massage : error})
  }
});
  
  module.exports=router;