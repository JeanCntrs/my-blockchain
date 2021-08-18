import { expect } from '@jest/globals';
import Wallet, { INITIAL_BALANCE } from '../../classes/Wallet';

describe('Wallet', () => {
    let wallet;

    beforeEach(() => {
        wallet = new Wallet();
    });

    it('It is a healthy wallet', () => {
        expect(wallet.balance).toEqual(INITIAL_BALANCE);
        expect(typeof wallet.keyPair).toEqual('object');
        expect(typeof wallet.publicKey).toEqual('string');
        expect(wallet.publicKey.length).toEqual(130);
    });
});