'use strict';

// External modules
const repl = require('repl');
const fs   = require('fs');

// ElevenBuckets SDK modules
const castIron = require('CastIron/core/CastIron.js');
const ipfsBase = require('ipfs_base/IPFS_Base.js');

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
	}
}


// Class instances
const ipfs  = new ipfsREPL('./.local/config.json');
const ciapi = new castIron('./.local/config.json');

// Handling promises in REPL (for node < 10.x)
const replEvalPromise = (cmd,ctx,filename,cb) => {
  let result=eval(cmd);
  if (result instanceof Promise) {
    return result.then(response=>cb(null,response));
  }
  return cb(null, result);
} 

// Main
ipfs.start()
  .then(() => {
	  let r = repl.start({ prompt: '[CastIron]$ ', eval: replEvalPromise });
	  r.context = {ipfs, ciapi};
	  r.on('exit', () => {
		  console.log('Thank you for using CastIron CLI...');
		  ipfs.stop();
		  process.exit(0);
	  })
  })
  .catch((err) => {
	console.log(err);
	process.exit(12);
  })

