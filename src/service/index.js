import express from 'express';
import bodyParser from 'body-parser';
import Blockchain from '../classes/Blockchain';
import Wallet from '../classes/Wallet';
import P2PService, { MESSAGE } from './p2p';
import Miner from '../classes/Miner';

const { HTTP_PORT = 3000 } = process.env;
const app = express();
const blockchain = new Blockchain();
const wallet = new Wallet(blockchain);
const walletMiner = new Wallet(blockchain, 0);
const p2pService = new P2PService(blockchain);
const miner = new Miner(blockchain, p2pService, walletMiner);

app.use(bodyParser.json());

app.get('/blocks', (req, res) => {
    res.json(blockchain.blocks);
});

app.post('/mine', (req, res) => {
    const { body: { data } } = req;
    const block = blockchain.addBlock(data);

    p2pService.sync();

    res.json({ blocks: blockchain.blocks.length, block });
});

app.get('/transactions', (req, res) => {
    const { memoryPool: { transactions } } = blockchain;

    res.json(transactions);
});

app.post('/transaction', (req, res) => {
    const { body: { recipient, amount } } = req;

    try {
        const txn = wallet.createTransaction(recipient, amount);

        p2pService.broadcast(MESSAGE.TXN, txn);
        res.json(txn);
    } catch (error) {
        console.log('error', error);
        res.json({ error: error.message });
    }
});

app.get('/mine/transactions', (req, res) => {
    try {
        miner.mine();
        res.redirect('/blocks');
    } catch (error) {
        res.json({ error: error.message });
    }
});

app.listen(HTTP_PORT, () => {
    console.log(`Service http:${HTTP_PORT} listening...`);
    p2pService.listen();
});