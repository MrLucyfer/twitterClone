const express = require('express');
const cors = require('cors');
const monk = require('monk');
const rateLimit = require('express-rate-limit');
const Filter = require('bad-words');

const db = monk('localhost/twitter');
const app = express();

const tweets = db.get('tweets');

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
    return tweet.name && tweet.name.toString().trim() != '' 
    && tweet.tweet && tweet.tweet.toString().trim() != ''
}

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