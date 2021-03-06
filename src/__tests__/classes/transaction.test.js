import { expect } from '@jest/globals';
import Transaction, { REWARD } from '../../classes/Transaction';
import Wallet from '../../classes/Wallet';

const blockchainWallet = new Wallet();

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

    it('Validates a valid transaction', () => {
        expect(Transaction.verify(transaction)).toBe(true);
    });

    it('Invalidates a corrupt transaction', () => {
        transaction.outputs[0].amount = 500;
        expect(Transaction.verify(transaction)).toBe(false);
    });

    describe('And updating a transaction', () => {
        let nextAmount, nextRecipient;

        beforeEach(() => {
            nextAmount = 3,
                nextRecipient = 'n3xt 4ddr355';
            transaction = transaction.update(wallet, nextRecipient, nextAmount);
        });

        it('Substracts the next amount from the senders wallet', () => {
            const output = transaction.outputs.find(({ address }) => address === wallet.publicKey);
            expect(output.amount).toEqual(wallet.balance - amount - nextAmount);
        });

        it('Outputs an amount for the next recipient', () => {
            const output = transaction.outputs.find(({ address }) => address === nextRecipient);
            expect(output.amount).toEqual(nextAmount);
        });
    });

    describe('Creating a reward transaction', () => {
        beforeEach(() => {
            transaction = Transaction.reward(wallet, blockchainWallet);
        });

        it('Reward the miners wallet', () => {
            expect(transaction.outputs.length).toEqual(2);

            let output = transaction.outputs.find(({ address }) => address === wallet.publicKey);
            expect(output.amount).toEqual(REWARD);

            output = transaction.outputs.find(({ address }) => address === blockchainWallet.publicKey);
            expect(output.amount).toEqual(blockchainWallet.balance - REWARD);
        });
    });
});