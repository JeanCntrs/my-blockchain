import { expect } from '@jest/globals';
import Block, { DIFFICULTY } from '../classes/Block';

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

        expect(block.hash.length).toEqual(64);
        expect(block.hash.substring(0, DIFFICULTY)).toEqual('0'.repeat(DIFFICULTY));
        expect(block.previousHash).toEqual(previousBlock.hash);
        expect(block.nonce).not.toEqual(0);
        expect(block.data).toEqual(data);
    });

    it('Use static hash()', () => {
        hash = Block.hash(timestamp, previousBlock.hash, data, nonce);

        expect(hash).toEqual('35c94e7258ef379c55f3d96c4b74306faefced3301e0cb5d76fc65a9701caeaf');
    });

    it('Use toString()', () => {
        const block = Block.mine(previousBlock, data);

        console.log(block.toString());

        expect(typeof block.toString()).toEqual('string');
    });
});