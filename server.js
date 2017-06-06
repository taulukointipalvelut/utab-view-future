var express = require('express')
var app = express()

app.use(express.static('./build'))

app.get('/', function (req, res) {
  res.send('Hello Vue')
})

app.listen(8080)
