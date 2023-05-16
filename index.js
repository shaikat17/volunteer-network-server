const express = require('express');

const app = express()
const port = process.env.PORT || 3000

app.get("/", (req,res) => {
    res.send('Volunteer Network')
})

app.listen(port, (req, res) => {
    console.log(`server start on ${port}`)
})