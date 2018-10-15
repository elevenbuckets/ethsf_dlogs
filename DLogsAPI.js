'use strict';

const fs   = require('fs');
const path = require('path');

// 11BE BladeIron Client API
const BladeIronClient = require('./BladeAPI.js');

class DLogsAPI extends BladeIronClient {
	constructor(options) {
		super(options);

		this.ctrName = 'DLogs'; // there's only one, so we can just define it here.
		this.bindAddr = '0x';
		
		this.linkAccount = (address) => { this.bindAddr = address; return this.client.request('setAccount', [address]);
		this.getAccount = () => { return this.bindAddr };

		// This should eventually become standardize, base class function that can handle all kinds of calls 
		// it should learn more from ABI about possible calls. Right now we only have one contract in the app,
		// so the input argument can ignore the ctrName...
		//
		// Usage:
		//
		// 	this.sendTk('register')(address, ipfsHash)(); // default amount is set to null
		//
		this.sendTk = (callName) => (...__args) => (amount = null) => 
		{
			this.gasAmount = 250000; // should have dedicated request for gas estimation

			let tkObj = {};
			__args.map((i,j) => { tkObj = { ...tkObj, ['arg'+j]: i } );
			let args = Object.keys(tkObj).sort();

			return this.client.request('enqueueTk', [this.appName, this.ctrName, callName, args, amount, this.gasAmount, tkObj])
				   .then((rc) => { let jobObj = rc.result; return this.client.request('processJobs', [jobObj]); });
		}

		this.bytes32ToAscii = (b) => {
                        return this.toAscii(this.toHex(this.toBigNumber(String(b))))
                }

		// mapping rest of original functions
		this.register = (ipnsHash) => 
		{ 
			if (this.bindAddr == '0x') {
				return Promise.reject(false); 
			} else {
				return this.sendTk('register')(this.bindAddr, ipnsHash)();
			}
		}

		this.unregister = () => 
		{
			if (this.bindAddr == '0x') {
				return Promise.reject(false); 
			} else {
				return this.sendTk('unregister')(this.bindAddr)();
			}
		}

		// constant function calls are now also promises, due to RPC interaction
		this.lookUpByAddr = (address) =>
		{
			return this.client.request('call', {appName: this.appName, ctrName: this.ctrName, callName: 'addr2ipns', args: [address]})
		}

		this.lookUpByIPNS = (ipnsHash) =>
		{
			return this.client.request('call', {appName: this.appName, ctrName: this.ctrName, callName: 'ipns2addr', args: [ipnsHash]})
		}

		this.parseEntry = (entry, idx) => {  // entry is one element returned from this.dapp.browse() smart contract call
                        let firstPart = this.bytes32ToAscii(entry[idx][0]);
                        let secondPart = this.bytes32ToAscii(entry[idx][1].substr(0,30));
                        let ipnsHash = firstPart + secondPart;
                        let address = this.byte32ToAddress(entry[idx][2]);

                        return {address, ipnsHash};
                }

		this.browse = (start, end) => 
		{
                        this.client.request('call', {appName: this.appName, ctrName: this.ctrName, callName: 'browse', args: [start, end]})
			    .then((rc) => {
				 let entry = rc.result;
                        	 return entry.map((e) => { return this.parseEntry([e], 0) });
			    })
		}	
	}
}
