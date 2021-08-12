import express from 'express';
import bodyParser from 'body-parser';
import Blockchain from '../classes/Blockchain';

const { HTTP_PORT = 3000 } = process.env;
const app = express();
const blockchain = new Blockchain();

app.use(bodyParser.json());

app.get('/blocks', (req, res) => {
    res.json(blockchain.blocks);
});

app.listen(HTTP_PORT, () => {
    console.log(`Service is running on port:${HTTP_PORT}`);
});