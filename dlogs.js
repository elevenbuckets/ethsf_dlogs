'use strict';

// External modules
const repl = require('repl');
const fs   = require('fs');
const path = require('path');
const figlet = require('figlet');
const variables = new WeakMap();

// ElevenBuckets SDK modules
const LimeCasks = require('LimeCasks/core/Wrap3.js');
const IPFS_Base = require('ipfs_base/IPFS_GO.js');

// ASCII Art!!!
const ASCII_Art = (word) => {
	const _aa = (resolve, reject) => {
		figlet(word, (err, data) => {
			if (err) return reject(err);
			resolve(data);
		})
	}

	return new Promise(_aa);
}

// extending classes for REPL
class IPFS_REPL extends IPFS_Base {
	constructor(cfpath) {
		super(cfpath);

		// Class methods in constructor to skip babel class transform
		this.pullFile = (ipfshash, outpath) => {
			return this.read(ipfshash).then((r) => {
				fs.writeFileSync(outpath, r);
				return true;
			})
		}

		this.reload = (ipfs) => {
			this.ready = false;
  			return this.stop().then(() => {
	  			console.log("Reset IPFS ...");

	  			return ipfs.start().then(() => { this.ready = true; return true; });
  			})
		}

		this.ping = (nodehash) => { return this.ipfsAPI.ping(nodehash, {count: 3}).then((r) => { return {cmd: r[0].text, count: 3, results: r[4]}}) }
		this.getConfigs = () => { return this.ipfsAPI.config.get().then((b) => { return JSON.parse(b.toString())}); }
		this.setConfigs = (entry, value) => { 
			return this.ipfsAPI.config.set(entry, value).then( () => { 
				return this.ipfsAPI.config.get(entry).then((r) => { return { [entry]: r } });
			}); 
		}

		this.bootnodes = () => { return this.ipfsAPI.bootstrap.list(); }
		this.pullIPNS = (ipnsHash) => {
			let ipfshash = this.resolve(ipnsHash);
			return this.readPath(ipfshash).then((r) => { return JSON.parse(r.toString()); });
		}
	}
}

class DLogsREPL extends LimeCasks {
	constructor(cfpath) {
		super(cfpath);

		variables.set(this, {address: null, password: null});

		this.AppName = 'DLogs';
		this.artifactPath = path.join(this.configs.artifactPath, this.AppName + '.json');

		this.Artifact = JSON.parse(fs.readFileSync(this.artifactPath).toString()); // truffle artifact
		this.ABI = this.Artifact.abi;
		this.contractAddress = this.Artifact.networks[this.networkID].address;

		this.init = (ipfs) => {
			if(!this.connected) return false; // connect first
			this.dapp = this.web3.eth.contract(this.ABI).at(this.contractAddress);
			this.ipfs = ipfs.ipfsAPI;

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

// Class instances
const dlogs = new DLogsREPL('../.local/config.json');
const ipfs  = new IPFS_REPL('../.local/ipfsserv.json');

// Handling promises in REPL (for node < 10.x)
const replEvalPromise = (cmd,ctx,filename,cb) => {
  let result=eval(cmd);
  if (result instanceof Promise) {
    return result.then(response=>cb(null,response));
  }
  return cb(null, result);
} 

// REPL main function
const terminal = (ipfs) => {
  return ipfs.start()
	.then(() => { return dlogs.connect() })
	.then((rc) => { if (rc && dlogs.init(ipfs) ) return ASCII_Art('DLogs  By  ElevenBuckets') })
	.then((art) => {
	  console.log(art + "\n");

  	  let r = repl.start({ prompt: '[-= ElevenBuckets@ETHSF =-]$ ', eval: replEvalPromise });
  	  r.context = {ipfs, dlogs};

  	  r.on('exit', () => {
  		  console.log("\n" + 'Stopping CLI...');
  		  if (ipfs.controller.started) {
			  ipfs.stop().then(() => {
		  		process.exit(0);
		  	  });
		  }
  	  })
    })
    .catch((err) => {
  	console.log(err);
  	process.exit(12);
    })
}

// Main
terminal(ipfs);

