import { expect } from '@jest/globals';
import Wallet, { INITIAL_BALANCE } from '../../classes/Wallet';
import Blockchain from '../../classes/Blockchain';

describe('Wallet', () => {
    let blockchain
    let wallet;

    beforeEach(() => {
        blockchain = new Blockchain();
        wallet = new Wallet(blockchain);
    });

    it('It is a healthy wallet', () => {
        expect(wallet.balance).toEqual(INITIAL_BALANCE);
        expect(typeof wallet.keyPair).toEqual('object');
        expect(typeof wallet.publicKey).toEqual('string');
        expect(wallet.publicKey.length).toEqual(130);
    });

    it('Use sign()', () => {
        const signature = wallet.sign('h3ll0');

        expect(typeof signature).toEqual('object');
        expect(signature).toEqual(wallet.sign('h3ll0'));
    });

    describe('Creating a transaction', () => {
        let txn, recipientAddress, amount;

        beforeEach(() => {
            recipientAddress = 'r4nd0m-4ddr355';
            amount = 5;
            txn = wallet.createTransaction(recipientAddress, amount);
        });

        describe('And doing the same transaction', () => {
            beforeEach(() => {
                txn = wallet.createTransaction(recipientAddress, amount);
            });

            it('Double the amount substracted from the wallet balance', () => {
                const output = txn.outputs.find(({ address }) => address === wallet.publicKey);
                expect(output.amount).toEqual(wallet.balance - (amount * 2));
            });

            it('Clones the amount output for the recipient', () => {
                const amounts = txn.outputs.filter(({ address }) => address === recipientAddress).map(output => output.amount);
                expect(amounts).toEqual([amount, amount]);
            });
        });
    });

    describe('Calculating the current balance', () => {
        let addBalance, times, senderWallet;

        beforeEach(() => {
            addBalance = 16;
            times = 3;
            senderWallet = new Wallet(blockchain);

            for (let i = 0; i < times; i++) {
                senderWallet.createTransaction(wallet.publicKey, addBalance);
            }

            blockchain.addBlock(blockchain.memoryPool.transactions);
        });

        it('Calculates the balance for blockchain txns matching the recipient', () => {
            expect(wallet.currentBalance).toEqual(INITIAL_BALANCE + (addBalance * times));
        });

        it('Calculates the balance for blockchain txns matching the sender', () => {
            expect(senderWallet.currentBalance).toEqual(INITIAL_BALANCE - (addBalance * times));
        });

        describe('And the recipient conducts a transaction', () => {
            let subtractBalance, recipientBalance;

            beforeEach(() => {
                blockchain.memoryPool.wipe();
                subtractBalance = 64;
                recipientBalance = wallet.currentBalance;

                wallet.createTransaction(senderWallet.publicKey, addBalance);

                blockchain.addBlock(blockchain.memoryPool.transactions);
            });

            describe('And the sender sends another transaction to the recipient', () => {
                beforeEach(() => {
                    blockchain.memoryPool.wipe();
                    senderWallet.createTransaction(wallet.publicKey, addBalance);
                    blockchain.addBlock(blockchain.memoryPool.transactions);
                });

                it('Calculate the recipient balance only using txns since its most recent one', () => {
                    expect(wallet.currentBalance).toEqual(recipientBalance - subtractBalance + addBalance);
                });
            });
        });
    });
});