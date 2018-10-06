const remote = require('electron').remote;
const ipfs = remote.getGlobal('ipfs');
const DLogsAPI = require('../DLogsAPI.js');

let dlogs = new DLogsAPI('../.local/config.json');

ipfs.ipfsAPI.id()
  .then((o) => { console.log(JSON.stringify(o,0,2)) })
  .then(() => { return dlogs.connect() })
  .then(() => { return dlogs.init(ipfs) })
  .then((r) => { if (r) console.log(dlogs.web3.eth.blockNumber) })
