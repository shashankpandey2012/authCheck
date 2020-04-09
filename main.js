const express = require('express')
const app = express()
const path = require('path')
var mongoose = require('mongoose')
var Promise = require('bluebird')
mongoose
  .connect('mongodb://127.0.0.1:27017/userdb', {
    promiseLibrary: Promise,
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(connection => {})
  .catch(e => {
    console.log('e')
  })

const User = require('./models/user');
const port = 4000;

var bodyParser = require('body-parser')

// parse application/json
app.use(bodyParser.json({ limit: '250mb' }))

app.post('/userlogin', async (req, res) => {
  console.log('req', req.body);
  const body = req.body;
  const userDoc = await User.findOne({ userid: body.userid });
  console.log('userDoc');
  if (userDoc) {
    if (!userDoc.last_failed_attempt && userDoc.login_attempts === 0) {
      // First Attempt || Attempt after 2 Minutes
      if (body.password === userDoc.password) {
        // Login Success
        // userDoc.login_attempts = 1;
        res.send('RIGHT');
      } else {
          userDoc.last_failed_attempt = new Date();
          userDoc.login_attempts = 1;
          userDoc.save();
          res.send('WRONG');
      }
    } else {
      console.log('last Failed Time ', new Date(userDoc.last_failed_attempt), userDoc.login_attempts);
      console.log(new Date().getTime() - new Date(userDoc.last_failed_attempt).getTime() > 2 * 60 * 1000);
      if (new Date().getTime() - new Date(userDoc.last_failed_attempt).getTime() > 2 * 60 * 1000) {
        if (body.password === userDoc.password) {
          // Login Success
          userDoc.last_failed_attempt = null;
          userDoc.login_attempts = 0;
          res.send('RIGHT');
        } else {
          userDoc.last_failed_attempt = new Date();
          userDoc.login_attempts = 1;
          userDoc.save();
          res.send('WRONG');
        }
      } else {
        if (userDoc.login_attempts >= 3) {
          res.send('BLOCKED : LOGIN AFTER 2 MINUTES');
        } else {
          if (body.password === userDoc.password) {
            // Login Success
            res.send('RIGHT');
          } else {
            userDoc.last_failed_attempt = new Date();
            userDoc.login_attempts = userDoc.login_attempts + 1;
            userDoc.save();
            if (userDoc.login_attempts >= 3) {
              res.send('BLOCKED : LOGIN AFTER 2 MINUTES');
            } else {
              res.send('WRONG');
            }

          }
        }
      }
    }
  } else {
    res.send('USER DOES NOT EXISTS');
  }
});

app.post('/createuser', async (req, res) => {
  try {
    const body = req.body;
    const userDoc = new User(body)
    const newReport = await userDoc.save();
    res.json(newReport);
  } catch(e) {
    console.log('e',e.code)
    if (e.code === 11000) {
      res.send('Duplicate Record');
    } else {
      res.send('Error Occured');
    }
  }
});

app.get('/usercount', async (req, res) => {
  const count = await User.find({}).lean();
  console.log('Count><<<<<<', count);
  res.json({count: count.length});
});


app.listen(port, () => console.log(`Example app listening on port ${port}!`))
