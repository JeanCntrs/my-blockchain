import { expect } from '@jest/globals';
import Block from './Block';

describe('Block', () => {
    let timestamp, previousBlock, hash, data;

    beforeEach(() => {
        timestamp = new Date(2010, 0, 1);
        previousBlock = Block.genesis;
        data = 't3st-d4t4';
        hash = 'h4sh'
    });

    it('Create an instante with parameters', () => {
        const block = new Block(timestamp, previousBlock.hash, hash, data);

        expect(block.timestamp).toEqual(timestamp);
        expect(block.previousHash).toEqual(previousBlock.hash);
        expect(block.hash).toEqual(hash);
        expect(block.data).toEqual(data);
    });

    it('Use static mine()', () => {
        const block = Block.mine(previousBlock, data);

        expect(block.hash.length).toEqual(64);
        expect(block.previousHash).toEqual(previousBlock.hash);
        expect(block.data).toEqual(data);
    });

    it('Use static hash()', () => {
        hash = Block.hash(timestamp, previousBlock.hash, data);
        
        expect(hash).toEqual('23184417ad4a9587a51986a0b31debb05a31eabd4ef9c50fd1083db62a505d5c');
    });

    it('Use toString()', () => {
        const block = Block.mine(previousBlock, data);

        expect(typeof block.toString()).toEqual('string');
    });
});