const express = require('express')
const request = require('request')
const Blockchain = require('./blockchain')
const PubSub = require('./pubsub')

const app = express()
app.use(express.json())

const blockchain = new Blockchain()
const pubsub = new PubSub({blockchain})


const DEFAULT_PORT = 3000
const ROOT_NODE_ADDRESS = `http://127.0.0.1:${DEFAULT_PORT}`
// setTimeout(() => pubsub.broadcastChain(), 1000)

app.get('/api/blocks', (req, res) => {
    res.json(blockchain.chain)
})

app.post('/api/mine', (req, res) => {
    const {data} = req.body
    blockchain.addBlock(data)
    pubsub.broadcastChain()
    res.redirect('/api/blocks')
})


const syncChain = () => {
    request({url: `${ROOT_NODE_ADDRESS}/api/blocks`}, (error, res, body) => {
        if(!error && res.statusCode === 200){
            const root_chain = JSON.parse(body)
            console.log('replace chain on syncchain \n ', root_chain)
            blockchain.replaceChain(root_chain)
        }
    })
}

let PEER_PORT
if(process.env.GENERATE_PEER_PORT === 'true'){
    PEER_PORT = DEFAULT_PORT + Math.ceil(Math.random() * 1000)
}

const PORT = PEER_PORT || DEFAULT_PORT
app.listen(PORT, () => {
    console.log(`SERVER RUNNING ON PORT:${PORT}`)
    
    if(PORT !== DEFAULT_PORT){
        syncChain()
    }
})