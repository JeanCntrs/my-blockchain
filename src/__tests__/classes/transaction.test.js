import { expect } from '@jest/globals';
import { it } from 'jest-circus';
import Transaction from '../../classes/Transaction';
import Wallet from '../../classes/Wallet';

describe('Transaction', () => {
    let wallet, transaction, amount, recipientAddress;

    beforeEach(() => {
        wallet = new Wallet();
        recipientAddress = 'r3c1p13nt';
        amount = 5;
        transaction = Transaction.create(wallet, recipientAddress, amount);
    });

    it('Outputs the amount subtracted from wallet balance', () => {
        const output = transaction.outputs.find(({ address }) => address = recipientAddress);

        expect(output.amount).toEqual(wallet.balance - amount);
    });
});