const express = require('express');
const contactsRouter = require('./routers/contacts');

const app = express()

app.use(express.json())

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Authorization");
    next();
});
app.use(contactsRouter)

module.exports = app