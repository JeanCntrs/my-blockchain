import { expect } from '@jest/globals';
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
        const output = transaction.outputs.find(({ address }) => address === wallet.publicKey);

        expect(output.amount).toEqual(wallet.balance - amount);
    });

    it('Outputs the amount added to the recipient', () => {
        const output = transaction.outputs.find(({ address }) => address === recipientAddress);

        expect(output.amount).toEqual(amount);
    });

    describe('Transacting with an amount that exceeds the balance', () => {
        beforeEach(() => {
            amount = 500
            transaction = undefined;
        });

        it('Does not create the transaction', () => {
            expect(() => {
                transaction = Transaction.create(wallet, recipientAddress, amount);
            }).toThrowError(`Amount: ${amount} exceeds balance`);
        });
    });

    it('Inputs the balance of the wallet', () => {
        expect(transaction.input.amount).toEqual(wallet.balance);
    });

    it('Inputs the sender address of the wallet', () => {
        expect(transaction.input.address).toEqual(wallet.publicKey);
    });

    it('Inputs has a signature using the wallet', () => {
        expect(typeof transaction.input.signature).toEqual('object');
        expect(transaction.input.signature).toEqual(wallet.sign(transaction.outputs));
    });
});