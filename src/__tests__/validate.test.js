import { expect } from '@jest/globals';
import Blockchain from '../classes/Blockchain';
import validate from '../modules/validate';

describe('validate()', () => {
    let blockchain;

    beforeEach(() => {
        blockchain = new Blockchain();
    });

    it('Validates a valid chain', () => {
        blockchain.addBlock('block-1');
        blockchain.addBlock('block-2');

        expect(validate(blockchain.blocks)).toBe(true);
    });

    it('Invalidates a chain with a corrupt genesis block', () => {
        blockchain.blocks[0].data = 'b4d_d4t4';

        expect(() => {
            validate(blockchain.blocks);
        }).toThrowError('Invalid genesis block');
    });

    it('Invalidates a chain with a corrupt previousHash within a block', () => {
        blockchain.addBlock('block-1');
        blockchain.blocks[1].previousHash = 'h4ck';

        expect(() => {
            validate(blockchain.blocks)
        }).toThrowError('Invalid previous hash');
    });

    it('Invalidates a chain with a corrupt hash within a block', () => {
        blockchain.addBlock('block-1');
        blockchain.blocks[1].hash = 'h4ck';

        expect(() => {
            validate(blockchain.blocks)
        }).toThrowError('Invalid hash');
    });
});