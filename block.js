const hexToBinary = require('hex-to-binary')
const {GENESIS_DATA, MINE_RATE} = require('./config')
const cryptoHash = require('./crypto-hash')

class Block {
    constructor({timestamp, lastHash, hash, data, nonce, difficulty}){
        this.timestamp = timestamp
        this.lastHash = lastHash
        this.hash = hash
        this.nonce = nonce
        this.difficulty = difficulty
        this.data = data
    }

    static genesis(){
        return new this(GENESIS_DATA)
    }

    // TO ADD BLOCK| REATING THE BLOCK USING THE LASTHASH OF LASTBLOCK, AND NEWLY ADDED DATA
    static mineBlock({lastBlock, data}){
        let timestamp, hash
        const lastHash = lastBlock.hash
        let {difficulty} = lastBlock
        let nonce = 0

        do{
            nonce++
            timestamp = Date.now()
            difficulty = Block.adjuestDifficulty({originalBlock: lastBlock, timestamp})
            hash = cryptoHash(timestamp, lastHash, data, difficulty, nonce)
        }while(hexToBinary(hash).substring(0, difficulty) !== '0'.repeat(difficulty))

        return new this({
            timestamp,
            lastHash,
            data,
            hash,
            difficulty,
            nonce
        })
    }

    static adjuestDifficulty({originalBlock, timestamp}) {
        const {difficulty} = originalBlock

        if(difficulty < 1) return 1

        const difference = timestamp - originalBlock.timestamp
        if(difference > MINE_RATE) return difficulty - 1 

        return difficulty + 1
    }

}

// TEST 1 | FOR THE new BLOCK const func -----------------------1
// const block1 = new Block({
//     timestamp: Date.now(),
//     lastHash: 'anythingfornow',
//     hash: 'anythingfornow',
//     data: "newdatacanbeanything"
// })
// console.log(block1)
// TEST 2 | GENINUS BLOCK ADDED ------------------------------1
// console.log(Block.genesis())
// TEST 3 | MINE BLOCK FUNCTION ADDED WITH CRYPTO HASH ------------------------1
// console.log(Block.mineBlock({lastBlock: Block.genesis(), data: 'newdata'}))


module.exports = Block