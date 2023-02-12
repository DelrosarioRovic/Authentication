//jshint esversion:6
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const mongooseEcryption = require('mongoose-encryption');

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

mongoose.set('strictQuery', false);
mongoose.connect('mongodb://127.0.0.1:27017/userPracDB',{ useNewUrlParser: true});

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});
const secret = process.env.SECRET;

userSchema.plugin(mongooseEcryption, {secret: secret, encryptedFields: ['password'] });
const User = new mongoose.model("User", userSchema);


app.get("/", function(req, res) {
    res.render("home");
});

app.get("/login", function(req, res) {
    res.render("login");
});

app.get("/register", function(req, res) {
    res.render("register");
});

app.post("/register", function(req, res) {
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });

    newUser.save(function(err) {
        if (err) {
            console.log(err);
        } else {
            console.log("Successfully register");
            res.render("secrets");
        }
    })

});
app.post("/login", function(req, res) {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email:username}, function(err, foundUser) {
        if (err) {
            console.log(err);
        } else {
            if (foundUser.email === username && foundUser.password === password) {
                res.render("secrets");
            } else {
                res.render("login");
                
            }
        }
    })
})





app.listen(3000, function() {
    console.log("Server Started on port 3000.");
})
