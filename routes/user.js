const express = require('express')
const router = express.Router();
const bcrypt = require('bcryptjs')
const User = require('../model/users')
const jwt = require('jsonwebtoken')
const JWTsecret = process.env.JWTsecret;
const auth = require('../middleware/auth')
const nodemailer = require('nodemailer')
require('dotenv').config();




router.post('/signup', async (req, res) => {
    console.log('New user signup request')
    try {
        const { name, email, username, password } = req.body;
        if (!email || !username || !password || !name)
            return res
                .status(200)
                .json({ msg: "Please enter all the fields" });
        if (password.length < 5)
            return res
                .status(200)
                .json({ msg: 'Password needs to be at least 5 letters' });
        const existingmail = await User.findOne({ email: email })
        const existingusername = await User.findOne({ username: username })
        if (existingmail)

            return res
                .status(200)
                .json({ msg: 'A user with the email  exists' });

        if (existingusername)
            return res
                .status(200)
                .json({ msg: 'Sorry! This username is taken' });
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        const newuser = new User({
            name,
            email,
            username,
            password: passwordHash
        })
        const saveduser = await newuser.save();
        res.json(saveduser)

    }

    catch (err) {
        res.status(200).json({ msg: err.message })
    }

})
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('recieved a login request')
        if (!email || !password)
            return res
                .status(200)
                .json({ msg: 'Please Enter both the fields' })
        const checkuser = await User.findOne({ email: email });
        if (!checkuser)
            return res
                .status(200)
                .json({ msg: 'User with the Email does not exist' });
        const check = await bcrypt.compare(password, checkuser.password)
        if (!check)
            return res.status(200)
                .json({ msg: 'Wrong  password' });
        const token = jwt.sign({ id: checkuser._id }, JWTsecret);

        res.json({
            token: token,
            user: {
                id: checkuser._id,
                username: checkuser.username,
            }
        })
    }
    catch (err) {
        res.status(200).json({ msg: err.message })
    }

})
router.delete('/delete', auth, async (req, res) => {
    try {
        const deleteuser = await User.findByIdAndDelete(req.user)
        res.json(deleteuser)
    }
    catch (err) {
        res.status(500).json({ error: err.message })
    }
})
router.post('/tokenisvalid', async (req, res) => {
    console.log(req.header('x-auth-token'));

    try {
        const token = req.header('x-auth-token');
        if (!token) return res.json(false);

        const verified = jwt.verify(token, JWTsecret);
        if (!verified) return res.json(false);

        const user = await User.findById(verified.id);
        if (!user) return res.json(false);

        return res.json(true);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
})
router.get('/home', auth, async (req, res) => {
    const user = await User.findById(req.user);
    res.json({
        id: user._id,
        username: user.username
    })
})
router.post('/account/reset', async (req, res) => {
    const email = req.body.email
    if (!email) return res
        .status(200)
        .json({ msg: 'Please Enter the Email.' })


    const user = await User.findOne({ email: email })

    if (user === null) return res.status(200).json({ msg: 'No user with the Email , Signup instead' })

    const token = jwt.sign({ id: user._id }, JWTsecret);

    User.updateOne({ _id: user._id },
        {
            $set:
            {
                resetPasswordToken: token,
                resetPasswordExpires: Date.now() + 3600000
            }
        }, { upsert: true }).then(res => { console.log(res) }).catch(err => console.log(err.message)
        );



    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: `${process.env.EMAIL_ADRESS}`,
            pass: `${process.env.EMAIL_PASSWORD}`
        }
    });

    const mailOptions = {
        from: 'feedbackgroupit@gmail.com',
        to: `${user.email}`,
        subject: 'Link To Reset Password',
        text: 'You are receiving this because you(or someone else) have requested the reset of the password for your account.\n\n'
            + 'Please click on the following link ,or paste this into your browser to complete the process within one hour of receiving it:\n\n'
            + `http://localhost:3000/password/reset/${token}\n\n`
            + 'If you did not request this,please ignore this email and your password will remain unchanged.\n',
    };
    const status = await transporter.sendMail(mailOptions)
    console.log(status);

    if (!status) res.status(200).json({ msg: 'There was some error sending the mail try later' })


    res.status(200).json({ sent: 'The reset password link has been sent to your email' })





})
router.post('/passwordreset', auth, async (req, res) => {
    const { newpassword, passwordRetype } = req.body;
    let error = false;
    let status = false
    if (newpassword != passwordRetype)
        return res.status(200).json({ msg: 'Both passwords don\'t match' })
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(newpassword, salt);
    await User.updateOne({ _id: req.user },
        {
            $set:
            {
                password: passwordHash
            }
        }, { upsert: true }).then(res => {
            console.log(res);
            status = true
        }).catch(err => error = true
        );
    if (status) return res.status(200).json({ sent: 'Your Password was successfuly updated' })
    if (error) return res.status(200).json({ msg: 'There was some error resetting your password' })
})
module.exports = router;