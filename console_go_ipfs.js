'use strict';

// External modules
const repl = require('repl');
const fs   = require('fs');

// ElevenBuckets SDK modules
const limeCask = require('LimeCasks/core/Wrap3.js');
const ipfsBase = require('ipfs_base/IPFS_GO.js');

// extending classes for REPL
class ipfsREPL extends ipfsBase {
	constructor(cfpath) {
		super(cfpath);

		// Class methods in constructor to skip babel class transform
		this.pullFile = (ipfshash, outpath) => {
			return this.read(ipfshash).then((r) => {
				fs.writeFileSync(outpath, r);
				return true;
			})
		}

		this.reload = () => {
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

	}
}


// Class instances
const ciapi = new limeCask('./.local/config.json');
const ipfs  = new ipfsREPL('./.local/ipfsserv.json');

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
  return ipfs.start().then(() => {
  	  let r = repl.start({ prompt: '[CastIron]$ ', eval: replEvalPromise });
  	  r.context = {ipfs, ciapi};

  	  r.on('exit', () => {
  		  console.log('Thank you for using CastIron CLI...');
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

