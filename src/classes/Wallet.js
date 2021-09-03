import elliptic from '../modules/elliptic';
import Transaction from './Transaction';
import genHash from '../modules/genHash';

const INITIAL_BALANCE = 100;

class Wallet {
    constructor(blockchain, initialBalance = INITIAL_BALANCE) {
        this.balance = initialBalance;
        this.keyPair = elliptic.createKeyPair();
        this.publicKey = this.keyPair.getPublic().encode('hex');
        this.blockchain = blockchain;
    }

    toString() {
        const { balance, publicKey } = this;

        return `Wallet - 
        publicKey:  ${publicKey.toString()}
        balance:    ${balance}`;
    }

    sign(data) {
        return this.keyPair.sign(genHash(data));
    }

    createTransaction(recipientAddress, amount) {
        const { blockchain: { memoryPool } } = this;
        const balance = this.calculateBalance();

        if (amount > balance) throw Error(`Amount: ${amount} exceeds current balance: ${balance}`);

        let txn = memoryPool.find(this.publicKey)

        if (txn) {
            txn.update(this, recipientAddress, amount)
        } else {
            txn = Transaction.create(this, recipientAddress, amount);
            memoryPool.addOrUpdate(txn);
        }

        return txn;
    }

    calculateBalance() {
        const { blockchain: { blocks = [] }, publicKey } = this;
        let { balance } = this;
        const txns = [];

        blocks.forEach(({ data = [] }) => {
            if (Array.isArrray(data)) data.forEach((txn) => txns.push(txn));
        });

        const walletInputTxns = txns.filter(txn => txn.input.address === publicKey);
        let timestamp = 0;

        if (walletInputTxns.length > 0) {
            const recentInputTxn = walletInputTxns.sort((a, b) => a.input.timestamp - b.input.timestamp).pop();

            balance = recentInputTxn.outputs.find(({ address }) => address === publicKey).amount;
            timestamp = recentInputTxn.input.timestamp;
        }

        txns.filter(({ input }) => input.timestamp > timestamp).forEach(({ outputs }) => {
            outputs.find(({ address, amount }) => {
                if (address === publicKey) balance += amount;
            });
        });

        return balance;
    }
}

export { INITIAL_BALANCE };
export default Wallet;