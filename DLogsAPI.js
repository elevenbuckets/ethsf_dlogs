'use strict';

// third-parties modules
const fs = require('fs');
const path = require('path');
const variables = new WeakMap();

// 11BE LimeCasks release
const LimeCasks = require('LimeCasks/core/Wrap3.js');

// Main Class
class DLogsAPI extends LimeCasks {
	constructor(cfpath) {
		// parent
		super(cfpath);

		// parameters
		variables.set(this, {address: null, password: null});

		this.AppName = 'DLogs';
		this.artifactPath = path.join(this.configs.artifactPath, this.AppName + '.json');
		this.gasPrice = '9000000000';

		this.Artifact = JSON.parse(fs.readFileSync(this.artifactPath).toString()); // truffle artifact
		this.ABI = this.Artifact.abi;
		this.contractAddress = this.Artifact.networks[this.networkID].address;

		// class methods
		this.init = (ipfs) => {
			if(!this.connected()) return false; // connect first
			this.dapp = this.web3.eth.contract(this.ABI).at(this.contractAddress);
			this.ipfs = ipfs;

			return true;
		}

		this.getAccount = () => { let addr = variables.get(this).address; return addr; }
		this.validPass  = () => { 
			let addr = variables.get(this).address;
			let pass = variables.get(this).password; 

			const _vp = (resolve, reject) => {
				this.ipc3.personal.unlockAccount(addr, pass, (err, result) => {
					if (err) return reject(err);
					resolve(result);
				})
			}

			return new Promise(_vp);
		}

		this.linkAccount = (address, password) => { 
			variables.get(this).address = address;
			variables.get(this).password = password;
			return this.validPass();
		}

		// smart contract function bindings
		this.register = (ipnsHash) => {
			let address = this.getAccount();

			if (address === null) return false;

			let passwd = variables.get(this).password;
			let gasest = this.dapp.register.estimateGas(address, ipnsHash); 

			return this.unlockViaIPC(passwd)(address).then((r) => {
				console.log(`Registering address ${address} using IPNS ${ipnsHash}`);
				return this.dapp.register(address, ipnsHash, {from: address, gas: gasest, gasPrice: this.gasPrice});	
			})
		}

		this.unregister = () => {
			let address = this.getAccount();

			if (address === null) return false;

			let passwd  = variables.get(this).password;
			let gasest = this.dapp.unregister.estimateGas(address); 

			return this.unlockViaIPC(passwd)(address).then((r) => {
				console.log(`Unregistering address ${address}`);
				return this.dapp.unregister(address, {from: address, gas: gasest, gasPrice: this.gasPrice});	
			})
		}

		this.lookUpByAddr = (address) => {
			return this.dapp.addr2ipns(address);
		}

		this.lookUpByIPNS = (ipnsHash) => {
			return this.dapp.ipns2addr(ipnsHash);
		}

		this.bytes32ToAscii = (b) => {
			return this.web3.toAscii(this.web3.toHex(this.web3.toBigNumber(String(b))))
		}

		this.parseEntry = (entry, idx) => {  // entry is one element returned from this.dapp.browse() smart contract call
			let firstPart = this.bytes32ToAscii(entry[idx][0]);
			let secondPart = this.bytes32ToAscii(entry[idx][1].substr(0,30));
			let ipnsHash = firstPart + secondPart;
			let address = this.byte32ToAddress(entry[idx][2]);

			return {address, ipnsHash};
		}
	}
}

module.exports = DLogsAPI;
