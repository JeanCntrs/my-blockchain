import Transaction from './Transaction';

class MemoryPool {
    constructor() {
        this.transactions = [];
    }

    addOrUpdate(transaction) {
        const { input, outputs = [] } = transaction;

        const outputTotal = outputs.reduce((total, output) => total + output.amount, 0);
        if (input.amount !== outputTotal) throw Error(`Imvalid transaction from ${input.address}`);
        if (!Transaction.verify(transaction)) throw Error(`Imvalid signature from ${input.address}`);

        const txnIndex = this.transactions.findIndex(({ id }) => id === transaction.id);

        if (txnIndex >= 0) this.transactions[txnIndex] = transaction;
        else this.transactions.push(transaction);
    }

    find(address) {
        return this.transactions.find(({ input }) => input.address === address);
    }

    wipe() {
        this.transactions = [];
    }
}

export default MemoryPool;