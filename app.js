// mongod.exe --dbpath D:\data\db

const express = require('express')
const mongoose = require('mongoose')
const {User} = require('./models/users')
const bodyparser = require('body-parser')
var lodash = require('lodash')
const express_handlebars = require('express-handlebars')
const request = require('request')


var app = express()

mongoose.Promise = global.Promise


app.engine('handlebars', express_handlebars({
    defaultLayout: 'app'
}));
app.set('view engine', 'handlebars')

app.use(bodyparser.json())
app.use(bodyparser.urlencoded({ extended: true }))


mongoose.connect('mongodb+srv://sagar:sagar123@cluster0-maeki.mongodb.net/test', (err) => {
    if(err){
        console.log('Error connecting to database')
    }
    else{
        console.log('Connected to database')
    }
})

app.get('/', (req, res) => {
    res.render('index')
})

app.get('/resetpass', (req, res) => {
    res.render('resetpass')
})

app.get('/login', (req, res) => {
    res.render('login')
})

app.get('/register', (req, res) => {
    res.render('register')
})

app.post('/register', (req, res) => {

    var data = new User(req.body);
    data.save().then(() => {
        console.log('sdfsdf')
        res.render('login')
    }).catch((e) => {
        res.status(400).send(e)
    })
})

app.post('/login', (req,res) => {

    var data = lodash.pick(req.body, ['email', 'password'])
    User.findByinput(data.email, data.password).then((user) => {
        res.send('You are logged in')
    }).catch((e) => {
        res.send('Invalid Username or password')
    })

})
app.post('/resetpass', (req,res) => {
    var data = lodash.pick(req.body, ['email']);
    var a=User.OTP(data.email);
    if(a==1){
        res.render('verification');
    }else {
        res.send('Sorry unable to send OTP');
    }
});
// app.postst('/resetpass', (req,res) => {
//     var data = lodash.pick(req.body, ['email'])
//     User.OTP(data.email).then((user) => {
//         res.render('verification')
//     }).catch((e) => {
//         res.send('unable to send OTP')
//     })
// })

app.get('/verification', (req, res) => {
    res.render('verification')
})

app.post('/verification', (req, res) => {
    var data = lodash.pick(req.body, ['otp'])
    if(User.verify(data.otp)){
        res.render('ChangePassword')
    }
    else{
        res.status(404).send('Error')
    }
})
const port=process.env.PORT || 3000;

app.listen(port, () => {
    console.log('server is up and running at port 4000')
})





 
