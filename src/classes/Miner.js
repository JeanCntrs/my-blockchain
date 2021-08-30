import Transaction from "./Transaction";
import Wallet from "./Wallet";

const blockchainWallet = new Wallet();

class Miner {
    constructor(blockchain, p2pservice, wallet) {
        this.blockchain = blockchain;
        this.p2pservice = p2pservice;
        this.wallet = wallet;
    }

    mine() {
        const { blockchain: { memoryPool }, p2pservice, wallet } = this;

        if (memoryPool.transactions.length === 0) throw Error('There are no unconfirmed transactions');

        memoryPool.transactions.push(Transaction.reward(this.wallet, blockchainWallet));

        const block = this.blockchain.addBlock(memoryPool.transactions);

        p2pservice.sync();
        memoryPool.wipe();

        return block
    }
}

export default Miner;