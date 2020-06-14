const express = require('express');
const mongoose = require('mongoose');
const user = require('./routes/user')
const cors = require('cors')

const app = express();




app.use(express.json());
app.use(cors())
app.use(express.urlencoded({ extended: true }))

const db = process.env.MongoURI;

mongoose.connect(db, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true })
    .then(() => console.log('logged in mongo'))
    .catch(err => console.log(err))

app.use('/user', user)
const port = process.env.PORT || 5000;
app.listen(port, () => { console.log(`Server listening at port ${port}`) })
