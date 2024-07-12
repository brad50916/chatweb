const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 5001
const routes = require('./routers')
const cors = require('cors')
const Server = require("socket.io");
const http = require('http');
const server = http.createServer(app);
const io = Server(server, {
  cors: {
    origin: 'http://localhost:3000', // Replace with your client's domain
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('sendMessage', (message) => {
    switch (message.type) {
      case "textMessage":
        const { userId, currentChatId, text } = message;
        // Handle the chat message
        console.log(`User ${userId} sent message to chat ${currentChatId}: ${text}`);
        break;

      default:
        console.log("Unknown message type received");
        break;
    }
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

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

server.listen(port, () => {
  console.log(`App running on port ${port}.`)
})