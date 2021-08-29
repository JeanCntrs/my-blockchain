class Miner {
    constructor(blockchain, p2pservice, wallet) {
        this.blockchain = blockchain;
        this.p2pservice = p2pservice;
        this.wallet = wallet;
    }

    mine() {
        const { blockchain: { memoryPool } } = this;
    }
}

export default Miner;