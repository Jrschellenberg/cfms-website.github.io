
const express = require('express');
const router = express.Router();
const Twitter = require('twitter-lite');


router.get('/',  async(req, res, next) => {
  try {
    console.log("hit here!");
    
    return res.status(200).json({ success: true, status: 200, message: 'Success' });
  }
  catch(err){
    next(err);
  }
});


export default router

