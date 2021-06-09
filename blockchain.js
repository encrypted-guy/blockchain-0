const Block = require("./block");
const cryptoHash = require("./crypto-hash");


class Blockchain {
    constructor() {
        this.chain = [Block.genesis()]
    }

    addBlock({data}){
        const newBlock = Block.mineBlock({
            lastBlock: this.chain[this.chain.length - 1],
            data
        })
        this.chain.push(newBlock)
    }

    replaceChain(chain) {
        console.log(`chain: ${chain.length} | this.chain: ${this.chain.length}`)
        if(chain.length <= this.chain.length){
            console.error(`[+] \t INCOMMING CHAIN MUST BE LONGER!`)
            return
        }
        if(!Blockchain.isValidChain(chain)){
            console.error(`[+] \t INCOMMING CHAIN MUST BE VALID!`)
            return
        }
        this.chain = chain
    }

    static isValidChain(chain) {
        if(JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) return false
        
        for(let i = 1; i < chain.length; i++) {
            const {timestamp, lastHash, data, hash, nonce, difficulty} = chain[i]

            // hash of previous block
            // hash of the prvius bock must be equal to lasthash of current block
            const actualLashhash = chain[i -1].hash
            if(lastHash !== actualLashhash) return false

            // creating a new hash using the same data
            // hashs must be equal
            const validatedhash = cryptoHash(timestamp, lastHash, data, difficulty, nonce)
            if(hash !== validatedhash) return false
            
            // lastdif - currentdif cant be mroe then one 
            const lastDiffculty = chain[i-1].difficulty
            if(Math.abs(lastDiffculty - difficulty) > 1) return false
        
        }   
        return true
    }

}

// TEST 1 | after createing the addblock -----------------------1
// let hahaChain = new Blockchain()
// for(let i = 0; i < 5; i++) {
//     hahaChain.addBlock({data: `all new block ${i}`})
// }
// console.log(hahaChain)

// TEST 2 | after createing validate hash ------------------------1
// let hahaChain = new Blockchain()
// for(let i = 0; i < 5; i++) {
//     hahaChain.addBlock({data: `all new block ${i}`})
// }
// console.log(`is chain valid: ${Blockchain.isValidChain(hahaChain.chain)}`)
// hahaChain.chain[2].data = {amount: 100} // modifying block
// hahaChain.chain[2].lastHash = 'broken hash' // modifying block
// console.log(`is chain valid: ${Blockchain.isValidChain(hahaChain.chain)}`)
// console.table(hahaChain.chain)

// TEST 3 | after replacechain func ------------------------1
// let hahaChain = new Blockchain()
// for(let i = 0; i < 5; i++) {
//     hahaChain.addBlock({data: `all new block ${i}`})
// }
// hahaChain.replaceChain(hahaChain.chain)

module.exports = Blockchain