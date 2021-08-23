import Elliptic from 'elliptic';
import genHash from './genHash';

const ec = Elliptic.ec('secp256k1');

export default {
    createKeyPair: () => ec.genKeyPair(),
    verifySignature: (publicKey, signature, data) => {
        return ec.keyFromPublic(publicKey, 'hex').verify(genHash(data), signature);
    }
};