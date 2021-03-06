import { expect } from '@jest/globals';
import Block, { DIFFICULTY } from '../../classes/Block';

describe('Block', () => {
    let timestamp, previousBlock, hash, data, nonce;

    beforeEach(() => {
        timestamp = new Date(2010, 0, 1);
        previousBlock = Block.genesis;
        data = 't3st-d4t4';
        hash = 'h4sh'
        nonce = 128;
    });

    it('Create an instante with parameters', () => {
        const block = new Block(timestamp, previousBlock.hash, hash, data, nonce);

        expect(block.timestamp).toEqual(timestamp);
        expect(block.previousHash).toEqual(previousBlock.hash);
        expect(block.hash).toEqual(hash);
        expect(block.data).toEqual(data);
        expect(block.nonce).toEqual(nonce);
    });

    it('Use static mine()', () => {
        const block = Block.mine(previousBlock, data);
        const { difficulty } = block;

        expect(block.hash.length).toEqual(64);
        expect(block.hash.substring(0, difficulty)).toEqual('0'.repeat(difficulty));
        expect(block.previousHash).toEqual(previousBlock.hash);
        expect(block.nonce).not.toEqual(0);
        expect(block.data).toEqual(data);
    });

    it('Use static hash()', () => {
        hash = Block.hash(timestamp, previousBlock.hash, data, nonce);

        expect(hash).toEqual('3c5e5dcb1237b3d34e6776ef68d916d245ec194136001ef4f2e9d6690307122b');
    });

    it('Use toString()', () => {
        const block = Block.mine(previousBlock, data);

        console.log(block.toString());

        expect(typeof block.toString()).toEqual('string');
    });
});