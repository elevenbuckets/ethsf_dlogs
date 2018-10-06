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

			let passwd  = variables.get(this).password;

			return this.unlockViaIPC(passwd)(address).then((r) => {
				console.log(`Registering address ${address} using IPNS ${ipnsHash}`);
				return this.dapp.register(address, ipnsHash, {from: address});	
			})
		}

		this.unregister = () => {
			let address = this.getAccount();

			if (address === null) return false;

			let passwd  = variables.get(this).password;

			return this.unlockViaIPC(passwd)(address).then((r) => {
				console.log(`Unregistering address ${address}`);
				return this.dapp.unregister(address, {from: address});	
			})
		}

		this.lookUpByAddr = (address) => {
			return this.dapp.addr2ipns(address);
		}

		this.lookUpByIPNS = (ipnsHash) => {
			return this.dapp.ipns2addr(ipnsHash);
		}
	}
}

module.exports = DLogsAPI;
