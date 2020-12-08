#!/usr/bin/env node

const Web3 = require('thinkium-web3js');
const web3 = new Web3();

describe('test-address-convert', function () {
    this.timeout(100000);
    it('convert', done => {
        console.log(web3.Iban.toAddress("TH93112A8NT0RIRPIXR7IXJBB1U0ZBXEB1K"));
        console.log(web3.Iban.fromAddress("0x08d04fc4513e27854ac19f16b9b8cb8d564e2c68").toString());
        done()
    });
});
