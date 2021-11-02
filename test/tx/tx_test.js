#!/usr/bin/env node
const chai = require('chai');
const assert = chai.assert;
const BigNumber = require('bignumber.js');

const Web3 = require('thinkium-web3js');
const web3 = new Web3();
const sleep = require('../common/my_util').sleep;
const constants = require('../common/constants');

web3.setProvider(new web3.providers.HttpProvider(constants._test_rpc_host));
web3.thk.defaultPrivateKey = constants._test_wallet.privateKey;
web3.thk.defaultAddress = constants._test_wallet.address;
web3.thk.defaultChainId = "1";
_toAddress = constants._test_wallet.address;

describe('tx', function () {
    this.timeout(100000);
    it('send-tx', done => {
        const fromAccountAtFromChain = web3.thk.GetAccount(web3.thk.defaultChainId, web3.thk.defaultAddress);
        console.log("fromAccountAtFromChain :", fromAccountAtFromChain);

        let value = new BigNumber(`0.1`).multipliedBy('1e+18');

        let tx = {
            chainId: web3.thk.defaultChainId,
            fromChainId: web3.thk.defaultChainId,
            toChainId: web3.thk.defaultChainId,
            from: web3.thk.defaultAddress,
            to: _toAddress,
            nonce: fromAccountAtFromChain.nonce.toString(),
            value: value.toString(10),
            input: ""
        };

        let signedTx = web3.thk.signTransaction(tx, web3.thk.defaultPrivateKey);
        console.log("signedTx:", signedTx);

        let txRes = web3.thk.SendTx(signedTx);
        console.log("sendTx response:", txRes);

        if (!txRes || !txRes.TXhash) {
            assert.fail("sendTx fail");
        } else {
            sleep(7);
            let txInfo = web3.thk.GetTransactionByHash(web3.thk.defaultChainId, txRes.TXhash);
            console.log("txInfo:", txInfo);
            done();
        }
    });
});
