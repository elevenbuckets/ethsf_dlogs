'use strict';

const fs   = require('fs');
const path = require('path');

// 11BE BladeIron Client API
const BladeIronClient = require('./BladeAPI.js');

class DLogsAPI extends BladeIronClient {
	constructor(options) {
		super(options);

		this.ctrName = 'DLogs'; // there's only one smart contract in this app, so we can just define it here.
		this.bindAddr = '0x';
		
		this.linkAccount = (address) => 
		{ 
			return this.client.request('setAccount', [address])
				   .then(() => { this.bindAddr = address; return {result: true}; });
		}

		this.getAccount = () => { return this.bindAddr } // synchronous

		// mapping rest of original functions
		this.register = (ipnsHash) => 
		{ 
			if (this.bindAddr == '0x') {
				return Promise.reject(false); 
			} else {
				return this.sendTk(this.ctrName)('register')(this.bindAddr, ipnsHash)();
			}
		}

		this.unregister = () => 
		{
			if (this.bindAddr == '0x') {
				return Promise.reject(false); 
			} else {
				return this.sendTk(this.ctrName)('unregister')(this.bindAddr)();
			}
		}

		// constant function calls are now also promises, due to RPC interaction
		this.lookUpByAddr = (address) =>
		{
			return this.call(this.ctrName)('addr2ipns')(address)
				   .then((rc) => { return rc.result })
				   .catch((err) => { console.log(err); return 'Qm';});
		}

		this.lookUpByIPNS = (ipnsHash) =>
		{
			return this.call(this.ctrName)('ipns2addr')(ipnsHash)
				   .then((rc) => { return rc.result })
				   .catch((err) => { console.log(err); return '0x';});
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
                        return this.client.request('call', {appName: this.appName, ctrName: this.ctrName, callName: 'browse', args: [start, end]})
			    .then((rc) => {
				 let entry = rc.result;
                        	 return entry.map((e) => { return this.parseEntry([e], 0) });
			    })
		}
	}
}

module.exports = DLogsAPI;
