const express = require('express');
const router = express.Router();

// lets define initial / root
router.get('/user',(req,res)=>{
  res.json({"msg":"Hi method GET called"});
});

router.post('/setuser',(req,res)=>{
  var params = {
    data:req.body,
    headers:req.headers,
    msg:"Hi method POST called"
  };
  res.json(params);
});

module.exports = router;
