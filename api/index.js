const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 5001
const routes = require('./routers')
const cors = require('cors')

app.use(bodyParser.json())
app.use(cors())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.use('/', routes)

app.listen(port, () => {
console.log(`App running on port ${port}.`)
})