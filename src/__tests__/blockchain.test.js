import { expect } from '@jest/globals';
import Block from '../classes/Block'
import Blockchain from '../classes/Blockchain';

describe('Blockchain', () => {
    let blockchain;
    let blockchainB;

    beforeEach(() => {
        blockchain = new Blockchain();
        blockchainB = new Blockchain();
    });

    it('Every blockchain has a genesis block', () => {
        const [genesisBlock] = blockchain.blocks;

        expect(genesisBlock).toEqual(Block.genesis);
        expect(blockchain.blocks.length).toEqual(1);
    });

    it('Use addBlock()', () => {
        const data = 'd4t4';
        blockchain.addBlock(data);

        const [, lastBlock] = blockchain.blocks;

        expect(lastBlock.data).toEqual(data);
        expect(blockchain.blocks.length).toEqual(2);
    });

    it('Replaces the chain with a valid chain', () => {
        blockchainB.addBlock('bl0ck-1');
        blockchain.replace(blockchainB.blocks);

        expect(blockchain.blocks).toEqual(blockchainB.blocks);
    });

    it('Does not replace the chain with one with less blocks', () => {
        blockchain.addBlock('bl0ck-1');

        expect(() => {
            blockchain.replace(blockchainB.blocks);
        }).toThrowError('Received chain is not longer than current chain');
    });

    it('Not replace the chain with one is not valid', () => {
        blockchainB.addBlock('bl0ck-1');
        blockchainB.blocks[1].data = 'bl0ck-h4ck3d';

        expect(() => {
            blockchain.replace(blockchainB.blocks);
        }).toThrowError('Received chain is invalid');
    });
});