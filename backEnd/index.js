const express = require('express');
const cors = require('cors');
const monk = require('monk');
const rateLimit = require('express-rate-limit');
const Filter = require('bad-words');

const db = monk('localhost/twitter');
const app = express();

const tweets = db.get('tweets');
const users = db.get('users');

const limiter = rateLimit({
    windowMS: 30*1000,
    max: 3
})

const filter = new Filter();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        message: "Hello!"
    })
})

function isValid(tweet) {
    return tweet.name && tweet.name.toString().trim() != '' && tweet.name.trim().length <= 30
    && tweet.tweet && tweet.tweet.toString().trim() != '' && tweet.tweet.trim().length <= 140
}

function userExist(user) {
   return users
        .findOne({name: user.toString()}, 'name')
        .then(result => {
            if(result != null) {
                return true;
            } else {
                return false;
            }
        })
}


app.post('/signup', (req, res) => {
    let newUser = {
        name: req.body.username,
        password: req.body.password
    }

    userExist(newUser.name)
        .then(exists => {
            if(!exists) {
                users
                    .insert(newUser)
                    .then(info => {
                        res.json({
                            status: true,
                            message: 'Username created',
                            info  
                        })
                    })
            } else {
                res.json({
                    status: false,
                    message: 'This username is already taken'
                })
            }
    })
});


function findUser(user, pass) {
    return users
               .findOne({name:user, password: pass}, { fields: { name: 1, password: 1 } })
               .then(result => {
                   if(result != null) {
                    return true;
                   } else {
                       return false;
                   }
               })
}

app.post('/login', (req, res) => {
    let userLogin = {
        name: req.body.name.toString(),
        password: req.body.password.toString()
    }

    findUser(userLogin.name, userLogin.password)
        .then(result => {
            console.log(result)
            if(result) {
                res.json({
                    status: true,
                    message: 'You are logged in'
                })
            } else {
                res.json({
                    status: false,
                    message: 'Username or password invalid'
                })
            }
        })

})


app.get('/tweets', (req, res) => {
    tweets
      .find()
      .then(tweets => res.json(tweets))
})

app.use(limiter);

app.post('/tweets', (req,res) => {
    if(isValid(req.body)){
        const tweet = {
            name: filter.clean(req.body.name.toString()),
            tweet: filter.clean(req.body.tweet.toString()),
        }
        tweets 
            .insert(tweet)
            .then(receivedTweet => {
                res.json(receivedTweet);
                console.log('Received');
            })
    } else {
        console.error('Hey! You must enter a name and a tweet!');
    }
})



app.listen(5000, () => console.log('Server running on port 5000'));