import { expect } from "@jest/globals";
import adjustDifficulty from "../../modules/adjustDifficulty";

describe('adjustDifficulty()', () => {
    let block;

    beforeEach(() => {
        block = { timestamp: Date.now(), difficulty: 5 };
    });

    it('Lowers the difficulty for slowly mined block', () => {
        expect(adjustDifficulty(block, block.timestamp + 60000)).toEqual(block.difficulty - 1);
    });

    it('Increased the difficulty for quick mined blocks', () => {
        expect(adjustDifficulty(block, block.timestamp + 1000)).toEqual(block.difficulty + 1);
    });
});