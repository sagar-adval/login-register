const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer')

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
                console.log('dasda')
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

// const value = Math.floor(100 + Math.random() * 900)


var val = Math.floor(1000 + Math.random() * 9000);

UserSchema.statics.OTP = function(email){
    var user=this;
    user.findOne({email}).then((user)=>{
        async function main(){
            let transporter = nodemailer.createTransport({
                service: "Gmail",
                auth: {
                    user: "Zubeengarg555@gmail.com",
                    pass: "Zubeen@123"
                }
            });
            let mailOptions = {
                from: 'Zubeen Garg',
                to: email,
                subject: "PASSWOD UPDATION",
                text: JSON.stringify(val)
            };
            let info = await transporter.sendMail(mailOptions)
        }
        main().catch(console.error);
        return 0
    });
    return 1;
};

UserSchema.statics.verify = function(otp){
    if(val == otp){
        return true
    }
    else{
        return false
    }
}
const User = mongoose.model('User', UserSchema)

module.exports = {User}
