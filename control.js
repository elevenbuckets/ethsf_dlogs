'use strict';

const repl = require('repl');
const figlet = require('figlet');
const DLogsAPI = require('./DLogsAPI.js');

const dlogs = new DLogsAPI(
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
dlogs.cfgObjs.geth = require('/home/jasonlin/.rinkeby/config.json');
dlogs.cfgObjs.ipfs = require('/home/jasonlin/.rinkeby/ipfsserv.json');
dlogs.connectRPC(3000)();

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
  return dlogs.init('masterpass') 
        .then((rc) => {
		 if (rc.result) return ASCII_Art(slogan)
	})
        .then((art) => {
          console.log(art + "\n");

          let r = repl.start({ prompt: '[-= BladeIron =-]$ ', eval: replEvalPromise });
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
terminal('DLogs :  BladeIron');
