import PKG from './package.json';
import Block from './src/class/Block';

const { name, version } = PKG;

console.log(`${name} - ${version}`);

const { genesis } = Block;
console.log(genesis.toString());

const block = new Block(Date.now(), genesis.hash, 'hash', 'data');
console.log(block.toString());

const block2 = new Block(Date.now(), block.hash, 'h4sh', 'new data');
console.log(block2.toString());