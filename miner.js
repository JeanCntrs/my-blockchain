import Blockchain from './src/classes/Blockchain';

const blockchain = new Blockchain();

for (let i = 0; i < 10; i++) {
    const block = blockchain.addBlock(`block-${i + 1}`);
    console.log(block.toString());
}