const express = require('express');
const router = express.Router();
const sha512  = require('js-sha512');
const CryptoJS = require('crypto-js');
const axios = require('axios');
const crypto = require('crypto');
// lets define initial / root
router.get('/user',(req,res)=>{
  res.json({"msg":"Hi method GET called"});
});

router.get('/req', (req, res) => {
	const apikey = '36ab05ac779ea12bb24fc389c6734bb804838df995087e807748ecf242ce61d5dade5a728e36c1e570b95180c1ea74ced8513f187aa8d4065b514b53636f2ba9';
	const pubkey = 'bf87b2a336b57a7eb3e8acee6e1e855dd531c81d470219f7e6a4523f77aa88fca5ddc0819d6498f0a0045c99f1b1dc892f990ce29d7b86f06423f2cfb76a6f6e';
	const body = {
	  	name: 'expressapp',
	  	age: 23
	};
	const hash = crypto.createHmac('sha512', pubkey)
                   .update(JSON.stringify(body))
                   .digest('base64');
	// interpret
    // body['age'] = 25;
    // body['address'] = 'sdf';
	axios({
	  method:'POST',
	  url:'http://localhost:3000/api/test',
	  responseType:'json',
	  headers: {
	  	'X-API-KEY':apikey,
	  	'X-PUB-KEY':pubkey,
	  	'signature': hash
	  },
	  params: {
	  	// 'id': '12'
	  },
	  data: body,
	  timeout: 1000
	})
	.then(function(response) {
		console.log('response',response.data)
	  res.send(response.data);
	})
	.catch(function (error) {
	  console.log('error',error);
	  res.send(error);
	});
});

router.post('/setuser',(req,res)=>{
  var params = {
    data:req.body,
    headers:req.headers,
    msg:"Hi method POST called"
  };
  res.json(params);
});

router.post('/test', (req, res, next) => {
	const apikey = '36ab05ac779ea12bb24fc389c6734bb804838df995087e807748ecf242ce61d5dade5a728e36c1e570b95180c1ea74ced8513f187aa8d4065b514b53636f2ba9';
	const pubkey = 'bf87b2a336b57a7eb3e8acee6e1e855dd531c81d470219f7e6a4523f77aa88fca5ddc0819d6498f0a0045c99f1b1dc892f990ce29d7b86f06423f2cfb76a6f6e';
	const signByPrivKey = decryptpkey(pubkey, apikey);
	const hash = crypto.createHmac('sha512', signByPrivKey)
                   .update(JSON.stringify(req.body))
                   .digest('base64');
    console.log('decrypthash:', hash);
    if (req.headers.signature === hash) {
    	console.log('true')
    } else {
    	console.log('false')
    }
	var params = {
	    data:req.body,
	    headers:req.headers,
	    msg:"Hi method POST called"
	  };
	res.json(params);
});

function decryptpkey(pubkey, apikey) {
	try{
      let token = pubkey;
      let fromStorage = 'U2FsdGVkX188+sb2Y7wAfpJbF4wsSlOoz15qAQ4lC1TV/isN3KKMQ7UJGMTg9CQJlxU81dnZT3L2kRbLMpAJJwr+kR3Dee/UP9G34GGWOCdDqjPHzVwO3i+Rqv1SGyVckpRS4noBnUySLd1Qk7fZjSKXGxK3uV8jED1Ok/OBK+6gIpECMdqKMDbK8cnozWJW8sdySVh/eq11RQRgFrMd9Q==';
      if(token == "" || token == null) {
      	console.log('1---------')
        return "";
      } else {
        let getDecrypt = CryptoJS.AES.decrypt(fromStorage,token);
        let finalStr = "";
        finalStr = getDecrypt.toString(CryptoJS.enc.Utf8);
        console.log('2---------', finalStr)
        if (finalStr === apikey) {
	        return pubkey;
	    } else {
	    	console.log('4---------');return "";
	    }
      }
    } catch (e) { console.log('3---------');return ""; }
}

function makeKeys() {
	const salt = 'NODE';
	
	const key = '36ab05ac779ea12bb24fc389c6734bb804838df995087e807748ecf242ce61d5dade5a728e36c1e570b95180c1ea74ced8513f187aa8d4065b514b53636f2ba9'; // api key
	// const key = sha512('jitendra');
	console.log('APIKEY:',key);

	const pubkey = sha512(salt+key); // public key
	console.log('PUBKEY:', pubkey);
	try{
	    let token = key;
	    //console.log(token)
	    let privkey = (CryptoJS.AES.encrypt(key,pubkey)).toString();
	    // console.log('PRIVKEY:', privkey);// private key
    }catch(e){}
}

makeKeys();

module.exports = router;


/*
APIKEY: 36ab05ac779ea12bb24fc389c6734bb804838df995087e807748ecf242ce61d5dade5a728e36c1e570b95180c1ea74ced8513f187aa8d4065b514b53636f2ba9

PUBKEY: bf87b2a336b57a7eb3e8acee6e1e855dd531c81d470219f7e6a4523f77aa88fca5ddc0819d6498f0a0045c99f1b1dc892f990ce29d7b86f06423f2cfb76a6f6e

PRIVKEY: U2FsdGVkX188+sb2Y7wAfpJbF4wsSlOoz15qAQ4lC1TV/isN3KKMQ7UJGMTg9CQJlxU81dnZT3L2kRbLMpAJJwr+kR3Dee/UP9G34GGWOCdDqjPHzVwO3i+Rqv1SGyVckpRS4noBnUySLd1Qk7fZjSKXGxK3uV8jED1Ok/OBK+6gIpECMdqKMDbK8cnozWJW8sdySVh/eq11RQRgFrMd9Q==
*/