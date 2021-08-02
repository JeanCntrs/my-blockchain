import PKG from "./package.json";
import Block from "./src/class/Block";

const { name, version } = PKG;

console.log(`${name} - ${version}`);

const block = new Block(Date.now(), "previous_hash", "hash", "data");
console.log(block.toString());
