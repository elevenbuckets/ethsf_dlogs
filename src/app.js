import MainView from "./view/MainView";
import React from "react";
import ReactDom from "react-dom";

const remote = require('electron').remote;
const ipfs = remote.getGlobal('ipfs');
const DLogsAPI = require('../DLogsAPI.js');

const dlogs = new DLogsAPI('../.local/config.json');

ipfs.ipfsAPI.id()
  .then((o) => { console.log(JSON.stringify(o,0,2)) })
  .then(() => { return dlogs.connect() })
  .then(() => { return dlogs.init(ipfs) })
  .then((r) => { if (r) console.log(dlogs.web3.eth.blockNumber) })

ReactDom.render(<MainView />, document.getElementById("app"))
