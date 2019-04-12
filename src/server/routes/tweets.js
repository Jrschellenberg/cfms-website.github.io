
const express = require('express');
const router = express.Router();
const Twitter = require('twitter-lite');


router.get('/',  async(req, res, next) => {
  try {
    const documents = await db.getPictures();
    
    return res.status(200).json({ success: true, status: 200, message: 'Success', pictures: documents });
  }
  catch(err){
    next(err);
  }
});


