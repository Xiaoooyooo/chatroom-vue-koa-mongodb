const WS = require('ws')

const { mongoInsert, mongoFind } = require('./db')

const server = new WS.Server({
  port: 7777
})

server.on("open", function () {
  console.log("Connection Established")
})

server.on("close", function () {
  console.log("Disconnected")
})

server.on("connection", function (ws, req) {
  let ip = req.connection.remoteAddress
  // let port = req.connection.remotePort
  ws.on("message", function (msg) {
    // console.log(`Received Message From ${ip}:${port} ===> ${msg}`)
    let data = JSON.parse(msg)
    data.key = Date.now()
    mongoInsert(data, (err) => {
      if(err)
        ws.send('Error')
      else{
        server.clients.forEach(client => {
          if (client.readyState === WS.OPEN)
            client.send(JSON.stringify(data))
        })
      }
    })
  })
})

module.exports = server