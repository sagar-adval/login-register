const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

var UserSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
    },

    last_name: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
    },

    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email'
        }

    },
    password: {
        type: String,
        required: true,
        minlength: 6
    }
})

UserSchema.pre('save', function (next) {
    var user = this;
    if (user.isModified('password')) {
        bcrypt.genSalt(20, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash
                next()
            })
        })
    } else {
        next()
    }
})

UserSchema.statics.findByinput = function (email, password) {
    var user = this;
    return user.findOne({ email }).then((user) => {
        if (!user) {
            return Promise.reject()
        }

        return new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, (err, res) => {
                if (res) {
                    resolve(user)
                } else {
                    reject()
                }
            })
        })
    })
}

const value = Math.floor(100 + Math.random() * 900)

UserSchema.statics.OTP = function (email) {
    var user = this
    return user.findOne({ email }).then((user) => {
        if (!user) {
            return Promise.reject()
        }

        return new Promise((resolve, reject) => {
            const sendgrid_apikey = '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'
            const sgmail = require('@sendgrid/mail')

            sgmail.setApiKey(sendgrid_apikey)

            sgmail.send({
                to: email,
                from: 'Zubeengarg555@gmail.com',
                 text: `your otp is ${value}`
            }).done()
        })
    })
}

UserSchema.statics.verify = function(otp){
    if(value == otp){
        return true
    }
    else{
        return false
    }
}
const User = mongoose.model('User', UserSchema)

module.exports = {User}