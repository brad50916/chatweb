const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 5001
const routes = require('./routers')
const cors = require('cors')

app.use(cors({
    origin: 'http://localhost:3000',
}));

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.use('/', routes)

app.listen(port, () => {
    console.log(`App running on port ${port}.`)
})