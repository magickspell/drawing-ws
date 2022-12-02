const express   = require('express')
const app = express()
const WsServer = require('express-ws')(app)
const aWss = WsServer.getWss()
const cors = require('cors')
const PORT = process.env.PORT || 3001
const fs = require('fs')
const path = require('path')

app.use(cors())
app.use(express.json())

app.ws('/', (ws, req) => {
    console.log('ws connected')
    ws.send('you are connected to ws')
    ws.on('message', (msg) => {
        msg = JSON.parse(msg)
        console.log(msg)
        switch (msg.method) {
            case "connection":
                connectionHandler(ws, msg)
                break
            case "draw":
                broadcastConnection(ws, msg)
                break
        }
    })
})

app.get('/image', (req,res) => {
    try {
        const file = fs.readFileSync(path.resolve(__dirname, 'files', `${req.query.id}.jpg`))
        const data = 'data:image/png;base64,' + file.toString('base64')
        res.json(data)
    }
    catch (e) {
        console.log(e)
        res.status(500).json('get error')
    }
})

app.post('/image', (req,res) => { // save img to server
    try {
        const data = req.body.img.replace('data:image/png;base64,', '')
        fs.writeFileSync(path.resolve(__dirname, 'files', `${req.query.id}.jpg`), data, 'base64')
        return res.status(200).json({message: 'uploaded'})
    }
    catch (e) {
        console.log(e)
        res.status(500).json('post error')
    }
})

app.listen(PORT, () => console.log('app started on port: ' + PORT))

// handlers
function connectionHandler(ws, msg) {
    ws.id = msg.id
    broadcastConnection(ws, msg)
}

function broadcastConnection(ws, msg) { // broadcast canvas image to all clients
    aWss.clients.forEach(client => {
        if (client.id === msg.id) {
            //client.send('user cast something:' + msg.username)
            client.send(JSON.stringify(msg))
        }
    })
}