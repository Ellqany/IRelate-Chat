import dotenv from 'dotenv';

const {
    JwtGenerator
} = require('virgil-sdk');

const {
    initCrypto,
    VirgilCrypto,
    VirgilAccessTokenSigner
} = require('virgil-crypto');


dotenv.config();
const start = async () => {
    await initCrypto();

    const virgilCrypto = new VirgilCrypto();

    return new JwtGenerator({
        appId: process.env.VIRGIL_APP_ID,
        apiKeyId: process.env.VIRGIL_KEY_ID,
        apiKey: virgilCrypto.importPrivateKey(process.env.VIRGIL_PRIVATE_KEY),
        accessTokenSigner: new VirgilAccessTokenSigner(virgilCrypto)
    });
    // And now you can do this anywhere in your app
};



exports.virgilCredentials = async (req, res) => {
    const generator = await start();
    const virgilJwtToken = generator.generateToken(req.user.sender);

    res.json({
        token: virgilJwtToken.toString(),
        pwd: process.env.VIRGIL_PRIVATE_KEY
    });
};