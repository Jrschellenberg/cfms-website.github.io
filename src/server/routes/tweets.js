import ServerUtils from '../utils/serverUtils';
const express = require('express');
const router = express.Router();
const Twitter = require('twitter-lite');

const twitter = new Twitter(ServerUtils.getTwitterCredentials());

router.get('/:user',  async(req, res, next) => {
  let count = parseInt(req.query.count);
  if(isNaN(count)){
    count = 3;
  }
  if(count > 25){
    count = 25;
  }
  if(count < 1) {
    count = 1;
  }
  
  try {
    const twitterFeed = await twitter.get("statuses/user_timeline", {
      count: count || 3,
      exclude_replies: true,
      screen_name: req.params.user
    });
    
    return res.status(200).json({ success: true, status: 200, message: 'Success', posts: twitterFeed });
  }
  catch(err){
    next(err);
  }
});


export default router

