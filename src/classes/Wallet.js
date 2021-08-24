import elliptic from '../modules/elliptic';
import Transaction from './Transaction';
import genHash from '../modules/genHash';

const INITIAL_BALANCE = 100;

class Wallet {
    constructor(blockchain) {
        this.balance = INITIAL_BALANCE;
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
        const { balance, blockchain: { memoryPool } } = this;

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
}

export { INITIAL_BALANCE };
export default Wallet;