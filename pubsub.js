const redis = require('redis')


const CHENNALS = {
    TEST: 'TEST',
    BLOCKCHAIN: 'BLOCKCHAIN'
}

class PubSub {
    constructor({blockchain}){
        this.blockchain = blockchain
        this.publisher = redis.createClient()
        this.subscriber = redis.createClient()
        
        //2
        this.subscribeTochennals()
        
        this.subscriber.on('message', (chennal, message) => this.handleMessage(chennal, message))

    }

    //1
    handleMessage(chennal, message) {
        console.log(`messaged resv. channel: ${chennal}. Message: ${message}`)
        //5
        const ParsedMessage = JSON.parse(message)
        if(chennal === CHENNALS.BLOCKCHAIN){
            this.blockchain.replaceChain(ParsedMessage)
        }

    }

    // subscribing to all the chennals
    //2
    subscribeTochennals() {
        Object.values(CHENNALS).forEach(chennal => {
            this.subscriber.subscribe(chennal)
        })
    }
    //3
    publish({chennal, message}) {
        //5
        this.subscriber.unsubscribe(chennal, () => {
            this.publisher.publish(chennal, message, () => {
                this.subscriber.subscribe(chennal)
            })
        })

        // this.publisher.publish(chennal, message)
    }
    //4
    broadcastChain() {
        this.publish({
            chennal: CHENNALS.BLOCKCHAIN,
            message: JSON.stringify(this.blockchain.chain)
        })
    }

}
module.exports = PubSub