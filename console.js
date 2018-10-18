'use strict';

const path = require('path');
const repl = require('repl');
const figlet = require('figlet');
const DLogsAPI = require('./DLogsAPI.js');
const dlogs = new DLogsAPI(3000, '127.0.0.1',
    {
       "appName": "DLogs",
       "artifactDir": "/home/jasonlin/Proj/Playground/dlogs/build/contracts",
       "conditionDir": "/home/jasonlin/Proj/Playground/ethsf_dlogs/conditions",
       "contracts": [{ "ctrName": "DLogs", "conditions": ["Sanity"] }],
       "networkID": 4,
       "version": "1.0"	
    }
);

// Temporary solution before UI is migrated...
const cfgObjs = {};
let masterpass = 'masterpass';
cfgObjs.geth = require('/home/jasonlin/.rinkeby/config.json');
cfgObjs.ipfs = require('/home/jasonlin/.rinkeby/ipfsserv.json');
dlogs.connectRPC();

const __master_init = (masterpass) => {
        return dlogs.client.request('fully_initialize', cfgObjs)
        .then((rc) => {
                if (!rc.result[0] || !rc.result[1])  throw "Server setup failed ...";
                return dlogs.client.request('hasPass', []);
        })
        .then((rc) => {
                //console.log("DEBUG after hasPass "); console.log(rc);
                if (!rc.result) return dlogs.client.request('unlock', [masterpass]);
                //console.log('server awaken');
                return {result: true};
        })
        .then((rc) => {
                //console.log("DEBUG after unlock "); console.log(rc);
                if (!rc.result) throw "Server awaken failed ...";
                return dlogs.init();
        })
        .then((rc) => {
                //console.log("DEBUG after dapp init "); console.log(rc);
                return dlogs;
        })
}

// ASCII Art!!!
const ASCII_Art = (word) => {
        const _aa = (resolve, reject) => {
                figlet(word, {font: 'Big'}, (err, data) => {
                        if (err) return reject(err);
                        resolve(data);
                })
        }

        return new Promise(_aa);
}

// Handling promises in REPL (for node < 10.x)
const replEvalPromise = (cmd,ctx,filename,cb) => {
  let result=eval(cmd);
  if (result instanceof Promise) {
    return result.then(response=>cb(null,response));
  }
  return cb(null, result);
}

// REPL main function
const terminal = (slogan = 'ElevenBuckets :  BladeIron') => {
  return __master_init(masterpass).then((dlogs) => {
		 return ASCII_Art(slogan)
	})
        .then((art) => {
          console.log(art + "\n");

          let r = repl.start({ prompt: '[-= ElevenBuckets@Web3_Summit_2018 =-]$ ', eval: replEvalPromise });
          r.context = {dlogs};

          r.on('exit', () => {
                  console.log("\n" + 'Stopping CLI...');
                  process.exit(0);
          })
    })
    .catch((err) => {
        console.log(err);
        process.exit(12);
    })
}

// Main
terminal('DLogs  by  ElevenBuckets');
