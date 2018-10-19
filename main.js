'use strict';

const path = require('path');
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

<<<<<<< HEAD
// extending classes for REPL
class IPFS_REPL extends IPFS_Base {
	constructor(cfpath) {
		super(cfpath);

		// local IPNS cache
		this.localCache = {};
		this.resolveTimer;

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

		this.resolve = (ipnsHash) => {
                      /*
			const __resolve_background = (resolve, reject) => {
				try {
					let result = this.ipfsAPI.name.resolve(ipnsHash);
					this.localCache[ipnsHash] = {seen: Date.now(), result};
					resolve();
				} catch (err) {
					reject(err);
				}
			}
		      */

		        const __resolve_background = () => {
				return setTimeout(() => {
					let result = this.ipfsAPI.name.resolve(ipnsHash);
					this.localCache[ipnsHash] = {seen: Date.now(), result};
				});
			}

			if (ipnsHash in this.localCache) {
				console.log(`DEBUG: using cache`);
				if (Date.now() - this.localCache[ipnsHash].seen >= 30000) {
					console.log(`DEBUG: cache will be refreshed`);
					this.resolveTimer = __resolve_background();
				}
				return this.localCache[ipnsHash].result;
			} else {
				console.log(`DEBUG: initalizing new query ...`);
				let result = this.ipfsAPI.name.resolve(ipnsHash);
				this.localCache[ipnsHash] = {seen: Date.now(), result};
				return result;
			}
		}

		this.bootnodes = () => { return this.ipfsAPI.bootstrap.list(); }
		this.pullIPNS = (ipnsHash) => {
			return this.resolve(ipnsHash)
				.then((ipfshash) => { return this.readPath(ipfshash) })
				.then((r) => { return JSON.parse(r.toString()); });
		}
		this.myid = () => { return this.ipfsAPI.id() }
	}
}

// Class instances
const ipfs  = new IPFS_REPL('.local/ipfsserv.json');

=======
>>>>>>> master
// electron window global object
let win;

if (process.argv[2] === '--gui' || '__GUI__' in process.env) {
	const { execFile } = require('child_process');

        if (path.basename(process.argv[0]) === 'node') {
                execFile('./node_modules/.bin/electron', ['.'], {env: {'__GUI__': true, ...process.env}}, (error, stdout, stderr) => {
                        if (error) throw error;
                });
        } else if (path.basename(process.argv[0]) === 'electron') {
		// electron main.js 
		const {app, BrowserWindow, ipcMain} = require('electron');
		const url = require('url');
		const createWindow = () => {
		  // Create the browser window.
		  dlogs.init('masterpass').then((rc) => {
		    win = new BrowserWindow({minWidth: 1280, minHeight: 960, resizable: true, icon: path.join(__dirname, 'public', 'assets', 'icon', '11be_logo.png')});
		    win.setMenu(null);
		
		    // and load the index.html of the app.
		    win.loadURL(url.format({
		      pathname: path.join(__dirname, '/public/index.html'),
		      protocol: 'file:',
		      slashes: true
		    }))
		
		    global.dlogs  = dlogs;
		
		    // Open the DevTools.
		    win.webContents.openDevTools()
		
		    // Emitted when the window is closed.
		    win.on('closed', () => {
		      // Dereference the window object, usually you would store windows
		      // in an array if your app supports multi windows, this is the time
		      // when you should delete the corresponding element.
		      win = null
		    })
		  })
		}
	
		app.on('ready', createWindow)
	
		// Whole process reloader via ipcRenderer for config reload
		ipcMain.on('reload', (e, args) => {
		        app.relaunch();
		        app.exit();
		});
		
		// Quit when all windows are closed.
		app.on('window-all-closed', () => {
		  // On macOS it is common for applications and their menu bar
		  // to stay active until the user quits explicitly with Cmd + Q
		  if (process.platform !== 'darwin') {
		    app.quit()
		  }
		})
		
		app.on('activate', () => {
		  // On macOS it's common to re-create a window in the app when the
		  // dock icon is clicked and there are no other windows open.
		  if (win === null) {
		    createWindow()
		  }
		})
	}
} else if (process.argv[2] === '--cli') {
<<<<<<< HEAD
	const DLogsAPI = require('./DLogsAPI.js');
	const dlogs = new DLogsAPI('.local/config.json');

=======
>>>>>>> master
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
	  return dlogs.init('masterpass')  // should use readline to get master pass here
	        .then((rc) => {
			 if (rc.result) return ASCII_Art(slogan)
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
}
