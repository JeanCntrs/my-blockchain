import { expect } from '@jest/globals';
import MemoryPool from '../../classes/MemoryPool';
import Transaction from '../../classes/Transaction';
import Wallet from '../../classes/Wallet';

describe('MemoryPool', () => {
    let memoryPool, transaction, wallet;

    beforeEach(() => {
        memoryPool = new MemoryPool();
        wallet = new Wallet()
        transaction = Transaction.create(wallet, 'r4nd0m-4ddr355', 5);
        memoryPool.addOrUpdate(transaction);
    });

    it('Has one transaction', () => {
        expect(memoryPool.transactions.length).toBe(1);
    });

    it('Adds a transaction to the memoryPool', () => {
        const found = memoryPool.transactions.find(({ id }) => id === transaction.id);
        expect(found).toEqual(transaction);
    });

    it('Updates a transaction in the memoryPool', () => {
        const txnOld = JSON.stringify(transaction);
        const txnNew = transaction.update(wallet, '0th3r-4ddr355', 10);

        memoryPool.addOrUpdate(txnNew);

        expect(memoryPool.transactions.length).toEqual(1);

        const found = memoryPool.transactions.find(({ id }) => id === transaction.id);

        expect(JSON.stringify(found)).not.toEqual(txnOld);
        expect(txnNew).toEqual(found);
    });
});