const Blockchain = require("./blockchain");

const blockchain  = new Blockchain()
blockchain.addBlock({data: 'init'})


let prevTimeStamp, nextTimeStamp, nextBlock, timeDiff, average
const times = []

for(let i = 0; i < 1000; i++) {
    prevTimeStamp = blockchain.chain[blockchain.chain.length -1].timestamp

    blockchain.addBlock({data: `Block ${i}`})

    nextBlock = blockchain.chain[blockchain.chain.length -1]
    nextTimeStamp = nextBlock.timestamp
    timeDiff = nextTimeStamp - prevTimeStamp

    times.push(timeDiff)
    // console.log(`PRV: ${prevTimeStamp} | NXT: ${nextTimeStamp} | DIFF: ${timeDiff}`)

    // average = times.reduce((total, num) => console.log(total, num))
    average = times.reduce((total, num) => (total + num)) /times.length
    
    console.clear()
    console.table(blockchain.chain)
    console.log(`time to mine block: ${timeDiff}ms \t| Diffculty: ${nextBlock.difficulty} \t| Average Time: ${average}ms`)

}


